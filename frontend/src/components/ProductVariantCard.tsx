import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import type { ProductCardItem } from "../types/productCard";

interface Props {
  item: ProductCardItem;
}

export default function ProductVariantCard({ item }: Props) {
  const { addToCart } = useCart();

  const discount =
    item.compareAtPrice && item.compareAtPrice > item.price
      ? Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100)
      : null;

  function handleBuyClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    const added = addToCart({
      variantId: item.variantId,
      variantSlug: item.variantSlug,
      productId: item.productId,
      productName: item.productName,
      variantName: item.variantName,
      imageUrl: item.imageUrl,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      availabilityStatus: item.availabilityStatus,
      isBoxDamaged: item.isBoxDamaged,
      stockQuantity: item.stockQuantity,
    });

    if (!added) {
      window.dispatchEvent(
        new CustomEvent("cart:limit-reached", {
          detail: {
            message: "У кошику вже максимальна доступна кількість цього товару.",
          },
        })
      );
      return;
    }

    window.dispatchEvent(new Event("cart:open"));
  }

  return (
    <Link to={`/product/${item.variantSlug}`} className="product-card">
      <div className="product-card-image-wrap">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.productName}
            className="product-card-image"
          />
        ) : (
          <div className="product-card-image-placeholder">No image</div>
        )}

        {item.isBoxDamaged && (
          <div className="product-card-badge-damaged product-badge-always">
            Пошкоджена коробка
          </div>
        )}

        {discount && (
          <div className="product-card-badge-discount product-badge-always">
            -{discount}%
          </div>
        )}
      </div>

      <div className="product-card-body">
        <p className="product-card-series">{item.series}</p>
        <h3 className="product-card-title">{item.productName}</h3>

        <div className="product-card-price-wrap">
          {item.compareAtPrice && (
            <span className="old-price">{item.compareAtPrice} грн</span>
          )}
          <span className="price">{item.price} грн</span>
        </div>

        <div
          className={`product-card-status ${
            item.availabilityStatus === "in_stock"
              ? "status-in-stock"
              : "status-preorder"
          }`}
        >
          {item.availabilityStatus === "in_stock"
            ? "В наявності"
            : "Передзамовлення"}
        </div>

        <button
          className="product-buy-btn"
          onClick={handleBuyClick}
          data-cart-action="add"
        >
          Купити
        </button>
      </div>
    </Link>
  );
}