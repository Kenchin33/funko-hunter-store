from decimal import Decimal

from sqlalchemy import select

from app.core.database import SessionLocal
from app.models.product import Product
from app.models.product_alias import ProductAlias
from app.models.product_image import ProductImage


PRODUCTS = [
    {
        "name": "Funko Pop! Poster Usopp (Wanted) 2107",
        "slug": "funko-pop-usopp-wanted-2107",
        "category": "anime",
        "subcategory": "one-piece",
        "series": "One Piece",
        "product_number": "2107",
        "price": Decimal("1250.00"),
        "short_description": "Фігурка Funko Pop Usopp із серії One Piece з постером розшуку.",
        "rarity": "exclusive",
        "availability_status": "in_stock",
        "delivery_eta": None,
        "stock_quantity": 3,
        "is_new": True,
        "is_active": True,
        "images": [
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dw637fc863/images/funko/upload/1/88184_OP_GodUsopp_POP_DisplayCase_GLAM-1-FW-WEB.png?sw=800&sh=800",
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dw66357a09/images/funko/upload/1/88184_OP_GodUsopp_POP_DisplayCase_GLAM-WEB.png?sw=800&sh=800",
        ],
        "aliases": [
            "усопп",
            "усопп ван піс",
            "usopp",
            "усоп",
            "усопа",
            "усоппа",
            "постер усоппа",
            "усопп постер",
            "usopp poster",
            "usopp one piece",
        ],
    },
    {
        "name": "Funko Pop! Tony Stark/Iron Man 1569",
        "slug": "funko-pop-tony-stark-iron-man-1569",
        "category": "heroes",
        "subcategory": "marvel",
        "series": "Marvel",
        "product_number": "1569",
        "price": Decimal("1050.00"),
        "short_description": "Фігурка Funko Pop Tony Stark із серії Marvel.",
        "rarity": "exclusive",
        "availability_status": "preorder",
        "delivery_eta": "4 тижні",
        "stock_quantity": 0,
        "is_new": True,
        "is_active": True,
        "images": [
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dwd0c329b4/images/funko/upload/1/88520_Marvel_TonyStark-IronMan_POP_EDIT_T7_GLAM-WEB.png?sw=800&sh=800",
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dwb1967997/images/funko/upload/1/88520_Marvel_TonyStark-IronMan_POP_EDIT_T7_GLAM_Frontview-WEB.png?sw=800&sh=800",
        ],
        "aliases": [
            "тоні старк",
            "залізна людина",
            "tony stark",
            "toni stark",
            "тоні старка",
            "залізної людини",
            "iron man",
        ],
    },
    {
        "name": "Funko Pop! Joel Miller 1845",
        "slug": "funko-pop-joel-miller-1845",
        "category": "Movies",
        "subcategory": "the-last-of-us",
        "series": "The Last of Us",
        "product_number": "1845",
        "price": Decimal("950.00"),
        "short_description": "Фігурка Funko Pop Joel Miller із серії The Last of Us.",
        "rarity": "regular",
        "availability_status": "in_stock",
        "delivery_eta": None,
        "stock_quantity": 5,
        "is_new": True,
        "is_active": True,
        "images": [
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dwc411aa39/images/funko/upload/1/91814a_POPTV_LoUS1_JoelMiller_GLAM-1-WEB.png?sw=800&sh=800",
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dwecb76465/images/funko/upload/1/91814a_POPTV_LoUS1_JoelMiller_GLAM-WEB.png?sw=800&sh=800",
        ],
        "aliases": [
            "джоель",
            "joel",
            "джоеля",
            "джоель міллер",
            "джоеля міллера",
            "joel miller",
        ],
    },
    {
        "name": "Funko Pop! Naked Snake (Big Boss) 1159",
        "slug": "funko-pop-naked-snake-big-boss-1159",
        "category": "games",
        "subcategory": "metal-gear-solid",
        "series": "Metal Gear Solid",
        "product_number": "1159",
        "price": Decimal("1050.00"),
        "short_description": "Фігурка Funko Pop Naked Snake із серії Metal Gear Solid.",
        "rarity": "exclusive",
        "availability_status": "in_stock",
        "delivery_eta": None,
        "stock_quantity": 4,
        "is_new": False,
        "is_active": True,
        "images": [
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dw2dcaba59/images/funko/upload/1/84850_MetalGearSolid_S1_BigBoss_POP_EDIT_T7_GLAM-WEB.png?sw=800&sh=800",
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dw56fd16c2/images/funko/upload/1/84850_MetalGearSolid_S1_BigBoss_POP_EDIT_T7_GLAM_Frontview-WEB.png?sw=800&sh=800",
        ],
        "aliases": [
            "снейк",
            "снейка",
            "snake",
            "naked snake",
        ],
    },
    {
        "name": "Funko Pop! Vi 1601",
        "slug": "funko-pop-vi-1601",
        "category": "cartoons",
        "subcategory": "arcane",
        "series": "Arcane",
        "product_number": "1601",
        "price": Decimal("850.00"),
        "short_description": "Фігурка Vi із серії Arcane.",
        "rarity": "regular",
        "availability_status": "in_stock",
        "delivery_eta": None,
        "stock_quantity": 2,
        "is_new": False,
        "is_active": True,
        "images": [
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dw9296c4b4/images/funko/upload/75652_ArcaneLOL_Vi_POP_GLAM-1-WEB.png?sw=800&sh=800",
            "https://funko.com/dw/image/v2/BGTS_PRD/on/demandware.static/-/Sites-funko-master-catalog/default/dw73fb66e4/images/funko/upload/75652_ArcaneLOL_Vi_POP_GLAM-WEB.png?sw=800&sh=800",
        ],
        "aliases": [
            "вай",
            "ві",
            "vi",
        ],
    },
]


def update_product_fields(product: Product, item: dict) -> None:
    product.name = item["name"]
    product.category = item["category"]
    product.subcategory = item["subcategory"]
    product.series = item["series"]
    product.product_number = item["product_number"]
    product.price = item["price"]
    product.short_description = item["short_description"]
    product.rarity = item["rarity"]
    product.availability_status = item["availability_status"]
    product.delivery_eta = item["delivery_eta"]
    product.stock_quantity = item["stock_quantity"]
    product.is_new = item["is_new"]
    product.is_active = item["is_active"]


def sync_product_images(db, product: Product, image_urls: list[str]) -> None:
    existing_images = list(product.images)

    for image in existing_images:
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
    existing_aliases = list(product.aliases)

    for alias in existing_aliases:
        db.delete(alias)

    db.flush()

    for alias_value in aliases:
        db.add(
            ProductAlias(
                product_id=product.id,
                alias=alias_value,
            )
        )


def seed():
    db = SessionLocal()

    try:
        for item in PRODUCTS:
            existing = db.scalar(
                select(Product).where(Product.slug == item["slug"])
            )

            if existing:
                update_product_fields(existing, item)
                db.add(existing)
                db.flush()

                sync_product_images(db, existing, item["images"])
                sync_product_aliases(db, existing, item["aliases"])

                print(f"Updated: {existing.slug}")
            else:
                product = Product(
                    name=item["name"],
                    slug=item["slug"],
                    category=item["category"],
                    subcategory=item["subcategory"],
                    series=item["series"],
                    product_number=item["product_number"],
                    price=item["price"],
                    short_description=item["short_description"],
                    rarity=item["rarity"],
                    availability_status=item["availability_status"],
                    delivery_eta=item["delivery_eta"],
                    stock_quantity=item["stock_quantity"],
                    is_new=item["is_new"],
                    is_active=item["is_active"],
                )
                db.add(product)
                db.flush()

                sync_product_images(db, product, item["images"])
                sync_product_aliases(db, product, item["aliases"])

                print(f"Created: {product.slug}")

        db.commit()
        print("Products seeded successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()