from decimal import Decimal

from sqlalchemy import DECIMAL, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    price: Mapped[Decimal] = mapped_column(DECIMAL(10, 2), nullable=False)
    stock: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    discount: Mapped[float] = mapped_column(nullable=False, default=0.0)  # 0-100 percentage
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    order_items = relationship("OrderItem", back_populates="product", cascade="all, delete-orphan")

