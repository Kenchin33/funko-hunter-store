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
    def create_order(db: Session, payload, current_user) -> Order:
        full_name_parts = payload.full_name.strip().split(maxsplit=1)
        first_name = full_name_parts[0]
        last_name = full_name_parts[1] if len(full_name_parts) > 1 else ""
        user_id=current_user.id,

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
            user_id=current_user.id,
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
    
    @staticmethod
    def get_user_orders(db: Session, user_id: int) -> list[Order]:
        stmt = (
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc(), Order.id.desc())
        )
        return list(db.scalars(stmt).all())
    
    @staticmethod
    def get_user_order_by_number(db: Session, user_id: int, order_number: str) -> Order | None:
        stmt = (
            select(Order)
            .options(selectinload(Order.items))
            .where(
                Order.user_id == user_id,
                Order.order_number == order_number,
            )
        )
        return db.scalar(stmt)


    @staticmethod
    def get_all_orders(db: Session) -> list[Order]:
        stmt = (
            select(Order)
            .options(selectinload(Order.items))
            .order_by(Order.created_at.desc(), Order.id.desc())
        )
        return list(db.scalars(stmt).all())

    @staticmethod
    def get_order_by_number(db: Session, order_number: str) -> Order | None:
        stmt = (
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.order_number == order_number)
        )
        return db.scalar(stmt)
    
    @staticmethod
    def update_order_status(db: Session, order_number: str, new_status: str, tracking_number: str | None = None,) -> Order | None:
        order = db.scalar(
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.order_number == order_number)
        )

        if not order:
            return None

        allowed_statuses = {"new", "shipped", "resolved", "rejected"}
        if new_status not in allowed_statuses:
            raise ValueError("Некоректний статус")
        
        if new_status == "shipped":
            if not tracking_number or not tracking_number.strip():
                raise ValueError("Для статусу 'Відправлено' потрібно вказати трек-номер")
            order.tracking_number = tracking_number.strip()

        order.status = new_status
        db.add(order)
        db.commit()
        db.refresh(order)

        if new_status == "rejected":
            try:
                EmailService.send_order_rejected_to_client(order)
            except Exception as exc:
                print("ORDER REJECT EMAIL ERROR:", exc)

        return order
    
    @staticmethod
    def get_order_for_assistant(
        db: Session,
        order_number: str,
        email: str,
    ) -> Order | None:
        stmt = (
            select(Order)
            .options(selectinload(Order.items))
            .where(
                Order.order_number == order_number.strip(),
                Order.customer_email == email.strip(),
            )
        )
        return db.scalar(stmt)