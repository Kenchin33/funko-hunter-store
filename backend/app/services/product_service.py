from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.models.product import Product
from app.models.product_alias import ProductAlias


class ProductService:
    @staticmethod
    def get_all_active(db: Session) -> list[Product]:
        stmt = (
            select(Product)
            .options(
                selectinload(Product.images),
                selectinload(Product.aliases),
            )
            .where(Product.is_active.is_(True))
            .order_by(Product.created_at.desc(), Product.id.desc())
        )
        return list(db.scalars(stmt).all())

    @staticmethod
    def get_by_slug(db: Session, slug: str) -> Product | None:
        stmt = (
            select(Product)
            .options(
                selectinload(Product.images),
                selectinload(Product.aliases),
            )
            .where(Product.slug == slug, Product.is_active.is_(True))
        )
        return db.scalar(stmt)

    @staticmethod
    def get_new_products(db: Session) -> list[Product]:
        stmt = (
            select(Product)
            .options(
                selectinload(Product.images),
                selectinload(Product.aliases),
            )
            .where(Product.is_new.is_(True), Product.is_active.is_(True))
            .order_by(Product.created_at.desc(), Product.id.desc())
        )
        return list(db.scalars(stmt).all())

    @staticmethod
    def get_preorder_products(db: Session) -> list[Product]:
        stmt = (
            select(Product)
            .options(
                selectinload(Product.images),
                selectinload(Product.aliases),
            )
            .where(
                Product.availability_status == "preorder",
                Product.is_active.is_(True),
            )
            .order_by(Product.created_at.desc(), Product.id.desc())
        )
        return list(db.scalars(stmt).all())

    @staticmethod
    def search_products(db: Session, query: str) -> list[Product]:
        q = query.strip()
        if not q:
            return []

        ilike_query = f"%{q}%"

        stmt = (
            select(Product)
            .distinct()
            .outerjoin(ProductAlias, ProductAlias.product_id == Product.id)
            .options(
                selectinload(Product.images),
                selectinload(Product.aliases),
            )
            .where(
                Product.is_active.is_(True),
                or_(
                    Product.name.ilike(ilike_query),
                    Product.series.ilike(ilike_query),
                    Product.product_number.ilike(ilike_query),
                    Product.category.ilike(ilike_query),
                    Product.subcategory.ilike(ilike_query),
                    ProductAlias.alias.ilike(ilike_query),
                ),
            )
            .order_by(Product.created_at.desc(), Product.id.desc())
        )

        return list(db.scalars(stmt).all())