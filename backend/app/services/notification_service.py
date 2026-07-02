from sqlalchemy.ext.asyncio import AsyncSession
from app.models.notification import Notification
from app.models.enums import NotificationTypeEnum
import uuid

async def create_notification(
    db: AsyncSession,
    user_id: uuid.UUID,
    title: str,
    message: str,
    type: NotificationTypeEnum
) -> Notification:
    """
    Helper function to create a new notification.
    """
    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        type=type
    )
    db.add(notification)
    await db.commit()
    await db.refresh(notification)
    return notification
