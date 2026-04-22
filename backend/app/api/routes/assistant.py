from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.api.dependencies_assistant import verify_assistant_api_key
from app.schemas.assistant import AssistantProductRead
from app.services.assistant_service import AssistantService
from app.schemas.complaint import ComplaintCreate, ComplaintRead
from app.services.complaint_service import ComplaintService

router = APIRouter(prefix="/assistant", tags=["Assistant API"])


@router.get("/products/search", response_model=list[AssistantProductRead])
def search_assistant_products(
    q: str = Query(default=""),
    category: str | None = Query(default=None),
    subcategory: str | None = Query(default=None),
    rarity: str | None = Query(default=None),
    availability_status: str | None = Query(default=None),
    is_box_damaged: bool | None = Query(default=None),
    limit: int = Query(default=10, ge=1, le=50),
    db: Session = Depends(get_db),
    _: None = Depends(verify_assistant_api_key),
):
    return AssistantService.search_products(
        db=db,
        q=q,
        category=category,
        subcategory=subcategory,
        rarity=rarity,
        availability_status=availability_status,
        is_box_damaged=is_box_damaged,
        limit=limit,
    )


@router.get("/products/by-slug/{slug}", response_model=AssistantProductRead)
def get_assistant_product_by_slug(
    slug: str,
    db: Session = Depends(get_db),
    _: None = Depends(verify_assistant_api_key),
):
    product = AssistantService.get_product_by_slug(db, slug)

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return product

@router.post("/complaints", response_model=ComplaintRead, status_code=status.HTTP_201_CREATED)
def create_assistant_complaint(
    payload: ComplaintCreate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_assistant_api_key),
):
    return ComplaintService.create_complaint(db, payload)