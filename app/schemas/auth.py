from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserRegister(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=4)
    age: Optional[int] = Field(None, ge=3, le=100)
    role: str = Field("child", pattern="^(child|parent)$")
    parent_pin: Optional[str] = Field(None, min_length=4, max_length=10)
    avatar: Optional[str] = "kili_parrot.png"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    age: Optional[int] = None
    role: str
    email: str
    parent_pin: Optional[str] = None
    level: int
    xp: int
    avatar: Optional[str] = None
    streak_current: int
    streak_best: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    age: Optional[int] = Field(None, ge=3, le=100)
    avatar: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=4)
