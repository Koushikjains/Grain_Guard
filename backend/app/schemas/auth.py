from pydantic import BaseModel, Field
from typing import Optional
from app.models.enums import RoleEnum

class SendOTPRequest(BaseModel):
    phone: str = Field(..., description="Mobile phone number")

class VerifyOTPRequest(BaseModel):
    phone: str = Field(..., description="Mobile phone number")
    otp: str = Field(..., description="6-digit OTP code")
    role: Optional[RoleEnum] = Field(None, description="Role to update to if already registered")

class VerifyOTPResponse(BaseModel):
    is_registered: bool
    message: str
    access_token: Optional[str] = None
    token_type: Optional[str] = None

class RegisterRequest(BaseModel):
    name: str = Field(..., description="Full Name")
    phone: str = Field(..., description="Mobile phone number")
    address: str = Field(..., description="Full Address")
    role: RoleEnum = Field(..., description="Farmer or Owner")
    kisan_card_or_aadhaar: str = Field(..., description="Aadhaar number or Kisan Card. Required for farmers, Aadhaar required for owners.")

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
