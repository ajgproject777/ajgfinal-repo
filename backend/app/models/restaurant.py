import uuid
from typing import Optional
from sqlalchemy import String, Boolean, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

class Restaurant(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "restaurants"

    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    # Strictly enforced unique Google Place ID in PostgreSQL (nullable for manual entries)
    google_place_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=True
    )
    is_manual_entry: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50),
        default="pending_verification",
        nullable=False,
        index=True
    )
    address: Mapped[str] = mapped_column(String(500), nullable=False)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    cuisine: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(30), nullable=True)
    contact_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    owner: Mapped["User"] = relationship("User")

    def __repr__(self) -> str:
        return f"<Restaurant id={self.id} name={self.name} status={self.status}>"
