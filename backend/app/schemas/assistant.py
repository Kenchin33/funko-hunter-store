from decimal import Decimal
from datetime import datetime

from pydantic import BaseModel, Field


class AssistantProductVariantRead(BaseModel):
    slug: str
    variant_name: str
    price: Decimal
    compare_at_price: Decimal | None = None
    availability_status: str
    delivery_eta: str | None = None
    stock_quantity: int
    is_box_damaged: bool


class AssistantProductImageRead(BaseModel):
    image_url: str
    sort_order: int


class AssistantProductRead(BaseModel):
    id: int
    name: str
    slug: str
    series: str
    product_number: str
    category: str
    subcategory: str | None = None
    short_description: str
    rarity: str
    is_new: bool
    images: list[AssistantProductImageRead]
    variants: list[AssistantProductVariantRead]


class AssistantComplaintPhotoCreate(BaseModel):
    image_url: str


class AssistantComplaintCreate(BaseModel):
    email: str | None = None
    order_number: str | None = None
    complaint_number: str | None = None
    topic: str
    message: str
    photos: list[AssistantComplaintPhotoCreate] = Field(default_factory=list)
    source: str = "assistant"

class AssistantOrdersStatusRead(BaseModel):
    order_number: str
    email: str
    status: str
    total_amount: Decimal
    created_at: datetime
    tracking_number: str | None = None