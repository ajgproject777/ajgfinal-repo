import uuid
from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field, ConfigDict

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, description="Password must be at least 8 characters")
    name: str = Field(min_length=2, max_length=255)
    phone: Optional[str] = Field(default=None, max_length=30)
    role: Literal["traveller", "owner"] = "traveller"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(description="Access token lifespan in seconds")

class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(min_length=20, description="Raw refresh token string provided at login")

class RevokeTokenRequest(BaseModel):
    refresh_token: str = Field(min_length=20, description="Raw refresh token string to revoke")

class UserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    name: str
    role: str
    phone: Optional[str] = None
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class MessageResponse(BaseModel):
    message: str

class HealthResponse(BaseModel):
    status: str
    app: str
    version: str
    environment: str
    database: Optional[str] = None
