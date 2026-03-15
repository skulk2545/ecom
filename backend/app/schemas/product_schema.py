from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price: float
    discount: float = 0
    stock: int
    image_url: str | None = None

class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    discount: float | None = None
    stock: int | None = None
    image_url: str | None = None


class ProductResponse(BaseModel):
    id: int
    name: str
    description: str | None
    price: float
    discount: float
    stock: int
    image_url: str | None

    class Config:
        from_attributes = True