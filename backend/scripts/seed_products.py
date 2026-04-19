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
        "name": "Funko Pop! David Martinez 2413",
        "slug": "funko-pop-david-martinez-2413",
        "category": "anime",
        "subcategory": "cyberpunk-edgerunners",
        "series": "Cyberpunk: Edgerunners",
        "product_number": "2413",
        "short_description": "Фігурка David із серії Cybperunk: Edgerunners.",
        "rarity": "regular",
        "is_new": True,
        "is_active": True,
        "images": [
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dw9bcaff66/images/funko/upload/1/93274_CPE_S1_DavidMartinez_POP_EDIT_T7_GLAM-WEB.png?sw=800&sh=800",
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dw1e4cbc44/images/funko/upload/1/93274_CPE_S1_DavidMartinez_POP_EDIT_T7_GLAM_Frontview-WEB.png?sw=800&sh=800",
        ],
        "aliases": [
            "Давід",
            "Девід",
            "Давід Мартінез",
            "Девід Мартінез",
            "Давіда Мартінеза",
            "Девіда Мартінеза",
            "Кіберпанк",
        ],
        "variants": [
            {
               "slug": "funko-pop-david-martinez-2413",
               "variant_name": "Стандартна коробка",
               "price": Decimal("950.00"),
               "compare_at_price": None,
               "availability_status": "preorder",
               "delivery_eta": "Червень",
               "stock_quantity": None,
               "is_box_damaged": False,
               "is_active": True,
            },
        ],
    },
    {
        "name": "Funko Pop! Rebecca 2415",
        "slug": "funko-pop-rebecca-2415",
        "category": "anime",
        "subcategory": "cyberpunk-edgerunners",
        "series": "Cyberpunk: Edgerunners",
        "product_number": "2415",
        "short_description": "Фігурка Rebecca із серії Cybperunk: Edgerunners.",
        "rarity": "regular",
        "is_new": False,
        "is_active": True,
        "images": [
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dw031041de/images/funko/upload/1/93276_CPE_S1_Rebecca_POP_EDIT_T7_GLAM-WEB.png?sw=800&sh=800",
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dw45cb1117/images/funko/upload/1/93276_CPE_S1_Rebecca_POP_EDIT_T7_GLAM_Frontview-WEB.png?sw=800&sh=800",
        ],
        "aliases": [
            "Ребекка",
            "Ребекки",
            "Ребека",
            "Ребеки"
            "Кіберпанк",
        ],
        "variants": [
            {
               "slug": "funko-pop-rebecca-2415",
               "variant_name": "Стандартна коробка",
               "price": Decimal("950.00"),
               "compare_at_price": None,
               "availability_status": "preorder",
               "delivery_eta": "Червень",
               "stock_quantity": None,
               "is_box_damaged": False,
               "is_active": True,
            },
        ],
    },
    {
        "name": "Funko Pop! Marshall D. Teach 1921",
        "slug": "funko-pop-marshall-d-teach-1921",
        "category": "anime",
        "subcategory": "one-piece",
        "series": "One Piece",
        "product_number": "1921",
        "short_description": "Фігурка Marshal D Teach із серії One Piece.",
        "rarity": "exclusive",
        "is_new": False,
        "is_active": True,
        "images": [
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dwc923dccc/images/funko/upload/84945a_OP_MarshallDTeach_POP_GLAM-1-FW-WEB.png?sw=800&sh=800",
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dwb64171c6/images/funko/upload/84945a_OP_MarshallDTeach_POP_GLAM-WEB.png?sw=800&sh=800",
        ],
        "aliases": [
            "Чорна борода",
            "Маршал д Тіч",
            "Тіч",
            "Чорної бороди",
            "Тіча",
            "Ван Піс",
        ],
        "variants": [
            {
                "slug": "funko-pop-marshall-d-teach-1921",
                "variant_name": "Стандартна коробка",
                "price": "800.00",
                "compare_at_price": None,
                "availability_status": "in_stock",
                "delivery_eta": None,
                "stock_quantity": 3,
                "is_box_damaged": False,
                "is_active": True
            },
            {
                "slug": "funko-pop-marshall-d-teach-1921-damaged-box",
                "variant_name": "Пошкоджена коробка",
                "price": "650.00",
                "compare_at_price": "800.00",
                "availability_status": "in_stock",
                "delivery_eta": None,
                "stock_quantity": 2,
                "is_box_damaged": True,
                "is_active": True
            }
        ],
    },
    {
        "name": "Funko Pop! Marshall D. Teach 1921 CHASE",
        "slug": "funko-pop-marshall-d-teach-1921-chase",
        "category": "anime",
        "subcategory": "one-piece",
        "series": "One Piece",
        "product_number": "1921",
        "short_description": "Фігурка Marshal D Teach із серії One Piece у CHASE варіації",
        "rarity": "exclusive",
        "is_new": False,
        "is_active": True,
        "images": [
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dw758d5a9d/images/funko/upload/84945b_OP_MarshallDTeachCH_POP_GLAM-1-FW-WEB.png?sw=800&sh=800",
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dw2ec989cc/images/funko/upload/84945b_OP_MarshallDTeachCH_POP_GLAM-WEB.png?sw=800&sh=800",
        ],
        "aliases": [
            "Чорна борода",
            "Маршал д Тіч",
            "Тіч",
            "Чорної бороди",
            "Тіча",
            "Ван Піс",
            "Чейз",
        ],
        "variants": [
            {
               "slug": "funko-pop-marshall-d-teach-1921-chase",
                "variant_name": "Стандартна коробка",
                "price": "2500.00",
                "compare_at_price": None,
                "availability_status": "in_stock",
                "delivery_eta": None,
                "stock_quantity": 1,
                "is_box_damaged": False,
                "is_active": True
            },
        ],
    },
    {
        "name": "Funko Pop! Gaara 2230",
        "slug": "funko-pop-gaara-2230",
        "category": "anime",
        "subcategory": "naruto",
        "series": "Naruto",
        "product_number": "2230",
        "short_description": "Фігурка Gaara із серії Naruto",
        "rarity": "regular",
        "is_new": False,
        "is_active": True,
        "images": [
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dw097fa3e1/images/funko/upload/1/90622_NarutoClassic_Gaara_POP_GLAM-1-WEB.png?sw=800&sh=800",
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dwafb1ee39/images/funko/upload/1/90622_NarutoClassic_Gaara_POP_GLAM-WEB.png?sw=800&sh=800",
        ],
        "aliases": [
            "Гаара",
            "Гаари",
            "Наруто",
        ],
        "variants": [
            {
               "slug": "funko-pop-gaara-2230",
                "variant_name": "Стандартна коробка",
                "price": "950.00",
                "compare_at_price": None,
                "availability_status": "in_stock",
                "delivery_eta": None,
                "stock_quantity": 3,
                "is_box_damaged": False,
                "is_active": True
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