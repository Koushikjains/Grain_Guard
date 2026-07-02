from pydantic import BaseModel
from typing import List, Optional

class DataPoint(BaseModel):
    month: str
    price: float

class CropTrend(BaseModel):
    crop: str
    current_price: float
    history: List[DataPoint]

class RegionalDemand(BaseModel):
    area: str
    farmers_seeking: int
    top_crop: str

class MarketTrendResponse(BaseModel):
    labels: List[str]
    average_prices: List[float]
    high_demand_crops: List[str]
    crop_trends: List[CropTrend] = []
    regional_demand: List[RegionalDemand] = []
