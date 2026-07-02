import uuid
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Enum
from app.core.database import Base
from app.models.enums import RoleEnum, MembershipPlanEnum

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, index=True)
    phone: Mapped[str] = mapped_column(String, unique=True, index=True)
    email: Mapped[str | None] = mapped_column(String, unique=True, index=True, nullable=True)
    role: Mapped[RoleEnum] = mapped_column(Enum(RoleEnum))
    membership_plan: Mapped[MembershipPlanEnum] = mapped_column(Enum(MembershipPlanEnum), default=MembershipPlanEnum.basic)
    kisan_card_or_aadhaar: Mapped[str | None] = mapped_column(String, nullable=True)
    unique_id: Mapped[str | None] = mapped_column(String, unique=True, index=True, nullable=True) # FA-XXXX or OW-XXXX
