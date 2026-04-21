from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.api.dependencies_auth import get_current_user
from app.models.user import User
from app.schemas.order import OrderCreate, OrderRead
from app.services.order_service import OrderService

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