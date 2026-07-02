import uuid
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import Enum
from app.core.database import Base
from app.models.enums import EscrowStatusEnum

class Contract(Base):
    __tablename__ = "contracts"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    booking_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("bookings.id"))
    escrow_status: Mapped[EscrowStatusEnum] = mapped_column(Enum(EscrowStatusEnum), default=EscrowStatusEnum.held)
    farmer_approval: Mapped[bool] = mapped_column(Boolean, default=False)
    owner_approval: Mapped[bool] = mapped_column(Boolean, default=False)
    metadata_columns: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
