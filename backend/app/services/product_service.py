from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.models.product import Product
from app.models.product_alias import ProductAlias
from app.models.product_variant import ProductVariant


class ProductService:
    @staticmethod
    def get_all_active(db: Session) -> list[Product]:
        stmt = (
            select(Product)
            .options(
                selectinload(Product.images),
                selectinload(Product.aliases),
                selectinload(Product.variants),
            )
            .where(Product.is_active.is_(True))
            .order_by(Product.created_at.desc(), Product.id.desc())
        )
        return list(db.scalars(stmt).all())

    @staticmethod
    def get_by_variant_slug(db: Session, slug: str) -> Product | None:
        stmt = (
            select(Product)
            .join(ProductVariant, ProductVariant.product_id == Product.id)
            .options(
                selectinload(Product.images),
                selectinload(Product.aliases),
                selectinload(Product.variants),
            )
            .where(
                Product.is_active.is_(True),
                ProductVariant.slug == slug,
                ProductVariant.is_active.is_(True),
            )
        )
        return db.scalar(stmt)

    @staticmethod
    def get_new_products(db: Session) -> list[Product]:
        stmt = (
            select(Product)
            .options(
                selectinload(Product.images),
                selectinload(Product.aliases),
                selectinload(Product.variants),
            )
            .where(Product.is_new.is_(True), Product.is_active.is_(True))
            .order_by(Product.created_at.desc(), Product.id.desc())
        )
        return list(db.scalars(stmt).all())

    @staticmethod
    def get_preorder_products(db: Session) -> list[Product]:
        stmt = (
            select(Product)
            .join(ProductVariant, ProductVariant.product_id == Product.id)
            .options(
                selectinload(Product.images),
                selectinload(Product.aliases),
                selectinload(Product.variants),
            )
            .where(
                Product.is_active.is_(True),
                ProductVariant.is_active.is_(True),
                ProductVariant.availability_status == "preorder",
            )
            .order_by(Product.created_at.desc(), Product.id.desc())
            .distinct()
        )
        return list(db.scalars(stmt).all())

    @staticmethod
    def search_products(db: Session, query: str) -> list[Product]:
        q = query.strip()
        if not q:
            return []

        anywhere_query = f"%{q}%"
        prefix_query = f"{q}%"

        # Для коротких запитів робимо строгіший пошук
        if len(q) <= 2:
            stmt = (
                select(Product)
                .distinct()
                .outerjoin(ProductAlias, ProductAlias.product_id == Product.id)
                .options(
                    selectinload(Product.images),
                    selectinload(Product.aliases),
                    selectinload(Product.variants),
                )
                .where(
                    Product.is_active.is_(True),
                    or_(
                        Product.name.ilike(prefix_query),
                        Product.series.ilike(prefix_query),
                        Product.product_number.ilike(prefix_query),
                        ProductAlias.alias.ilike(prefix_query),
                    ),
                )
                .order_by(Product.created_at.desc(), Product.id.desc())
            )
            return list(db.scalars(stmt).all())

        # Для довших запитів можна дозволити ширший пошук
        stmt = (
            select(Product)
            .distinct()
            .outerjoin(ProductAlias, ProductAlias.product_id == Product.id)
            .options(
                selectinload(Product.images),
                selectinload(Product.aliases),
                selectinload(Product.variants),
            )
            .where(
                Product.is_active.is_(True),
                or_(
                    Product.name.ilike(anywhere_query),
                    Product.series.ilike(anywhere_query),
                    Product.product_number.ilike(anywhere_query),
                    ProductAlias.alias.ilike(anywhere_query),
                ),
            )
            .order_by(Product.created_at.desc(), Product.id.desc())
        )

        return list(db.scalars(stmt).all())