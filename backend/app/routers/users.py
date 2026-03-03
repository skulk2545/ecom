from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.security import get_current_admin_user, get_current_user
from app.db.dependencies import get_db
from app.models.user import User
from app.models.order import Order
from app.models.product import Product
from app.schemas import UserRead

router = APIRouter()


@router.get("/me", response_model=UserRead)
async def read_current_user(current_user: User = Depends(get_current_user)) -> UserRead:
    return current_user


@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    _admin=Depends(get_current_admin_user),
):
    total_orders = db.query(Order).count()
    active_products = db.query(Product).count()
    total_revenue = db.query(func.sum(Order.total_price)).scalar() or 0.0
    return {
        "total_revenue": float(total_revenue),
        "total_orders": total_orders,
        "active_products": active_products
    }

