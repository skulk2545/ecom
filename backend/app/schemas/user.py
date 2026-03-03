from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole


class UserBase(BaseModel):
    name: str = Field(..., max_length=255)
    email: EmailStr


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class AdminUserCreate(UserCreate):
    code: str = Field(..., min_length=4)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRead(UserBase):
    id: int
    role: UserRole

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str
    role: UserRole

