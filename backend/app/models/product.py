from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, DateTime, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)

    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    subcategory: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)

    series: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    product_number: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)

    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    short_description: Mapped[str] = mapped_column(Text, nullable=False)

    rarity: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    availability_status: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    delivery_eta: Mapped[str | None] = mapped_column(String(255), nullable=True)
    stock_quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    is_new: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    images = relationship(
        "ProductImage",
        back_populates="product",
        cascade="all, delete-orphan",
        order_by="ProductImage.sort_order",
    )

    aliases = relationship(
        "ProductAlias",
        back_populates="product",
        cascade="all, delete-orphan",
    )