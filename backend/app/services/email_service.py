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
            f"""
            <tr>
                <td style="padding:10px;border-bottom:1px solid #eee;">
                    {f'<img src="{item.image_url_snapshot}" alt="{item.product_name_snapshot}" width="70" style="border-radius:8px;display:block;" />' if item.image_url_snapshot else ''}
                </td>
                <td style="padding:10px;border-bottom:1px solid #eee;">
                    {item.product_name_snapshot}
                </td>
                <td style="padding:10px;border-bottom:1px solid #eee;">
                    {item.quantity} × {item.price_snapshot} грн
                </td>
            </tr>
            """
            for item in order.items
        )

        html = f"""
        <h2>Ваше замовлення оформлено</h2>
        <p><strong>Номер замовлення:</strong> {order.order_number}</p>
        <p><strong>Адреса доставки:</strong> {order.delivery_city}, відділення {order.delivery_branch}</p>
        <p><strong>Склад замовлення:</strong></p>
        <table style="border-collapse:collapse;width:100%;">
            {items_html}
        </table>
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
            f"""
            <tr>
                <td style="padding:10px;border-bottom:1px solid #eee;">
                    {f'<img src="{item.image_url_snapshot}" alt="{item.product_name_snapshot}" width="70" style="border-radius:8px;display:block;" />' if item.image_url_snapshot else ''}
                </td>
                <td style="padding:10px;border-bottom:1px solid #eee;">
                    {item.product_name_snapshot}
                </td>
                <td style="padding:10px;border-bottom:1px solid #eee;">
                    {item.quantity} × {item.price_snapshot} грн
                </td>
            </tr>
            """
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
        <table style="border-collapse:collapse;width:100%;">
            {items_html}
        </table>
        <p><strong>Сума:</strong> {order.total_amount} грн</p>
        """

        EmailService._send_email(
            subject=f"Нове замовлення {order.order_number}",
            to_email=settings.ADMIN_EMAIL,
            html_body=html,
        )
    
    @staticmethod
    def send_out_of_stock_notification_to_admin(variant) -> None:
        html = f"""
        <h2>Товар закінчився</h2>
        <p><strong>Variant ID:</strong> {variant.id}</p>
        <p><strong>Slug:</strong> {variant.slug}</p>
        <p><strong>Назва варіанту:</strong> {variant.variant_name}</p>
        <p>Цей варіант більше не відображається на сайті, бо залишок дорівнює 0.</p>
        """

        EmailService._send_email(
            subject=f"Товар закінчився: {variant.slug}",
            to_email=settings.ADMIN_EMAIL,
            html_body=html,
        )
    
    @staticmethod
    def send_order_rejected_to_client(order) -> None:
        html = f"""
        <h2>Ваше замовлення скасовано</h2>
        <p><strong>Номер замовлення:</strong> {order.order_number}</p>
        <p>На жаль, ваше замовлення було скасоване.</p>
        <p><strong>Адреса доставки:</strong> {order.delivery_city}, відділення {order.delivery_branch}</p>
        <p><strong>Сума:</strong> {order.total_amount} грн</p>
        <p>Якщо у вас виникли питання — зв'яжіться з нами.</p>
        """

        EmailService._send_email(
            subject=f"Замовлення {order.order_number} скасовано",
            to_email=order.customer_email,
            html_body=html,
        )