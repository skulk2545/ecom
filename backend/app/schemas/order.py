from datetime import datetime
from decimal import Decimal
from typing import List

from pydantic import BaseModel, Field

from app.models.order import OrderStatus


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)


class OrderItemRead(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: Decimal

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]


class OrderRead(BaseModel):
    id: int
    total_price: Decimal
    status: OrderStatus
    created_at: datetime
    items: list[OrderItemRead]

    class Config:
        from_attributes = True

