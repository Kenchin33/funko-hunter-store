from decimal import Decimal
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.order import Order
from app.models.order_item import OrderItem
from app.services.email_service import EmailService


class OrderService:
    @staticmethod
    def create_order(db: Session, payload) -> Order:
        full_name_parts = payload.full_name.strip().split(maxsplit=1)
        first_name = full_name_parts[0]
        last_name = full_name_parts[1] if len(full_name_parts) > 1 else ""

        total_amount = sum(Decimal(str(item.price)) * item.quantity for item in payload.items)

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
            except Exception as exc:
                print("ORDER EMAIL ERROR:", exc)

        return created_order