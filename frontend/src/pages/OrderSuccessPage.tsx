import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function OrderSuccessPage() {
  return (
    <div className="store-page">
      <Header />

      <main className="order-success-page">
        <h1>Замовлення оформлено!</h1>
        <p>Ми вже працюємо над вашим замовленням.</p>

        <Link to="/" className="success-btn">
          Повернутись на головну
        </Link>
      </main>

      <Footer />
    </div>
  );
}