from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.api.dependencies_auth import get_current_admin
from app.models.user import User
from app.schemas.order import OrderRead
from app.services.order_service import OrderService
from app.schemas.order import OrderRead, OrderStatusUpdate
from app.schemas.admin_product import AdminProductCreate
from app.schemas.product import ProductRead
from app.services.admin_product_service import AdminProductService

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