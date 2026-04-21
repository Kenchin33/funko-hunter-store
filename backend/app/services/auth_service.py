from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.user import UserCreate


class AuthService:
    @staticmethod
    def register_user(db: Session, payload: UserCreate) -> User:
        existing_user = db.scalar(
            select(User).where(User.email == str(payload.email).lower())
        )
        if existing_user:
            raise ValueError("Користувач з таким email вже існує")

        user = User(
            email=str(payload.email).lower(),
            password_hash=hash_password(payload.password),
            first_name=payload.first_name.strip(),
            last_name=payload.last_name.strip(),
            phone=payload.phone.strip() if payload.phone else None,
            is_admin=False,
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def login_user(db: Session, email: str, password: str) -> tuple[str, User]:
        user = db.scalar(
            select(User).where(User.email == email.lower())
        )

        if not user:
            raise ValueError("Невірний email або пароль")

        if not user.is_active:
            raise ValueError("Акаунт деактивований")

        if not verify_password(password, user.password_hash):
            raise ValueError("Невірний email або пароль")

        token = create_access_token(user.id)
        return token, user