from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=64)
    first_name: str
    last_name: str
    phone: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=64)


class UserRead(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    phone: str | None = None
    is_admin: bool
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserRead