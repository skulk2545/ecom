from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_admin_user, get_current_user
from app.db.dependencies import get_db
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.models.user import User
from app.schemas import OrderCreate, OrderItemCreate, OrderItemRead, OrderRead

router = APIRouter()


def _calculate_item_price(product: Product, quantity: int) -> float:
    effective_price = float(product.price) * (1 - (product.discount or 0) / 100)
    return round(effective_price * quantity, 2)


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OrderRead:
    if not payload.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order must contain items")

    order = Order(user_id=current_user.id, status=OrderStatus.PENDING, total_price=0)
    db.add(order)
    db.flush()  # assign order.id

    total_price = 0.0
    for item in payload.items:
        product = db.query(Product).filter(Product.id == item.product_id).with_for_update().first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product {item.product_id} not found")
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient stock for product {product.name}",
            )

        line_price = _calculate_item_price(product, item.quantity)
        total_price += line_price

        product.stock -= item.quantity

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=line_price,
        )
        db.add(order_item)

    order.total_price = total_price
    db.commit()
    db.refresh(order)
    return order


@router.get("/my", response_model=List[OrderRead])
def list_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[OrderRead]:
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return orders


@router.get("", response_model=List[OrderRead])
def list_all_orders(
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin_user),
) -> list[OrderRead]:
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return orders


@router.patch("/{order_id}/status", response_model=OrderRead)
def update_order_status(
    order_id: int,
    status_value: OrderStatus,
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin_user),
) -> OrderRead:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    order.status = status_value
    db.commit()
    db.refresh(order)
    return order

