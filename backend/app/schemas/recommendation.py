from pydantic import BaseModel, Field
from typing import Optional, List
import uuid

class MatchRequest(BaseModel):
    crop_type: str = Field(..., description="The type of crop to store")
    quantity_kg: float = Field(..., description="Quantity in kg")
    duration_months: int = Field(..., description="Storage duration in months")
    preferred_location: Optional[str] = Field(None, description="Preferred location or address")

class RecommendationResponse(BaseModel):
    facility_id: uuid.UUID = Field(..., description="The UUID of the recommended facility")
    match_score: int = Field(..., description="A score from 1-100 indicating match quality")
    reasoning: str = Field(..., description="A 1-2 sentence explanation of why this facility is ideal")

class MatchResponse(BaseModel):
    recommendations: List[RecommendationResponse]
