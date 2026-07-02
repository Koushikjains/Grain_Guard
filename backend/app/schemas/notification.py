from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.enums import NotificationTypeEnum

class NotificationResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    message: str
    type: NotificationTypeEnum
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
