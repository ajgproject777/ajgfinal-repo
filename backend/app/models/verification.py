import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDPrimaryKeyMixin, TimestampMixin

class RestaurantVerification(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "restaurant_verifications"

    restaurant_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("restaurants.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    document_type: Mapped[str] = mapped_column(String(50), nullable=False) # e.g. 'fssai_license', 'gstin_certificate', 'utility_bill'
    document_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    license_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    submitted_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False, index=True) # 'pending', 'approved', 'rejected'
    reviewed_by: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    reviewed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    admin_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    rejection_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    restaurant: Mapped["Restaurant"] = relationship("Restaurant")
    reviewer: Mapped[Optional["User"]] = relationship("User")

    def __repr__(self) -> str:
        return f"<RestaurantVerification id={self.id} restaurant_id={self.restaurant_id} status={self.status}>"
