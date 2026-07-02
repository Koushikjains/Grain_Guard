import uuid
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Float, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import JSONB
from app.core.database import Base
from app.models.enums import StorageTypeEnum
from sqlalchemy import Enum

class Facility(Base):
    __tablename__ = "facilities"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String)
    address: Mapped[str] = mapped_column(String)
    storage_type: Mapped[StorageTypeEnum] = mapped_column(Enum(StorageTypeEnum))
    accepted_grains: Mapped[list[str]] = mapped_column(JSONB, default=list)
    best_grain: Mapped[str | None] = mapped_column(String, nullable=True)
    security_details: Mapped[str | None] = mapped_column(String, nullable=True)
    google_maps_link: Mapped[str | None] = mapped_column(String, nullable=True)
    promo_links: Mapped[str | None] = mapped_column(String, nullable=True)
    pricing_structure: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    
    capacity_kg: Mapped[float] = mapped_column(Float, default=0.0)
    capacity_quintal: Mapped[float] = mapped_column(Float, default=0.0)
    capacity_ton: Mapped[float] = mapped_column(Float, default=0.0)
    available_capacity_kg: Mapped[float] = mapped_column(Float, default=0.0)
