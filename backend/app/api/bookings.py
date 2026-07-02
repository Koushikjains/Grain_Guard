import uuid
from typing import List
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.security import require_farmer, require_owner
from app.models.user import User
from app.models.facility import Facility
from app.models.booking import Booking
from app.models.contract import Contract
from app.models.enums import BookingStatusEnum, EscrowStatusEnum
from app.schemas.booking import BookingCreate, BookingResponse, BookingStatusUpdate

router = APIRouter(prefix="/api/bookings", tags=["bookings"])

# ==========================================
# FARMER ENDPOINTS
# ==========================================

@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_in: BookingCreate,
    current_user: User = Depends(require_farmer),
    db: AsyncSession = Depends(get_db)
):
    """
    Creates a new booking for a facility.
    Validates capacity but does NOT deduct it yet (deducted upon escrow payment).
    """
    stmt = select(Facility).where(Facility.id == booking_in.facility_id)
    result = await db.execute(stmt)
    facility = result.scalar_one_or_none()
    
    if not facility:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Facility not found")
        
    if facility.available_capacity_kg < booking_in.quantity:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient available capacity")

    # Ensure crops requested are actually supported
    unsupported = [crop for crop in booking_in.crop_types if crop not in facility.accepted_grains]
    if unsupported:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Crops not supported: {unsupported}")

    # Create Booking
    # 24-hour response deadline
    deadline = datetime.now(timezone.utc) + timedelta(hours=24)
    booking = Booking(
        farmer_id=current_user.id,
        status=BookingStatusEnum.pending,
        response_deadline=deadline,
        **booking_in.model_dump()
    )
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    return booking

@router.get("/me", response_model=List[BookingResponse])
async def get_my_bookings(
    current_user: User = Depends(require_farmer),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns all bookings made by the farmer.
    """
    stmt = select(Booking).where(Booking.farmer_id == current_user.id)
    result = await db.execute(stmt)
    return result.scalars().all()


# ==========================================
# OWNER ENDPOINTS
# ==========================================

@router.get("/owner", response_model=List[BookingResponse])
async def get_owner_bookings(
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns all bookings made at facilities owned by the current owner.
    """
    stmt = (
        select(Booking)
        .join(Facility, Booking.facility_id == Facility.id)
        .where(Facility.owner_id == current_user.id)
    )
    result = await db.execute(stmt)
    return result.scalars().all()

@router.put("/{booking_id}/status", response_model=BookingResponse)
async def update_booking_status(
    booking_id: uuid.UUID,
    status_update: BookingStatusUpdate,
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Allows the owner to accept or decline a pending booking.
    If accepted, an Escrow Contract is generated in 'pending_payment' state.
    """
    if status_update.status not in [BookingStatusEnum.accepted, BookingStatusEnum.declined]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Can only update to accepted or declined")

    stmt = select(Booking).where(Booking.id == booking_id)
    result = await db.execute(stmt)
    booking = result.scalar_one_or_none()

    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    # Verify ownership
    stmt_fac = select(Facility).where(Facility.id == booking.facility_id)
    fac_res = await db.execute(stmt_fac)
    facility = fac_res.scalar_one_or_none()
    
    if not facility or facility.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to manage this booking")

    if booking.status != BookingStatusEnum.pending:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Can only update pending bookings")

    booking.status = status_update.status
    
    if status_update.status == BookingStatusEnum.accepted:
        # Generate the Contract
        contract = Contract(
            booking_id=booking.id,
            escrow_status=EscrowStatusEnum.pending_payment,
            owner_approval=True # Owner just accepted it
        )
        db.add(contract)

    await db.commit()
    await db.refresh(booking)
    return booking
