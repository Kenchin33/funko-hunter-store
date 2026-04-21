from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.product_variant import ProductVariant


class AdminProductService:
    @staticmethod
    def get_all_products(db: Session) -> list[Product]:
        stmt = (
            select(Product)
            .options(
                selectinload(Product.images),
                selectinload(Product.variants),
                selectinload(Product.aliases),
            )
            .order_by(Product.created_at.desc(), Product.id.desc())
        )
        return list(db.scalars(stmt).all())

    @staticmethod
    def create_product(db: Session, payload) -> Product:
        existing = db.scalar(select(Product).where(Product.slug == payload.slug))
        if existing:
            raise ValueError("Товар з таким slug вже існує")

        product = Product(
            name=payload.name.strip(),
            slug=payload.slug.strip(),
            series=payload.series.strip(),
            product_number=payload.product_number.strip(),
            category=payload.category.strip(),
            subcategory=payload.subcategory.strip() if payload.subcategory else None,
            description=payload.description.strip() if payload.description else None,
            rarity=payload.rarity.strip(),
            is_new=payload.is_new,
            is_active=payload.is_active,
        )

        db.add(product)
        db.flush()

        for image in payload.images:
            db.add(
                ProductImage(
                    product_id=product.id,
                    image_url=image.image_url.strip(),
                    sort_order=image.sort_order,
                )
            )

        for variant in payload.variants:
            db.add(
                ProductVariant(
                    product_id=product.id,
                    slug=variant.slug.strip(),
                    variant_name=variant.variant_name.strip(),
                    price=variant.price,
                    compare_at_price=variant.compare_at_price,
                    availability_status=variant.availability_status,
                    delivery_eta=variant.delivery_eta.strip() if variant.delivery_eta else None,
                    stock_quantity=variant.stock_quantity,
                    is_box_damaged=variant.is_box_damaged,
                    is_active=variant.is_active,
                )
            )

        db.commit()

        stmt = (
            select(Product)
            .options(
                selectinload(Product.images),
                selectinload(Product.variants),
                selectinload(Product.aliases),
            )
            .where(Product.id == product.id)
        )

        return db.scalar(stmt)