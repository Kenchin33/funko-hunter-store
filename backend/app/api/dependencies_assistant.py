from fastapi import Header, HTTPException, status

from app.core.config import settings


def verify_assistant_api_key(x_assistant_api_key: str | None = Header(default=None)) -> None:
    if x_assistant_api_key != settings.ASSISTANT_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid assistant api key",
        )