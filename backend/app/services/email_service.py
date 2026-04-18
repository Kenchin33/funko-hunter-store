import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.config import settings


class EmailService:
    @staticmethod
    def _send_email(subject: str, to_email: str, html_body: str) -> None:
        if not settings.SMTP_EMAIL or not settings.SMTP_PASSWORD:
            print("EMAIL WARNING: SMTP credentials are not configured.")
            return

        msg = MIMEMultipart()
        msg["From"] = settings.SMTP_EMAIL
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(html_body, "html", "utf-8"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
            server.send_message(msg)

    @staticmethod
    def send_order_confirmation_to_client(order) -> None:
        items_html = "".join(
            f"<li>{item.product_name_snapshot} — {item.quantity} × {item.price_snapshot} грн</li>"
            for item in order.items
        )

        html = f"""
        <h2>Ваше замовлення оформлено</h2>
        <p><strong>Номер замовлення:</strong> {order.order_number}</p>
        <p><strong>Адреса доставки:</strong> {order.delivery_city}, відділення {order.delivery_branch}</p>
        <p><strong>Склад замовлення:</strong></p>
        <ul>{items_html}</ul>
        <p><strong>Сума:</strong> {order.total_amount} грн</p>
        <p>Дякуємо за замовлення у Funko Hunter!</p>
        """

        EmailService._send_email(
            subject=f"Підтвердження замовлення {order.order_number}",
            to_email=order.customer_email,
            html_body=html,
        )

    @staticmethod
    def send_order_notification_to_admin(order) -> None:
        items_html = "".join(
            f"<li>{item.product_name_snapshot} — {item.quantity} × {item.price_snapshot} грн</li>"
            for item in order.items
        )

        html = f"""
        <h2>Нове замовлення</h2>
        <p><strong>Номер замовлення:</strong> {order.order_number}</p>
        <p><strong>Клієнт:</strong> {order.customer_first_name} {order.customer_last_name}</p>
        <p><strong>Email:</strong> {order.customer_email}</p>
        <p><strong>Телефон:</strong> {order.customer_phone}</p>
        <p><strong>Доставка:</strong> {order.delivery_city}, відділення {order.delivery_branch}</p>
        <p><strong>Склад замовлення:</strong></p>
        <ul>{items_html}</ul>
        <p><strong>Сума:</strong> {order.total_amount} грн</p>
        """

        EmailService._send_email(
            subject=f"Нове замовлення {order.order_number}",
            to_email=settings.ADMIN_EMAIL,
            html_body=html,
        )