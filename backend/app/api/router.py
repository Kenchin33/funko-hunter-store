from fastapi import APIRouter

from app.api.routes.auth import router as auth_router
from app.api.routes.orders import router as orders_router
from app.api.routes.products import router as products_router
from app.api.routes.admin import router as admin_router

api_router = APIRouter()
api_router.include_router(products_router, tags=["Products"])
api_router.include_router(orders_router)
api_router.include_router(auth_router)
api_router.include_router(admin_router)