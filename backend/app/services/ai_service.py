import json
import os
from typing import List, Dict, Any
from pydantic_ai import Agent
from app.schemas.recommendation import MatchRequest, RecommendationResponse
from app.core.config import settings

def get_agent() -> Agent:
    # Set the environment variable that pydantic-ai expects
    if settings.GEMINI_API_KEY:
        os.environ["GOOGLE_API_KEY"] = settings.GEMINI_API_KEY
        
    return Agent(
        'gemini-2.5-flash',
        result_type=List[RecommendationResponse],
        system_prompt=(
            "You are an Expert Agricultural Logistics Agent. "
            "Your task is to match a farmer's storage request with a list of available facilities. "
            "Evaluate factors like: "
            "1. Is the facility's `storage_type` appropriate for the farmer's `crop_type`? "
            "2. Does the facility have the required capacity available? "
            "3. Does the facility specialize in this crop (`best_grain`)? "
            "Return a strictly typed JSON array of recommendations, scored from 1-100, with a 1-2 sentence reasoning."
        )
    )

async def generate_storage_recommendations(farmer_request: MatchRequest, available_facilities: List[Dict[str, Any]]) -> List[RecommendationResponse]:
    """
    Calls the LLM to generate recommendations. Includes a deterministic fallback.
    """
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your_gemini_api_key_here":
        # Skip LLM if key is not configured and use fallback immediately
        return _fallback_recommendation(farmer_request, available_facilities)
        
    user_prompt = (
        f"Farmer Request: {farmer_request.model_dump_json()}\n"
        f"Available Facilities: {json.dumps(available_facilities, default=str)}"
    )

    try:
        agent = get_agent()
        result = await agent.run(user_prompt)
        return result.data
    except Exception as e:
        print(f"LLM Match Failed: {e}. Using fallback logic.")
        return _fallback_recommendation(farmer_request, available_facilities)

def _fallback_recommendation(farmer_request: MatchRequest, available_facilities: List[Dict[str, Any]]) -> List[RecommendationResponse]:
    """
    A deterministic fallback heuristic if the LLM fails.
    """
    recommendations = []
    
    for fac in available_facilities:
        score = 50 # Base score
        
        # Exact best_grain match is highly valued
        if fac.get("best_grain") and fac["best_grain"].lower() == farmer_request.crop_type.lower():
            score += 30
            
        # Capacity bonus (more buffer room is better, up to a point)
        available = fac.get("available_capacity_kg", 0)
        if available >= farmer_request.quantity_kg * 2:
            score += 20
        elif available >= farmer_request.quantity_kg:
            score += 10
            
        reasoning = f"Fallback Match: Good capacity for {farmer_request.quantity_kg}kg."
        if score >= 80:
            reasoning = f"Fallback Match: Perfect capacity and specializes in {farmer_request.crop_type}."
            
        recommendations.append(
            RecommendationResponse(
                facility_id=fac["id"],
                match_score=min(score, 100),
                reasoning=reasoning
            )
        )
        
    # Sort by score descending
    recommendations.sort(key=lambda x: x.match_score, reverse=True)
    return recommendations
