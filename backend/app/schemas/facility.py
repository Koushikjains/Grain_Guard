from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Dict, Any
from app.models.enums import StorageTypeEnum

class FacilityBase(BaseModel):
    name: str = Field(..., max_length=255)
    address: str = Field(..., max_length=500)
    storage_type: StorageTypeEnum
    accepted_grains: List[str] = Field(default_factory=list)
    best_grain: Optional[str] = Field(None, max_length=255)
    security_details: Optional[str] = Field(None, max_length=1000)
    google_maps_link: Optional[str] = Field(None, max_length=500)
    promo_links: Optional[str] = Field(None, max_length=500)
    pricing_structure: Optional[Dict[str, Any]] = None
    capacity_kg: float = 0.0
    capacity_quintal: float = 0.0
    capacity_ton: float = 0.0

class FacilityCreate(FacilityBase):
    pass

class FacilityUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    address: Optional[str] = Field(None, max_length=500)
    storage_type: Optional[StorageTypeEnum] = None
    accepted_grains: Optional[List[str]] = None
    best_grain: Optional[str] = Field(None, max_length=255)
    security_details: Optional[str] = Field(None, max_length=1000)
    google_maps_link: Optional[str] = Field(None, max_length=500)
    promo_links: Optional[str] = Field(None, max_length=500)
    pricing_structure: Optional[Dict[str, Any]] = None
    capacity_kg: Optional[float] = None
    capacity_quintal: Optional[float] = None
    capacity_ton: Optional[float] = None
    available_capacity_kg: Optional[float] = None

class FacilityResponse(FacilityBase):
    id: UUID
    owner_id: UUID
    available_capacity_kg: float

    model_config = ConfigDict(from_attributes=True)
