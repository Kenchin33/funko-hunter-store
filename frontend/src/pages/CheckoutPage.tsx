import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { createOrder } from "../api/orderApi";
import { useCart } from "../hooks/useCart";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    branch: "",
  });

  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.phone || !form.city || !form.branch) {
      alert("Будь ласка, заповніть всі поля");
      return;
    }

    if (items.length === 0) {
      alert("Кошик порожній");
      return;
    }

    try {
      setSubmitting(true);

      const order = await createOrder({
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        city: form.city,
        branch: form.branch,
        items: items.map((item) => ({
          product_id: item.productId,
          variant_id: item.variantId,
          product_name: item.productName,
          variant_name: item.variantName,
          image_url: item.imageUrl,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      clearCart();

      navigate("/order-success", {
        state: {
          orderNumber: order.order_number,
          deliveryCity: order.delivery_city,
          deliveryBranch: order.delivery_branch,
          items,
          totalPrice,
        },
      });
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Не вдалося оформити замовлення");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="store-page">
      <Header />

      <main className="checkout-page">
        <h1>Оформлення замовлення</h1>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Дані доставки</h2>

            <input
              type="text"
              name="fullName"
              placeholder="ПІБ"
              value={form.fullName}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Телефон"
              value={form.phone}
              onChange={handleChange}
            />

            <input
              type="text"
              name="city"
              placeholder="Місто"
              value={form.city}
              onChange={handleChange}
            />

            <input
              type="text"
              name="branch"
              placeholder="Номер Відділення НП"
              value={form.branch}
              onChange={handleChange}
            />

            <button type="submit" className="checkout-btn" disabled={submitting}>
              {submitting ? "Оформлення..." : "Оформити замовлення"}
            </button>
          </form>

          <div className="checkout-summary">
            <h2>Ваше замовлення</h2>

            {items.map((item) => (
              <div key={item.variantId} className="checkout-item">
                <div className="checkout-item-left">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="checkout-item-image"
                    />
                  )}

                  <div>
                    <div className="checkout-item-title">{item.productName}</div>
                    <div className="checkout-item-variant">{item.variantName}</div>
                  </div>
                </div>

                <div className="checkout-item-right">
                  {item.quantity} × {item.price} грн
                </div>
              </div>
            ))}

            <div className="checkout-total">
              Разом: <strong>{totalPrice.toFixed(2)} грн</strong>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}