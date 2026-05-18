from sqlalchemy import func, not_, or_, select, case
from sqlalchemy.orm import Session, selectinload, with_loader_criteria

from app.models.product import Product
from app.models.product_alias import ProductAlias
from app.models.product_variant import ProductVariant
from app.models.order import Order
from app.models.order_item import OrderItem


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
    
    @staticmethod
    def get_by_category(
        db: Session,
        category: str,
        subcategory: str | None = None,
        exclude_subcategories: list[str] | None = None,
    ) -> list[Product]:
        normalized_category = category.strip().lower()
        normalized_subcategory = subcategory.strip().lower() if subcategory else None
        normalized_excluded = (
            [item.strip().lower() for item in exclude_subcategories]
            if exclude_subcategories
            else []
        )

        normalized_category_column = func.replace(func.lower(Product.category), " ", "-")
        normalized_subcategory_column = func.replace(func.lower(Product.subcategory), " ", "-")

        stmt = (
            select(Product)
            .options(
                selectinload(Product.images),
                selectinload(Product.aliases),
                selectinload(Product.variants),
            )
            .where(
                Product.is_active.is_(True),
                normalized_category_column == normalized_category,
            )
        )

        if normalized_subcategory:
            stmt = stmt.where(normalized_subcategory_column == normalized_subcategory)

        if normalized_excluded:
            stmt = stmt.where(
                or_(
                    Product.subcategory.is_(None),
                    not_(normalized_subcategory_column.in_(normalized_excluded)),
                )
            )

        stmt = stmt.order_by(Product.created_at.desc(), Product.id.desc())

        return list(db.scalars(stmt).all())

    @staticmethod
    def get_preorder_catalog(db: Session) -> list[Product]:
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
            .distinct()
            .order_by(Product.created_at.desc(), Product.id.desc())
        )

        return list(db.scalars(stmt).all())
    
    @staticmethod
    def get_in_stock_products(db: Session) -> list[Product]:
        stmt = (
            select(Product)
            .join(ProductVariant, ProductVariant.product_id == Product.id)
            .options(
                selectinload(Product.images),
                selectinload(Product.aliases),
                selectinload(Product.variants),
                with_loader_criteria(
                    ProductVariant,
                    lambda variant: (
                        variant.is_active.is_(True)
                        & (variant.availability_status == "in_stock")
                    ),
                    include_aliases=True,
                ),
            )
            .where(
                Product.is_active.is_(True),
                ProductVariant.is_active.is_(True),
                ProductVariant.availability_status == "in_stock",
            )
            .distinct()
            .order_by(Product.created_at.desc(), Product.id.desc())
        )

        return list(db.scalars(stmt).all())
    
    @staticmethod
    def get_popular_products(db: Session, limit: int = 5) -> list[dict]:
        sold_quantity = func.coalesce(func.sum(OrderItem.quantity), 0).label("sold_quantity")

        stmt = (
            select(Product, sold_quantity)
            .join(OrderItem, OrderItem.product_id == Product.id)
            .join(Order, Order.id == OrderItem.order_id)
            .options(
                selectinload(Product.images),
                selectinload(Product.aliases),
                selectinload(Product.variants),
            )
            .where(
                Product.is_active.is_(True),
                Order.status.in_(["shipped", "resolved"]),
            )
            .group_by(Product.id)
            .order_by(sold_quantity.desc(), Product.id.desc())
            .limit(limit)
        )

        rows = db.execute(stmt).all()

        return [
            {
                "id": product.id,
                "name": product.name,
                "slug": product.slug,
                "category": product.category,
                "subcategory": product.subcategory,
                "series": product.series,
                "product_number": product.product_number,
                "short_description": product.short_description,
                "rarity": product.rarity,
                "sold_quantity": int(sold_count or 0),
                "images": product.images,
                "aliases": product.aliases,
                "variants": product.variants,
            }
            for product, sold_count in rows
        ]