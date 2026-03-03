from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field, HttpUrl


class ProductBase(BaseModel):
    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    price: Decimal = Field(..., gt=0)
    stock: int = Field(..., ge=0)
    discount: float = Field(0, ge=0, le=100)
    image_url: Optional[HttpUrl] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    discount: Optional[float] = Field(None, ge=0, le=100)
    image_url: Optional[HttpUrl] = None


class ProductRead(ProductBase):
    id: int

    class Config:
        from_attributes = True

