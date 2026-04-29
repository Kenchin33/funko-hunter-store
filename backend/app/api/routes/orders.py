from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.api.dependencies_auth import get_current_user
from app.models.user import User
from app.schemas.order import OrderCreate, OrderRead, OrderTrackRequest
from app.services.order_service import OrderService
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return OrderService.create_order(db, payload, current_user)


@router.get("/me", response_model=list[OrderRead])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return OrderService.get_user_orders(db, current_user.id)

@router.get("/me/{order_number}", response_model=OrderRead)
def get_my_order_by_number(
    order_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = OrderService.get_user_order_by_number(db, current_user.id, order_number)

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Замовлення не знайдено",
        )

    return order

@router.post("/track", response_model=OrderRead)
def track_order(
    payload: OrderTrackRequest,
    db: Session = Depends(get_db),
):
    order = OrderService.get_order_for_assistant(
        db=db,
        order_number=payload.order_number,
        email=str(payload.email),
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Замовлення не знайдено",
        )

    return order