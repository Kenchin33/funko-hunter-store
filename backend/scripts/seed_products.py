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
        "name": "Funko Pop! Heisenberg 162",
        "slug": "funko-pop-heisenberg-162",
        "category": "movies",
        "subcategory": "breaking-bad",
        "series": "Breaking Bad",
        "product_number": "162",
        "short_description": "Фігурка Heisenberg із серії Breaking Bad.",
        "rarity": "regular",
        "is_new": False,
        "is_active": True,
        "images": [
            "https://lh3.googleusercontent.com/proxy/YtsdeGL5SB7k6rZCoBHDGaM8hd-SX1fKNua8_osHV6W9ejAfscvJcjPtAVIc-zTgC1qHeqmspXmnv3XWT4zMmlgqRKPQc862dGJqWP1SQnin6lWNpLtzvqKp2M3p_WbptJHRPhbeeE-42NkbeQ3aDhf7E97hNp5_JcU",
            "https://content.rozetka.com.ua/goods/images/big/359044071.jpg",
        ],
        "aliases": [
            "Хайзенберг",
            "Хайзенберга",
            "Брейкінг Бед",
            "Брекінг Бед",
            "Пуститись берега",
        ],
        "variants": [
            {
               "slug": "funko-pop-heisenberg-162",
                "variant_name": "Стандартна коробка",
                "price": "3000.00",
                "compare_at_price": None,
                "availability_status": "in_stock",
                "delivery_eta": None,
                "stock_quantity": 2,
                "is_box_damaged": False,
                "is_active": True
            },
        ],
    },
    {
        "name": "Funko Pop! Wren 54",
        "slug": "funko-pop-wren-54",
        "category": "books",
        "subcategory": "folk-of-the-air",
        "series": "The Folk of the Air",
        "product_number": "54",
        "short_description": "Фігурка Wren із серії The Folk of the Air.",
        "rarity": "regular",
        "is_new": True,
        "is_active": True,
        "images": [
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dwb437a1c6/images/funko/upload/1/93368_TFotA_Wren(TSH)_POP_GLAM_1-WEB.png?sw=800&sh=800",
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dw77e9dbd2/images/funko/upload/1/93368_TFotA_Wren(TSH)_POP_GLAM-WEB.png?sw=800&sh=800",
        ],
        "aliases": [
            "Врен",
            "Народ Повітря",
        ],
        "variants": [
            {
               "slug": "funko-pop-wren-54",
               "variant_name": "Стандартна коробка",
               "price": Decimal("950.00"),
               "compare_at_price": None,
               "availability_status": "preorder",
               "delivery_eta": "Липень",
               "stock_quantity": None,
               "is_box_damaged": False,
               "is_active": True,
            },
        ],
    },
    {
        "name": "Funko Pop! Jude Duarte (Coronation Gown) 50",
        "slug": "funko-pop-jude-duarte-50",
        "category": "books",
        "subcategory": "folk-of-the-air",
        "series": "The Folk of the Air",
        "product_number": "50",
        "short_description": "Фігурка Jude Duarte із серії The Folk of the Air.",
        "rarity": "exclusive",
        "is_new": True,
        "is_active": True,
        "images": [
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dwe86952de/images/funko/upload/1/92027_TFotA_Jude(Gown)_POP_GLAM_1-FW-WEB.png?sw=800&sh=800",
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dwe80ece2d/images/funko/upload/1/92027_TFotA_Jude(Gown)_POP_GLAM-WEB.png?sw=800&sh=800",
        ],
        "aliases": [
            "Джуд",
            "Джуд Дуарте",
            "Народ Повітря",
        ],
        "variants": [
            {
               "slug": "funko-pop-jude-duarte-50",
               "variant_name": "Стандартна коробка",
               "price": Decimal("1050.00"),
               "compare_at_price": None,
               "availability_status": "preorder",
               "delivery_eta": "Липень",
               "stock_quantity": None,
               "is_box_damaged": False,
               "is_active": True,
            },
        ],
    },
    {
        "name": "Funko Pop! Dr. Manhattan 1888",
        "slug": "funko-pop-dr-manhattan-1888",
        "category": "heroes",
        "subcategory": "dc",
        "series": "DC",
        "product_number": "1888",
        "short_description": "Фігурка Dr Manhattan із серії DC.",
        "rarity": "exclusive",
        "is_new": False,
        "is_active": True,
        "images": [
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dwef465baf/images/funko/upload/87145_WATCHMEN_DOCTORMANHATTAN_POP_GLAM_1.1436_4203_8dd86a44ca0d9b5_87145_watchmen_doctormanhattan_pop_glam_1-WEB.png?sw=800&sh=800",
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dwaac02443/images/funko/upload/87145_POPMovies-Watchmen_DrManhattan_POP_GLAM-WEB.png?sw=800&sh=800",
        ],
        "aliases": [
            "Манхетен",
            "Манхеттен",
            "Мангетен",
            "Мангеттен",
            "Доктор Манхетен",
            "Доктор Манхеттен",
            "Доктор Мангетен",
            "Доктор Мангеттен",
            "Доктор",
            "Доктора",
            "Доктора Манхетена",
            "Доктора Манхеттена",
            "Доктора Мангетена",
            "Доктора Мангеттена",
            "ДС",
        ],
        "variants": [
            {
               "slug": "funko-pop-dr-manhattan-1888",
               "variant_name": "Стандартна коробка",
               "price": Decimal("1050.00"),
               "compare_at_price": None,
               "availability_status": "in_stock",
               "delivery_eta": None,
               "stock_quantity": 2,
               "is_box_damaged": False,
               "is_active": True,
            },
            {
                "slug": "funko-pop-dr-manhattan-1888-damaged-box",
                "variant_name": "Пошкоджена коробка",
                "price": Decimal("750.00"),
                "compare_at_price": Decimal("1050.00"),
                "availability_status": "in_stock",
                "delivery_eta": None,
                "stock_quantity": 1,
                "is_box_damaged": True,
                "is_active": True
            }
        ],
    },
    {
        "name": "Funko Pop! Jude Duarte 48",
        "slug": "funko-pop-jude-duarte-48",
        "category": "books",
        "subcategory": "folk-of-the-air",
        "series": "The Folk of the Air",
        "product_number": "48",
        "short_description": "Фігурка Jude Duarte із серії The Folk of the Air.",
        "rarity": "regular",
        "is_new": True,
        "is_active": True,
        "images": [
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dwaaf280a0/images/funko/upload/1/91631_TFotA_JudeDuarte_POP_GLAM_1-WEB.png?sw=800&sh=800",
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dw22ebc8fc/images/funko/upload/1/91631_TFotA_JudeDuarte_POP_GLAM-WEB.png?sw=800&sh=800",
        ],
        "aliases": [
            "Джуд",
            "Джуд Дуарте",
            "Народ Повітря",
        ],
        "variants": [
            {
               "slug": "funko-pop-jude-duarte-48",
               "variant_name": "Стандартна коробка",
               "price": Decimal("950.00"),
               "compare_at_price": None,
               "availability_status": "preorder",
               "delivery_eta": "Липень",
               "stock_quantity": None,
               "is_box_damaged": False,
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