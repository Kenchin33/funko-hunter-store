from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.product import Product
from app.models.product_alias import ProductAlias
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
    def get_product_by_id(db: Session, product_id: int) -> Product | None:
        stmt = (
            select(Product)
            .options(
                selectinload(Product.images),
                selectinload(Product.variants),
                selectinload(Product.aliases),
            )
            .where(Product.id == product_id)
        )
        return db.scalar(stmt)

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
            if image.image_url.strip():
                db.add(
                    ProductImage(
                        product_id=product.id,
                        image_url=image.image_url.strip(),
                        sort_order=image.sort_order,
                    )
                )

        for alias in payload.aliases:
            if alias.alias.strip():
                db.add(
                    ProductAlias(
                        product_id=product.id,
                        alias=alias.alias.strip(),
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
        db.refresh(product)

        return AdminProductService.get_product_by_id(db, product.id)

    @staticmethod
    def update_product(db: Session, product_id: int, payload) -> Product | None:
        product = db.scalar(
            select(Product)
            .options(
                selectinload(Product.images),
                selectinload(Product.aliases),
                selectinload(Product.variants),
            )
            .where(Product.id == product_id)
        )

        if not product:
            return None

        existing = db.scalar(
            select(Product).where(Product.slug == payload.slug, Product.id != product_id)
        )
        if existing:
            raise ValueError("Інший товар уже використовує цей slug")

        product.name = payload.name.strip()
        product.slug = payload.slug.strip()
        product.series = payload.series.strip()
        product.product_number = payload.product_number.strip()
        product.category = payload.category.strip()
        product.subcategory = payload.subcategory.strip() if payload.subcategory else None
        product.description = payload.description.strip() if payload.description else None
        product.rarity = payload.rarity.strip()
        product.is_new = payload.is_new
        product.is_active = payload.is_active

        for image in list(product.images):
            db.delete(image)

        for alias in list(product.aliases):
            db.delete(alias)

        for variant in list(product.variants):
            db.delete(variant)

        db.flush()

        for image in payload.images:
            if image.image_url.strip():
                db.add(
                    ProductImage(
                        product_id=product.id,
                        image_url=image.image_url.strip(),
                        sort_order=image.sort_order,
                    )
                )

        for alias in payload.aliases:
            if alias.alias.strip():
                db.add(
                    ProductAlias(
                        product_id=product.id,
                        alias=alias.alias.strip(),
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
        db.refresh(product)

        return AdminProductService.get_product_by_id(db, product.id)

    @staticmethod
    def delete_product(db: Session, product_id: int) -> bool:
        product = db.scalar(select(Product).where(Product.id == product_id))
        if not product:
            return False

        db.delete(product)
        db.commit()
        return True