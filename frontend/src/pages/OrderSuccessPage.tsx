import { Link, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function OrderSuccessPage() {
  const location = useLocation();
  const state = location.state as
    | {
        orderNumber?: string;
        deliveryCity?: string;
        deliveryBranch?: string;
        items?: Array<{
          variantId: number;
          productName: string;
          variantName: string;
          imageUrl?: string | null;
          quantity: number;
          price: number;
        }>;
        totalPrice?: number;
      }
    | undefined;

  return (
    <div className="store-page">
      <Header />

      <main className="order-success-page">
        <h1>Замовлення оформлено!</h1>
        <p>Ми вже працюємо над вашим замовленням.</p>

        {state?.orderNumber && (
          <p className="order-success-number">
            Номер замовлення: <strong>{state.orderNumber}</strong>
          </p>
        )}

        {(state?.deliveryCity || state?.deliveryBranch) && (
          <p className="order-success-address">
            Доставка: {state?.deliveryCity}, відділення {state?.deliveryBranch}
          </p>
        )}

        {state?.items && state.items.length > 0 && (
          <div className="order-success-summary">
            <h2>Склад замовлення</h2>

            <div className="order-success-items">
              {state.items.map((item) => (
                <div key={item.variantId} className="order-success-item">
                  <div className="order-success-item-left">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="order-success-item-image"
                      />
                    )}

                    <div>
                      <div className="order-success-item-title">{item.productName}</div>
                      <div className="order-success-item-variant">{item.variantName}</div>
                    </div>
                  </div>

                  <div className="order-success-item-right">
                    {item.quantity} × {item.price} грн
                  </div>
                </div>
              ))}
            </div>

            <p className="order-success-total">
              Разом: <strong>{state.totalPrice?.toFixed(2)} грн</strong>
            </p>
          </div>
        )}

        <Link to="/" className="success-btn">
          Повернутись на головну
        </Link>
      </main>

      <Footer />
    </div>
  );
}