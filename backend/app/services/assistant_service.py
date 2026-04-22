from sqlalchemy import or_, select
from sqlalchemy.orm import Session, selectinload

from app.models.product import Product
from app.models.product_alias import ProductAlias
from app.models.product_variant import ProductVariant


class AssistantService:
    @staticmethod
    def search_products(
        db: Session,
        q: str,
        category: str | None = None,
        subcategory: str | None = None,
        rarity: str | None = None,
        availability_status: str | None = None,
        is_box_damaged: bool | None = None,
        limit: int = 10,
    ) -> list[Product]:
        stmt = (
            select(Product)
            .distinct()
            .options(
                selectinload(Product.images),
                selectinload(Product.variants),
                selectinload(Product.aliases),
            )
            .outerjoin(ProductAlias, ProductAlias.product_id == Product.id)
            .outerjoin(ProductVariant, ProductVariant.product_id == Product.id)
            .where(Product.is_active.is_(True))
        )

        if q.strip():
            pattern = f"%{q.strip()}%"
            stmt = stmt.where(
                or_(
                    Product.name.ilike(pattern),
                    Product.slug.ilike(pattern),
                    Product.series.ilike(pattern),
                    Product.category.ilike(pattern),
                    Product.subcategory.ilike(pattern),
                    Product.product_number.ilike(pattern),
                    ProductAlias.alias.ilike(pattern),
                    ProductVariant.slug.ilike(pattern),
                    ProductVariant.variant_name.ilike(pattern),
                )
            )

        if category:
            stmt = stmt.where(Product.category == category)

        if subcategory:
            stmt = stmt.where(Product.subcategory == subcategory)

        if rarity:
            stmt = stmt.where(Product.rarity == rarity)

        if availability_status:
            stmt = stmt.where(ProductVariant.availability_status == availability_status)

        if is_box_damaged is not None:
            stmt = stmt.where(ProductVariant.is_box_damaged.is_(is_box_damaged))

        stmt = stmt.order_by(Product.created_at.desc(), Product.id.desc()).limit(limit)

        return list(db.scalars(stmt).unique().all())

    @staticmethod
    def get_product_by_slug(db: Session, slug: str) -> Product | None:
        stmt = (
            select(Product)
            .options(
                selectinload(Product.images),
                selectinload(Product.variants),
                selectinload(Product.aliases),
            )
            .where(Product.slug == slug, Product.is_active.is_(True))
        )
        return db.scalar(stmt)