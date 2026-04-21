from decimal import Decimal

from pydantic import BaseModel


class AdminProductImageCreate(BaseModel):
    image_url: str
    sort_order: int = 0


class AdminProductAliasCreate(BaseModel):
    alias: str


class AdminProductVariantCreate(BaseModel):
    slug: str
    variant_name: str
    price: Decimal
    compare_at_price: Decimal | None = None
    availability_status: str
    delivery_eta: str | None = None
    stock_quantity: int = 0
    is_box_damaged: bool = False
    is_active: bool = True


class AdminProductCreate(BaseModel):
    name: str
    slug: str
    series: str
    product_number: str
    category: str
    subcategory: str | None = None
    short_description: str | None = None
    rarity: str
    is_new: bool = False
    is_active: bool = True
    images: list[AdminProductImageCreate]
    aliases: list[AdminProductAliasCreate]
    variants: list[AdminProductVariantCreate]


class AdminProductUpdate(AdminProductCreate):
    pass