from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from app.models.enums import BookingStatusEnum

class BookingBase(BaseModel):
    crop_types: List[str] = Field(default_factory=list)
    quantity: float
    duration_months: int
    total_cost: float
    status: BookingStatusEnum = BookingStatusEnum.pending
    response_deadline: Optional[datetime] = None

class BookingCreate(BookingBase):
    facility_id: UUID

class BookingStatusUpdate(BaseModel):
    status: BookingStatusEnum = Field(..., description="Target status (e.g., accepted, declined)")

class BookingUpdate(BaseModel):
    crop_types: Optional[List[str]] = None
    quantity: Optional[float] = None
    duration_months: Optional[int] = None
    total_cost: Optional[float] = None
    status: Optional[BookingStatusEnum] = None
    response_deadline: Optional[datetime] = None

class BookingResponse(BookingBase):
    id: UUID
    farmer_id: UUID
    facility_id: UUID

    model_config = ConfigDict(from_attributes=True)
