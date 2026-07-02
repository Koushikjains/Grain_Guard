from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.facility import Facility
from app.models.booking import Booking
from app.models.enums import BookingStatusEnum
from app.schemas.insights import MarketTrendResponse

router = APIRouter(prefix="/api/insights", tags=["insights"])

@router.get("/market-trends", response_model=MarketTrendResponse)
async def get_market_trends(
    current_user: User = Depends(get_current_user), # Requires any authenticated user
    db: AsyncSession = Depends(get_db)
):
    """
    Returns market trends for crops, calculating average pricing
    and determining which crops are in high demand based on active bookings.
    """
    # 1. Calculate average prices per crop type from Facilities
    # Since accepted_grains is a JSONB array, doing this entirely in SQL is complex depending on DB version.
    # For MVP, we will pull the pricing structures and calculate it in Python since data is small.
    stmt_fac = select(Facility.accepted_grains, Facility.pricing_structure)
    fac_res = await db.execute(stmt_fac)
    facilities = fac_res.all()

    crop_prices: Dict[str, List[float]] = {}
    
    for fac in facilities:
        grains = fac.accepted_grains or []
        pricing = fac.pricing_structure or {}
        
        for grain in grains:
            # Assume pricing structure might have {"base_price_per_quintal": 1200}
            # Or perhaps specific grain prices. For MVP, we check a standard key.
            base_price = pricing.get("base_price_per_quintal")
            if base_price is not None:
                if grain not in crop_prices:
                    crop_prices[grain] = []
                try:
                    crop_prices[grain].append(float(base_price))
                except ValueError:
                    pass

    labels = []
    average_prices = []
    
    for crop, prices in crop_prices.items():
        if prices:
            labels.append(crop)
            average_prices.append(sum(prices) / len(prices))

    # 2. Determine "High Demand" crops
    # Count pending and checked_in bookings per crop
    stmt_bookings = select(Booking.crop_types).where(
        Booking.status.in_([BookingStatusEnum.pending, BookingStatusEnum.checked_in])
    )
    book_res = await db.execute(stmt_bookings)
    bookings = book_res.scalars().all()
    
    crop_demand_count: Dict[str, int] = {}
    for crop_list in bookings:
        for crop in crop_list:
            crop_demand_count[crop] = crop_demand_count.get(crop, 0) + 1
            
    # Crops with more than 0 active bookings, sorted by count
    high_demand_crops = [
        crop for crop, count in sorted(crop_demand_count.items(), key=lambda item: item[1], reverse=True)
    ]

    # 3. Generate Realistic Timeseries Data for Top Crops
    # We will generate a 6-month historical curve based on the current average price.
    from datetime import datetime, timedelta
    import random
    
    crop_trends = []
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    current_month_idx = datetime.now().month - 1
    
    for i, crop in enumerate(labels):
        base_price = average_prices[i]
        history = []
        # Generate last 6 months
        for j in range(5, -1, -1):
            m_idx = (current_month_idx - j) % 12
            month_name = months[m_idx]
            
            # Add some realistic noise and seasonal variation
            # Sine wave based on month to simulate seasonality + random noise
            import math
            seasonality = math.sin((m_idx / 12) * math.pi * 2) * 0.15 * base_price
            noise = random.uniform(-0.05, 0.05) * base_price
            
            historical_price = round(base_price + seasonality + noise, 2)
            # Ensure price doesn't go below a reasonable threshold
            historical_price = max(historical_price, base_price * 0.5)
            
            history.append({"month": month_name, "price": historical_price})
            
        crop_trends.append({
            "crop": crop,
            "current_price": round(base_price, 2),
            "history": history
        })

    # 4. Generate Regional Demand
    # Mocking some regional data based on high demand crops
    regions = ["Mandya", "Mysuru", "Hassan", "Tumakuru", "Belagavi"]
    regional_demand = []
    for idx, region in enumerate(regions):
        top_c = high_demand_crops[idx % len(high_demand_crops)] if high_demand_crops else labels[idx % len(labels)] if labels else "Paddy"
        regional_demand.append({
            "area": region,
            "farmers_seeking": random.randint(5, 50),
            "top_crop": top_c
        })
    
    return MarketTrendResponse(
        labels=labels,
        average_prices=average_prices,
        high_demand_crops=high_demand_crops,
        crop_trends=crop_trends,
        regional_demand=regional_demand
    )
