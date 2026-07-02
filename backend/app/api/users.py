from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Returns the current authenticated user's profile.
    """
    return current_user

from pydantic import BaseModel
from app.models.enums import MembershipPlanEnum
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

class MembershipUpgradeRequest(BaseModel):
    membership: MembershipPlanEnum

@router.put("/membership", response_model=UserResponse)
async def upgrade_membership(
    request: MembershipUpgradeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Upgrades the current user's membership plan.
    """
    current_user.membership_plan = request.membership
    await db.commit()
    await db.refresh(current_user)
    return current_user
