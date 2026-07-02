from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Dict, Any
from app.models.enums import EscrowStatusEnum

class ContractBase(BaseModel):
    escrow_status: EscrowStatusEnum = EscrowStatusEnum.held
    farmer_approval: bool = False
    owner_approval: bool = False
    metadata_columns: Optional[Dict[str, Any]] = None

class ContractCreate(ContractBase):
    booking_id: UUID

class ContractUpdate(BaseModel):
    escrow_status: Optional[EscrowStatusEnum] = None
    farmer_approval: Optional[bool] = None
    owner_approval: Optional[bool] = None
    metadata_columns: Optional[Dict[str, Any]] = None

class ContractResponse(ContractBase):
    id: UUID
    booking_id: UUID

    model_config = ConfigDict(from_attributes=True)
