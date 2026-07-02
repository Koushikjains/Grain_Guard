from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from app.models.enums import RoleEnum, MembershipPlanEnum

class UserBase(BaseModel):
    name: str = Field(..., max_length=255)
    phone: str = Field(..., max_length=20)
    email: Optional[str] = Field(None, max_length=255)
    role: RoleEnum
    membership_plan: MembershipPlanEnum = MembershipPlanEnum.basic
    kisan_card_or_aadhaar: Optional[str] = Field(None, max_length=50)

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    email: Optional[str] = Field(None, max_length=255)
    membership_plan: Optional[MembershipPlanEnum] = None
    kisan_card_or_aadhaar: Optional[str] = Field(None, max_length=50)

class UserResponse(UserBase):
    id: UUID
    unique_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
