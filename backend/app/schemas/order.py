from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr


class OrderItemCreate(BaseModel):
    product_id: int
    variant_id: int
    product_name: str
    variant_name: str
    image_url: str | None = None
    price: Decimal
    quantity: int


class OrderCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    city: str
    branch: str
    items: list[OrderItemCreate]


class OrderItemRead(BaseModel):
    id: int
    product_id: int
    product_name_snapshot: str
    image_url_snapshot: str | None = None
    price_snapshot: Decimal
    quantity: int

    model_config = ConfigDict(from_attributes=True)


class OrderRead(BaseModel):
    id: int
    order_number: str
    customer_first_name: str
    customer_last_name: str
    customer_email: str
    customer_phone: str
    delivery_city: str
    delivery_branch: str
    status: str
    total_amount: Decimal
    created_at: datetime
    items: list[OrderItemRead]

    model_config = ConfigDict(from_attributes=True)