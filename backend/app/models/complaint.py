from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    complaint_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)

    email: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    order_number: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)

    topic: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)

    status: Mapped[str] = mapped_column(String(50), nullable=False, default="new")
    source: Mapped[str] = mapped_column(String(50), nullable=False, default="assistant")

    is_resolved: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    photos = relationship(
        "ComplaintPhoto",
        back_populates="complaint",
        cascade="all, delete-orphan",
        order_by="ComplaintPhoto.id.asc()",
    )


class ComplaintPhoto(Base):
    __tablename__ = "complaint_photos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    complaint_id: Mapped[int] = mapped_column(
        ForeignKey("complaints.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    image_url: Mapped[str] = mapped_column(Text, nullable=False)

    complaint = relationship("Complaint", back_populates="photos")