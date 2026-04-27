from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.api.dependencies_auth import get_current_admin
from app.models.user import User
from app.schemas.order import OrderRead
from app.services.order_service import OrderService
from app.schemas.order import OrderRead, OrderStatusUpdate
from app.schemas.admin_product import AdminProductCreate, AdminProductUpdate
from app.schemas.product import ProductRead
from app.services.admin_product_service import AdminProductService
from app.schemas.complaint import ComplaintRead, ComplaintStatusUpdate
from app.services.complaint_service import ComplaintService

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/orders", response_model=list[OrderRead])
def get_admin_orders(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    return OrderService.get_all_orders(db)


@router.get("/orders/{order_number}", response_model=OrderRead)
def get_admin_order_by_number(
    order_number: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    order = OrderService.get_order_by_number(db, order_number)

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Замовлення не знайдено",
        )

    return order

@router.patch("/orders/{order_number}/status", response_model=OrderRead)
def update_admin_order_status(
    order_number: str,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    try:
        order = OrderService.update_order_status(db, order_number, payload.status)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Замовлення не знайдено",
        )

    return order

@router.get("/products", response_model=list[ProductRead])
def get_admin_products(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    return AdminProductService.get_all_products(db)


@router.get("/products/{product_id}", response_model=ProductRead)
def get_admin_product_by_id(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    product = AdminProductService.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товар не знайдено",
        )
    return product


@router.post("/products", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
def create_admin_product(
    payload: AdminProductCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    try:
        return AdminProductService.create_product(db, payload)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.put("/products/{product_id}", response_model=ProductRead)
def update_admin_product(
    product_id: int,
    payload: AdminProductUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    try:
        product = AdminProductService.update_product(db, product_id, payload)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товар не знайдено",
        )

    return product


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_admin_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    deleted = AdminProductService.delete_product(db, product_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Товар не знайдено",
        )

@router.get("/complaints", response_model=list[ComplaintRead])
def get_admin_complaints(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    return ComplaintService.get_all_complaints(db)

@router.get("/complaints/{complaint_id}", response_model=ComplaintRead)
def get_admin_complaint_by_id(
    complaint_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    complaint = ComplaintService.get_complaint_by_id(db, complaint_id)

    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Скаргу не знайдено",
        )

    return complaint

@router.patch("/complaints/{complaint_id}/status", response_model=ComplaintRead)
def update_admin_complaint_status(
    complaint_id: int,
    payload: ComplaintStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    try:
        complaint = ComplaintService.update_complaint_status(db, complaint_id, payload.status)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Скаргу не знайдено",
        )

    return complaint