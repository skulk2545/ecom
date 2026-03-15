from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.schemas.cart_schema import (
    CartItemCreate,
    CartItemUpdate,
    CartItemResponse
)
from app.utils.security import get_current_user

router = APIRouter(prefix="/cart", tags=["Cart"])


def get_or_create_cart(db: Session, user_id: int):
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


# ---------------- VIEW CART ---------------- #

@router.get("/", response_model=List[CartItemResponse])
def view_cart(db: Session = Depends(get_db), user=Depends(get_current_user)):
    cart = get_or_create_cart(db, user.id)
    return db.query(CartItem).filter(CartItem.cart_id == cart.id).all()


# ---------------- ADD TO CART ---------------- #

@router.post("/", response_model=CartItemResponse)
def add_to_cart(
    item: CartItemCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    cart = get_or_create_cart(db, user.id)

    product = db.query(Product).filter(Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == item.product_id
    ).first()

    if existing_item:
        existing_item.quantity += item.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item

    new_item = CartItem(
        cart_id=cart.id,
        product_id=item.product_id,
        quantity=item.quantity
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


# ---------------- UPDATE QUANTITY ---------------- #

@router.put("/{item_id}", response_model=CartItemResponse)
def update_cart_item(
    item_id: int,
    item_update: CartItemUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    cart = get_or_create_cart(db, user.id)

    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    cart_item.quantity = item_update.quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item


# ---------------- REMOVE ITEM ---------------- #

@router.delete("/{item_id}")
def remove_cart_item(
    item_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    cart = get_or_create_cart(db, user.id)

    cart_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(cart_item)
    db.commit()

    return {"message": "Item removed from cart"}