import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useCart } from "../hooks/useCart";

export default function CartPage() {
  const {
    items,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  return (
    <div className="store-page">
      <Header />

      <main className="cart-page">
        <div className="cart-page-header">
          <h1>Кошик</h1>
          {items.length > 0 && (
            <button className="cart-clear-btn" onClick={clearCart}>
              Очистити кошик
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">Ваш кошик порожній.</div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((item) => {
                const maxReached =
                  item.availabilityStatus === "in_stock" &&
                  item.quantity >= item.stockQuantity;

                return (
                  <div key={item.variantId} className="cart-item">
                    <Link
                      to={`/product/${item.variantSlug}`}
                      className="cart-item-image-wrap"
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="cart-item-image"
                        />
                      ) : (
                        <div className="cart-item-image-placeholder">No image</div>
                      )}
                    </Link>

                    <div className="cart-item-info">
                      <Link to={`/product/${item.variantSlug}`} className="cart-item-title">
                        {item.productName}
                      </Link>

                    <p className="cart-item-variant">{item.variantName}</p>

                    {item.isBoxDamaged && (
                      <div className="cart-item-badge">Пошкоджена коробка</div>
                    )}

                    <p className="cart-item-price">{item.price} грн</p>

                    {maxReached && (
                      <p className="cart-limit-note">
                        Досягнуто максимальну доступну кількість.
                      </p>
                    )}
                  </div>

                  <div className="cart-item-controls">
                    <div className="cart-quantity-controls">
                      <button onClick={() => decreaseQuantity(item.variantId)}>-</button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => increaseQuantity(item.variantId)}
                        disabled={maxReached}
                        className={maxReached ? "cart-btn-disabled" : ""}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="cart-remove-btn"
                      onClick={() => removeFromCart(item.variantId)}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
                );
            })}
            </div>

            <div className="cart-summary">
              <h2>Разом</h2>
              <p>{totalPrice.toFixed(2)} грн</p>
              <Link to="/checkout" className="cart-checkout-btn">
                Оформити замовлення
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}