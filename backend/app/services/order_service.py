from decimal import Decimal
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.services.email_service import EmailService


class OrderService:
    @staticmethod
    def create_order(db: Session, payload) -> Order:
        full_name_parts = payload.full_name.strip().split(maxsplit=1)
        first_name = full_name_parts[0]
        last_name = full_name_parts[1] if len(full_name_parts) > 1 else ""

        total_amount = sum(Decimal(str(item.price)) * item.quantity for item in payload.items)

        # 1. Перевірка і списання залишків
        depleted_variants = []

        for item in payload.items:
            variant = db.scalar(
                select(ProductVariant).where(ProductVariant.id == item.variant_id)
            )

            if not variant:
                raise ValueError(f"Variant {item.variant_id} not found")

            if variant.availability_status == "in_stock":
                if item.quantity > variant.stock_quantity:
                    raise ValueError(
                        f"Not enough stock for variant {variant.id}. Available: {variant.stock_quantity}"
                    )

                variant.stock_quantity -= item.quantity

                if variant.stock_quantity <= 0:
                    variant.stock_quantity = 0
                    variant.is_active = False
                    depleted_variants.append(variant)

                db.add(variant)

        # 2. Якщо у товару більше немає активних варіантів — ховаємо товар
        for item in payload.items:
            product = db.scalar(
                select(Product)
                .options(selectinload(Product.variants))
                .where(Product.id == item.product_id)
            )

            if product:
                has_active_variants = any(v.is_active for v in product.variants)
                if not has_active_variants:
                    product.is_active = False
                    db.add(product)

        # 3. Створення замовлення
        order = Order(
            order_number=f"FH-{uuid4().hex[:8].upper()}",
            customer_first_name=first_name,
            customer_last_name=last_name,
            customer_email=str(payload.email),
            customer_phone=payload.phone,
            delivery_city=payload.city,
            delivery_branch=payload.branch,
            comment=None,
            status="new",
            total_amount=total_amount,
        )

        db.add(order)
        db.flush()

        for item in payload.items:
            db.add(
                OrderItem(
                    order_id=order.id,
                    product_id=item.product_id,
                    product_name_snapshot=f"{item.product_name} ({item.variant_name})",
                    image_url_snapshot=item.image_url,
                    price_snapshot=item.price,
                    quantity=item.quantity,
                )
            )

        db.commit()

        stmt = (
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.id == order.id)
        )
        created_order = db.scalar(stmt)

        if created_order:
            try:
                EmailService.send_order_confirmation_to_client(created_order)
                EmailService.send_order_notification_to_admin(created_order)

                for variant in depleted_variants:
                    EmailService.send_out_of_stock_notification_to_admin(variant)

            except Exception as exc:
                print("ORDER EMAIL ERROR:", exc)

        return created_order