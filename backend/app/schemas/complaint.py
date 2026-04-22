from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ComplaintPhotoCreate(BaseModel):
    image_url: str


class ComplaintCreate(BaseModel):
    email: str | None = None
    order_number: str | None = None
    complaint_number: str | None = None
    topic: str
    message: str
    photos: list[ComplaintPhotoCreate] = Field(default_factory=list)
    source: str = "assistant"


class ComplaintPhotoRead(BaseModel):
    id: int
    image_url: str

    model_config = ConfigDict(from_attributes=True)


class ComplaintRead(BaseModel):
    id: int
    complaint_number: str
    email: str | None = None
    order_number: str | None = None
    topic: str
    message: str
    status: str
    source: str
    is_resolved: bool
    created_at: datetime
    updated_at: datetime
    photos: list[ComplaintPhotoRead]

    model_config = ConfigDict(from_attributes=True)


class ComplaintStatusUpdate(BaseModel):
    status: str