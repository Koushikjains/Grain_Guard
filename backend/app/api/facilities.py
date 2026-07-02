import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.core.security import require_owner, require_farmer
from app.models.user import User
from app.models.facility import Facility
from app.models.telemetry import FacilityTelemetry
from app.models.enums import StorageTypeEnum
from app.schemas.facility import FacilityCreate, FacilityUpdate, FacilityResponse
from app.schemas.telemetry import TelemetryCreate, TelemetryResponse

router = APIRouter(prefix="/api/facilities", tags=["facilities"])

# ==========================================
# OWNER ENDPOINTS
# ==========================================

@router.post("", response_model=FacilityResponse, status_code=status.HTTP_201_CREATED)
async def create_facility(
    facility_in: FacilityCreate, 
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Creates a new facility and assigns it to the authenticated owner.
    Initializes available_capacity_kg to match total capacity_kg.
    """
    facility = Facility(
        owner_id=current_user.id,
        **facility_in.model_dump(),
        available_capacity_kg=facility_in.capacity_kg
    )
    db.add(facility)
    await db.commit()
    await db.refresh(facility)
    return facility

@router.get("/me", response_model=List[FacilityResponse])
async def list_my_facilities(
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns all facilities owned by the current owner.
    """
    stmt = select(Facility).where(Facility.owner_id == current_user.id)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.put("/{facility_id}", response_model=FacilityResponse)
async def update_facility(
    facility_id: uuid.UUID,
    facility_update: FacilityUpdate,
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Updates specific fields of an owner's facility.
    """
    stmt = select(Facility).where(Facility.id == facility_id)
    result = await db.execute(stmt)
    facility = result.scalar_one_or_none()

    if not facility:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Facility not found")
    
    if facility.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this facility")

    update_data = facility_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(facility, key, value)
        
    await db.commit()
    await db.refresh(facility)
    return facility

@router.post("/{facility_id}/telemetry", response_model=TelemetryResponse, status_code=status.HTTP_201_CREATED)
async def add_telemetry(
    facility_id: uuid.UUID,
    telemetry_in: TelemetryCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Owner submits new telemetry reading for their facility.
    """
    stmt = select(Facility).where(Facility.id == facility_id)
    result = await db.execute(stmt)
    facility = result.scalar_one_or_none()

    if not facility or facility.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Facility not found or not authorized")

    telemetry = FacilityTelemetry(facility_id=facility_id, **telemetry_in.model_dump())
    db.add(telemetry)
    await db.commit()
    await db.refresh(telemetry)

    # Schedule background risk evaluation
    from app.services.monitoring_service import check_facility_spoilage_risk
    background_tasks.add_task(check_facility_spoilage_risk, facility_id)

    return telemetry

# ==========================================
# FARMER ENDPOINTS
# ==========================================

@router.get("/search", response_model=List[FacilityResponse])
async def search_facilities(
    crop_type: Optional[str] = Query(None, description="Filter by crop type included in accepted_grains"),
    storage_type: Optional[StorageTypeEnum] = Query(None, description="Filter by storage type enum"),
    min_capacity_kg: Optional[float] = Query(0.0, description="Minimum available capacity in kg"),
    current_user: User = Depends(require_farmer),
    db: AsyncSession = Depends(get_db)
):
    """
    Searches for available facilities based on crop, storage type, and needed capacity.
    """
    stmt = select(Facility).where(Facility.available_capacity_kg >= min_capacity_kg)
    
    if storage_type:
        stmt = stmt.where(Facility.storage_type == storage_type)
        
    if crop_type:
        # PostgreSQL JSONB array containment: checks if crop_type is in accepted_grains
        stmt = stmt.where(Facility.accepted_grains.contains([crop_type]))
        
    result = await db.execute(stmt)
    return result.scalars().all()
