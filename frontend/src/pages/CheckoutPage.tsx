import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../hooks/useCart";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.fullName || !form.phone || !form.city || !form.address) {
      alert("Будь ласка, заповніть всі поля");
      return;
    }

    // тут потім буде API
    clearCart();
    navigate("/order-success");
  }

  return (
    <div className="store-page">
      <Header />

      <main className="checkout-page">
        <h1>Оформлення замовлення</h1>

        <div className="checkout-layout">
          {/* Форма */}
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
              name="address"
              placeholder="Номер Відділення НП"
              value={form.address}
              onChange={handleChange}
            />

            <button type="submit" className="checkout-btn">
              Оформити замовлення
            </button>
          </form>

          {/* Список товарів */}
          <div className="checkout-summary">
            <h2>Ваше замовлення</h2>

            {items.map((item) => (
              <div key={item.variantId} className="checkout-item">
                <div>{item.productName}</div>
                <div>{item.quantity} × {item.price} грн</div>
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