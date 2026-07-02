from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.core.security import require_farmer
from app.models.user import User
from app.models.facility import Facility
from app.schemas.recommendation import MatchRequest, MatchResponse
from app.services.ai_service import generate_storage_recommendations

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])

@router.post("/match", response_model=MatchResponse)
async def match_facilities(
    request: MatchRequest,
    current_user: User = Depends(require_farmer),
    db: AsyncSession = Depends(get_db)
):
    """
    AI-driven endpoint that matches a farmer's crop request to the best available facilities.
    """
    # 1. Pre-filter database to find viable candidates (saves AI tokens and prevents hallucination)
    stmt = select(Facility).where(
        Facility.available_capacity_kg >= request.quantity_kg
    ).where(
        Facility.accepted_grains.contains([request.crop_type])
    )
    
    result = await db.execute(stmt)
    facilities = result.scalars().all()
    
    if not facilities:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="No facilities found matching your basic capacity and crop criteria."
        )
        
    # 2. Serialize database models to plain dictionaries for the LLM
    available_facilities = []
    for fac in facilities:
        available_facilities.append({
            "id": str(fac.id),
            "name": fac.name,
            "address": fac.address,
            "storage_type": fac.storage_type.value,
            "best_grain": fac.best_grain,
            "pricing_structure": fac.pricing_structure,
            "available_capacity_kg": fac.available_capacity_kg
        })
        
    # 3. Call the AI service to rank and evaluate
    recommendations = await generate_storage_recommendations(request, available_facilities)
    
    return MatchResponse(recommendations=recommendations)
