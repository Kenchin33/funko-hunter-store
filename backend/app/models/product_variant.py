from sqlalchemy import Boolean, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    slug: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    variant_name: Mapped[str] = mapped_column(String(255), nullable=False)

    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    compare_at_price: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)

    availability_status: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    delivery_eta: Mapped[str | None] = mapped_column(String(255), nullable=True)
    stock_quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    is_box_damaged: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    product = relationship("Product", back_populates="variants")