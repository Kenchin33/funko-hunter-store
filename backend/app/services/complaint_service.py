from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.complaint import Complaint, ComplaintPhoto


class ComplaintService:
    @staticmethod
    def create_complaint(db: Session, payload) -> Complaint:
        complaint_number = payload.complaint_number or f"CMP-{uuid4().hex[:8].upper()}"

        complaint = Complaint(
            complaint_number=complaint_number,
            email=payload.email.strip() if payload.email else None,
            order_number=payload.order_number.strip() if payload.order_number else None,
            topic=payload.topic.strip(),
            message=payload.message.strip(),
            status="new",
            source=payload.source,
            is_resolved=False,
        )

        db.add(complaint)
        db.flush()

        for photo in payload.photos:
            if photo.image_url.strip():
                db.add(
                    ComplaintPhoto(
                        complaint_id=complaint.id,
                        image_url=photo.image_url.strip(),
                    )
                )

        db.commit()
        db.refresh(complaint)

        return ComplaintService.get_complaint_by_id(db, complaint.id)

    @staticmethod
    def get_complaint_by_id(db: Session, complaint_id: int) -> Complaint | None:
        stmt = (
            select(Complaint)
            .options(selectinload(Complaint.photos))
            .where(Complaint.id == complaint_id)
        )
        return db.scalar(stmt)

    @staticmethod
    def get_all_complaints(db: Session) -> list[Complaint]:
        stmt = (
            select(Complaint)
            .options(selectinload(Complaint.photos))
            .order_by(Complaint.created_at.desc(), Complaint.id.desc())
        )
        return list(db.scalars(stmt).all())

    @staticmethod
    def update_complaint_status(db: Session, complaint_id: int, new_status: str) -> Complaint | None:
        complaint = db.scalar(
            select(Complaint)
            .options(selectinload(Complaint.photos))
            .where(Complaint.id == complaint_id)
        )

        if not complaint:
            return None

        allowed_statuses = {"new", "in_progress", "resolved", "rejected"}
        if new_status not in allowed_statuses:
            raise ValueError("Некоректний статус")

        complaint.status = new_status
        complaint.is_resolved = new_status == "resolved"

        db.add(complaint)
        db.commit()
        db.refresh(complaint)

        return ComplaintService.get_complaint_by_id(db, complaint.id)