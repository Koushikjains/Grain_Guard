import uuid
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Float, ForeignKey, DateTime, Enum
from sqlalchemy.dialects.postgresql import JSONB
from app.core.database import Base
from app.models.enums import BookingStatusEnum

class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    farmer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    facility_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("facilities.id"))
    crop_types: Mapped[list[str]] = mapped_column(JSONB, default=list)
    quantity: Mapped[float] = mapped_column(Float)
    duration_months: Mapped[int] = mapped_column()
    total_cost: Mapped[float] = mapped_column(Float)
    status: Mapped[BookingStatusEnum] = mapped_column(Enum(BookingStatusEnum), default=BookingStatusEnum.pending)
    response_deadline: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
