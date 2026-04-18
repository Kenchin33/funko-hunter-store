import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

interface MiniCartProps {
  onClose: () => void;
}

export default function MiniCart({ onClose }: MiniCartProps) {
  const {
    items,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  return (
    <div className="mini-cart">
      <div className="mini-cart-header">
        <h3>Кошик</h3>
        <button className="mini-cart-close" onClick={onClose}>
          ×
        </button>
      </div>

      {items.length === 0 ? (
        <div className="mini-cart-empty">Ваш кошик порожній.</div>
      ) : (
        <>
          <div className="mini-cart-items">
            {items.map((item) => {
              const maxReached =
                item.availabilityStatus === "in_stock" &&
                item.quantity >= item.stockQuantity;

              return (
                <div key={item.variantId} className="mini-cart-item">
                  <Link
                    to={`/product/${item.variantSlug}`}
                    className="mini-cart-item-image-wrap"
                    onClick={onClose}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="mini-cart-item-image"
                      />
                    ) : (
                      <div className="mini-cart-item-image-placeholder">No image</div>
                    )}
                  </Link>

                  <div className="mini-cart-item-info">
                    <Link
                      to={`/product/${item.variantSlug}`}
                      className="mini-cart-item-title"
                      onClick={onClose}
                    >
                      {item.productName}
                    </Link>

                    <p className="mini-cart-item-variant">{item.variantName}</p>

                    {item.isBoxDamaged && (
                      <div className="mini-cart-item-badge">Пошкоджена коробка</div>
                    )}

                    <p className="mini-cart-item-price">{item.price} грн</p>

                    <div className="mini-cart-controls">
                      <div className="mini-cart-quantity-controls">
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
                        className="mini-cart-remove-btn"
                        onClick={() => removeFromCart(item.variantId)}
                      >
                        Видалити
                      </button>
                    </div>

                    {maxReached && (
                      <p className="mini-cart-limit-note">
                        Досягнуто максимальну доступну кількість.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mini-cart-footer">
            <div className="mini-cart-total">
              <span>Разом:</span>
              <strong>{totalPrice.toFixed(2)} грн</strong>
            </div>

            <Link to="/cart" className="mini-cart-go-btn" onClick={onClose}>
              Перейти у кошик
            </Link>
          </div>
        </>
      )}
    </div>
  );
}