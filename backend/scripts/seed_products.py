from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.database import SessionLocal
from app.models.product import Product
from app.models.product_alias import ProductAlias
from app.models.product_image import ProductImage
from app.models.product_variant import ProductVariant


PRODUCTS = [
    {
        "name": "Funko Pop! Silco 1604",
        "slug": "funko-pop-silco-1604",
        "category": "cartoons",
        "subcategory": "arcane",
        "series": "Arcane",
        "product_number": "1604",
        "short_description": "Фігурка Silco із серії Arcane.",
        "rarity": "regular",
        "is_new": False,
        "is_active": True,
        "images": [
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dw8cc8fcf1/images/funko/upload/75650_ArcaneLOL_Silco_POP_GLAM-1-WEB.png?sw=800&sh=800",
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dwdd171b45/images/funko/upload/75650_ArcaneLOL_Silco_POP_GLAM-WEB.png?sw=800&sh=800",
        ],
        "aliases": [
            "сілко",
            "silco",
        ],
        "variants": [
            {
                "slug": "funko-pop-silco-1604",
                "variant_name": "Стандартна коробка",
                "price": Decimal("950.00"),
                "compare_at_price": None,
                "availability_status": "in_stock",
                "delivery_eta": None,
                "stock_quantity": 0,
                "is_box_damaged": False,
                "is_active": False,
            },
            {
                "slug": "funko-pop-silco-1604-damaged-box",
                "variant_name": "Пошкоджена коробка",
                "price": Decimal("820.00"),
                "compare_at_price": Decimal("950.00"),
                "availability_status": "in_stock",
                "delivery_eta": None,
                "stock_quantity": 1,
                "is_box_damaged": True,
                "is_active": True,
            },
        ],
    },
]


def update_product_fields(product: Product, item: dict) -> None:
    product.name = item["name"]
    product.slug = item["slug"]
    product.category = item["category"]
    product.subcategory = item["subcategory"]
    product.series = item["series"]
    product.product_number = item["product_number"]
    product.short_description = item["short_description"]
    product.rarity = item["rarity"]
    product.is_new = item["is_new"]
    product.is_active = item["is_active"]


def sync_product_images(db, product: Product, image_urls: list[str]) -> None:
    for image in list(product.images):
        db.delete(image)
    db.flush()

    for index, image_url in enumerate(image_urls):
        db.add(
            ProductImage(
                product_id=product.id,
                image_url=image_url,
                sort_order=index,
            )
        )


def sync_product_aliases(db, product: Product, aliases: list[str]) -> None:
    for alias in list(product.aliases):
        db.delete(alias)
    db.flush()

    for alias_value in aliases:
        db.add(ProductAlias(product_id=product.id, alias=alias_value))


def sync_product_variants(db, product: Product, variants: list[dict]) -> None:
    for variant in list(product.variants):
        db.delete(variant)
    db.flush()

    for item in variants:
        db.add(
            ProductVariant(
                product_id=product.id,
                slug=item["slug"],
                variant_name=item["variant_name"],
                price=item["price"],
                compare_at_price=item["compare_at_price"],
                availability_status=item["availability_status"],
                delivery_eta=item["delivery_eta"],
                stock_quantity=item["stock_quantity"],
                is_box_damaged=item["is_box_damaged"],
                is_active=item["is_active"],
            )
        )


def seed():
    db = SessionLocal()

    try:
        for item in PRODUCTS:
            existing = db.scalar(
                select(Product)
                .options(
                    selectinload(Product.images),
                    selectinload(Product.aliases),
                    selectinload(Product.variants),
                )
                .where(Product.slug == item["slug"])
            )

            if existing:
                update_product_fields(existing, item)
                db.add(existing)
                db.flush()

                sync_product_images(db, existing, item["images"])
                sync_product_aliases(db, existing, item["aliases"])
                sync_product_variants(db, existing, item["variants"])

                print(f"Updated: {existing.slug}")
            else:
                product = Product(
                    name=item["name"],
                    slug=item["slug"],
                    category=item["category"],
                    subcategory=item["subcategory"],
                    series=item["series"],
                    product_number=item["product_number"],
                    short_description=item["short_description"],
                    rarity=item["rarity"],
                    is_new=item["is_new"],
                    is_active=item["is_active"],
                )
                db.add(product)
                db.flush()

                sync_product_images(db, product, item["images"])
                sync_product_aliases(db, product, item["aliases"])
                sync_product_variants(db, product, item["variants"])

                print(f"Created: {product.slug}")

        db.commit()
        print("Products seeded successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()