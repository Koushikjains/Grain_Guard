import random
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete

from app.core.database import get_db
from app.core.security import create_access_token
from app.services.id_generator import generate_unique_id
from app.models.otp import OtpCache
from app.models.user import User
from app.models.enums import MembershipPlanEnum, RoleEnum
from app.schemas.auth import SendOTPRequest, VerifyOTPRequest, VerifyOTPResponse, RegisterRequest, TokenResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/send-otp", status_code=status.HTTP_200_OK)
async def send_otp(request: SendOTPRequest, db: AsyncSession = Depends(get_db)):
    """
    Mock OTP generation endpoint.
    """
    # Delete any existing OTPs for this phone number
    stmt = delete(OtpCache).where(OtpCache.phone == request.phone)
    await db.execute(stmt)
    
    # Generate mock 6-digit OTP
    otp_code = f"{random.randint(100000, 999999)}"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)
    
    otp_entry = OtpCache(phone=request.phone, otp_code=otp_code, expires_at=expires_at)
    db.add(otp_entry)
    await db.commit()
    
    # Log to console for development testing
    print(f"=====================================")
    print(f"MOCK OTP for {request.phone}: {otp_code}")
    print(f"=====================================")
    
    return {"message": "OTP sent successfully (check console logs)"}

@router.post("/verify-otp", response_model=VerifyOTPResponse)
async def verify_otp(request: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    """
    Verifies the OTP code.
    If valid, checks if the user is registered. 
    If registered, returns a JWT. If not, tells the client to route to Registration.
    """
    stmt = select(OtpCache).where(OtpCache.phone == request.phone)
    result = await db.execute(stmt)
    otp_entry = result.scalar_one_or_none()
    
    if not otp_entry:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP not found or expired.")
        
    if otp_entry.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP expired.")
        
    if otp_entry.otp_code != request.otp:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP code.")
        
    # Delete OTP after successful verification
    await db.execute(delete(OtpCache).where(OtpCache.id == otp_entry.id))
    await db.commit()
    
    # Check if user exists
    user_stmt = select(User).where(User.phone == request.phone)
    user_result = await db.execute(user_stmt)
    user = user_result.scalar_one_or_none()
    
    if user:
        # If the user logged in with a specific role, update their role for testing purposes
        if request.role and user.role != request.role:
            user.role = request.role
            await db.commit()
            await db.refresh(user)

        # Generate JWT
        token_data = {
            "id": str(user.id),
            "phone": user.phone,
            "role": user.role.value,
            "unique_id": user.unique_id
        }
        token = create_access_token(data=token_data)
        return VerifyOTPResponse(
            is_registered=True, 
            message="OTP verified successfully. User logged in.", 
            access_token=token, 
            token_type="bearer"
        )
        
    return VerifyOTPResponse(
        is_registered=False, 
        message="OTP verified successfully. User must register."
    )

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """
    Registers a new user after OTP verification and returns a JWT.
    """
    # Verify user does not already exist
    stmt = select(User).where(User.phone == request.phone)
    result = await db.execute(stmt)
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User with this phone number already exists.")
        
    unique_id = generate_unique_id(request.role)
    
    user = User(
        unique_id=unique_id,
        role=request.role,
        membership_plan=MembershipPlanEnum.basic, # Default to basic
        name=request.name,
        phone=request.phone,
        kisan_card_or_aadhaar=request.kisan_card_or_aadhaar
    )
    
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    # Generate JWT
    token_data = {
        "id": str(user.id),
        "phone": user.phone,
        "role": user.role.value,
        "unique_id": user.unique_id
    }
    token = create_access_token(data=token_data)
    
    return TokenResponse(access_token=token, token_type="bearer")
