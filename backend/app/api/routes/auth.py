from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.api.dependencies_auth import get_current_user
from app.schemas.user import TokenResponse, UserCreate, UserLogin, UserRead
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    try:
        user = AuthService.register_user(db, payload)
        token, user = AuthService.login_user(db, str(payload.email), payload.password)

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user,
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    try:
        token, user = AuthService.login_user(db, str(payload.email), payload.password)
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user,
        }
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.get("/me", response_model=UserRead)
def me(current_user=Depends(get_current_user)):
    return current_user