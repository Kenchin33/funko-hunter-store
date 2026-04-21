from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.api.dependencies_auth import get_current_admin
from app.models.user import User
from app.schemas.order import OrderRead
from app.services.order_service import OrderService

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