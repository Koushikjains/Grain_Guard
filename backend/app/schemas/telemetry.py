from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime

class TelemetryCreate(BaseModel):
    temperature: float = Field(..., description="Temperature in Celsius")
    humidity: float = Field(..., description="Humidity percentage")

class TelemetryResponse(TelemetryCreate):
    id: UUID
    facility_id: UUID
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)
