from __future__ import annotations
from pydantic import BaseModel, EmailStr, field_validator
from typing import Literal


UserRole = Literal["TRAINEE", "EMPLOYER", "TRAINING_INSTITUTE", "GOVERNMENT_ADMIN", "SUPER_ADMIN"]


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = "TRAINEE"
    organization: str | None = None

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: "UserResponse"


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    organization: str | None = None
    created_at: str | None = None


TokenResponse.model_rebuild()
