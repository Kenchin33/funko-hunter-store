from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class ProductImageRead(BaseModel):
    id: int
    image_url: str
    sort_order: int

    model_config = ConfigDict(from_attributes=True)


class ProductAliasRead(BaseModel):
    id: int
    alias: str

    model_config = ConfigDict(from_attributes=True)


class ProductRead(BaseModel):
    id: int
    name: str
    slug: str
    category: str
    subcategory: str | None = None
    series: str
    product_number: str | None = None
    price: Decimal
    short_description: str
    rarity: str
    availability_status: str
    delivery_eta: str | None = None
    stock_quantity: int
    is_new: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime
    images: list[ProductImageRead] = []
    aliases: list[ProductAliasRead] = []

    model_config = ConfigDict(from_attributes=True)