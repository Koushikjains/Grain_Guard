import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.core.security import require_farmer
from app.models.user import User
from app.models.facility import Facility
from app.models.booking import Booking
from app.models.contract import Contract
from app.models.enums import BookingStatusEnum, EscrowStatusEnum

router = APIRouter(prefix="/api/payments", tags=["payments"])

@router.post("/{booking_id}/escrow", status_code=status.HTTP_200_OK)
async def fund_escrow(
    booking_id: uuid.UUID,
    current_user: User = Depends(require_farmer),
    db: AsyncSession = Depends(get_db)
):
    """
    Simulates funding the escrow account.
    Validates capacity, deducts it, and creates/updates contract.
    """
    # 1. Fetch booking
    stmt = select(Booking).where(Booking.id == booking_id)
    res = await db.execute(stmt)
    booking = res.scalar_one_or_none()
    
    if not booking or booking.farmer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
        
    if booking.status not in [BookingStatusEnum.pending, BookingStatusEnum.accepted]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Booking must be pending or accepted to fund escrow")
        
    # 2. Fetch or Create Contract
    stmt_con = select(Contract).where(Contract.booking_id == booking_id)
    res_con = await db.execute(stmt_con)
    contract = res_con.scalar_one_or_none()
    
    if not contract:
        contract = Contract(
            booking_id=booking.id,
            escrow_status=EscrowStatusEnum.pending_payment,
            owner_approval=booking.status == BookingStatusEnum.accepted
        )
        db.add(contract)
        await db.flush()
        
    if contract.escrow_status not in [EscrowStatusEnum.pending_payment, None]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Escrow is not pending payment")
        
    # 3. Fetch Facility and deduct capacity
    stmt_fac = select(Facility).where(Facility.id == booking.facility_id).with_for_update()
    res_fac = await db.execute(stmt_fac)
    facility = res_fac.scalar_one_or_none()
    
    if facility.available_capacity_kg < booking.quantity:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient capacity available now")
        
    facility.available_capacity_kg -= booking.quantity
    
    # 4. Update Statuses
    contract.escrow_status = EscrowStatusEnum.held
    contract.farmer_approval = True
    
    # If it was pending, we leave it pending (owner must accept). If accepted, it becomes checked_in.
    # Actually, if the farmer pays immediately, let's just mark it accepted by farmer, but wait for owner.
    # But UI might expect checked_in. Let's make it checked_in if we auto-accept.
    # For prototype, we'll mark it pending and let owner accept, or checked_in if we want instant.
    # Since the UI immediately goes to "View My Storage", let's auto-accept it for the prototype flow
    booking.status = BookingStatusEnum.checked_in
    contract.owner_approval = True
    
    await db.commit()
    
    return {"message": "Escrow funded successfully", "booking_status": booking.status, "escrow_status": contract.escrow_status}


@router.post("/{booking_id}/release", status_code=status.HTTP_200_OK)
async def release_escrow(
    booking_id: uuid.UUID,
    current_user: User = Depends(require_farmer),
    db: AsyncSession = Depends(get_db)
):
    """
    Simulates releasing the escrow to the owner once storage is complete.
    Restores the facility's capacity.
    """
    # 1. Fetch booking & contract
    stmt = select(Booking).where(Booking.id == booking_id)
    res = await db.execute(stmt)
    booking = res.scalar_one_or_none()
    
    if not booking or booking.farmer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
        
    if booking.status != BookingStatusEnum.checked_in:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Booking must be checked_in to release escrow")
        
    stmt_con = select(Contract).where(Contract.booking_id == booking_id)
    res_con = await db.execute(stmt_con)
    contract = res_con.scalar_one_or_none()
    
    if not contract or contract.escrow_status != EscrowStatusEnum.held:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Escrow is not currently held")
        
    # 2. Restore Capacity
    stmt_fac = select(Facility).where(Facility.id == booking.facility_id).with_for_update()
    res_fac = await db.execute(stmt_fac)
    facility = res_fac.scalar_one_or_none()
    
    facility.available_capacity_kg += booking.quantity
    
    # 3. Update Statuses
    contract.escrow_status = EscrowStatusEnum.released
    booking.status = BookingStatusEnum.checked_out
    
    await db.commit()
    
    return {"message": "Escrow released successfully", "booking_status": booking.status, "escrow_status": contract.escrow_status}
