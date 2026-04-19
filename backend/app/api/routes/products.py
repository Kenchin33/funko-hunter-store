from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db
from app.schemas.product import ProductRead
from app.services.product_service import ProductService

router = APIRouter(prefix="/products")


@router.get("", response_model=list[ProductRead])
def list_products(db: Session = Depends(get_db)):
    return ProductService.get_all_active(db)


@router.get("/new", response_model=list[ProductRead])
def list_new_products(db: Session = Depends(get_db)):
    return ProductService.get_new_products(db)


@router.get("/preorder", response_model=list[ProductRead])
def list_preorder_products(db: Session = Depends(get_db)):
    return ProductService.get_preorder_products(db)


@router.get("/search", response_model=list[ProductRead])
def search_products(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
):
    return ProductService.search_products(db, q)


@router.get("/{slug}", response_model=ProductRead)
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    product = ProductService.get_by_variant_slug(db, slug)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return product

@router.get("/catalog/preorder", response_model=list[ProductRead])
def preorder_catalog(db: Session = Depends(get_db)):
    return ProductService.get_preorder_catalog(db)


@router.get("/catalog/{category}/{subcategory}", response_model=list[ProductRead])
def category_subcategory_catalog(
    category: str,
    subcategory: str,
    exclude_subcategories: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    exclude_list = (
        [item.strip() for item in exclude_subcategories.split(",") if item.strip()]
        if exclude_subcategories
        else None
    )

    if subcategory == "other":
        return ProductService.get_by_category(
            db=db,
            category=category,
            exclude_subcategories=exclude_list,
        )

    return ProductService.get_by_category(
        db=db,
        category=category,
        subcategory=subcategory,
    )


@router.get("/catalog/{category}", response_model=list[ProductRead])
def category_catalog(
    category: str,
    exclude_subcategories: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    exclude_list = (
        [item.strip() for item in exclude_subcategories.split(",") if item.strip()]
        if exclude_subcategories
        else None
    )

    return ProductService.get_by_category(
        db=db,
        category=category,
        exclude_subcategories=exclude_list,
    )