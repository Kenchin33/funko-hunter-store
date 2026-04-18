import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import type { Product } from "../types/product";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const [showLimitToast, setShowLimitToast] = useState(false);

  const foundVariant = product.variants.find((v) => v.is_active);

  if (!foundVariant) {
    return null;
  }

  const variant = foundVariant;
  const image = product.images[0]?.image_url ?? null;

  const price = Number(variant.price);
  const oldPrice = variant.compare_at_price
    ? Number(variant.compare_at_price)
    : null;

  const discount =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;

  function showToast() {
    setShowLimitToast(true);
    window.setTimeout(() => {
      setShowLimitToast(false);
    }, 2500);
  }

  function handleBuyClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    const added = addToCart({
      variantId: variant.id,
      variantSlug: variant.slug,
      productId: product.id,
      productName: product.name,
      variantName: variant.variant_name,
      imageUrl: image,
      price,
      compareAtPrice: oldPrice,
      availabilityStatus: variant.availability_status,
      isBoxDamaged: variant.is_box_damaged,
      stockQuantity: variant.stock_quantity,
    });

    if (!added) {
      showToast();
      return;
    }

    window.dispatchEvent(new Event("cart:open"));
  }

  return (
    <>
      {showLimitToast && (
        <div className="cart-limit-toast">
          У кошику вже максимальна доступна кількість цього товару.
        </div>
      )}

      <Link to={`/product/${variant.slug}`} className="product-card">
        <div className="product-card-image-wrap">
          {image ? (
            <img src={image} alt={product.name} className="product-card-image" />
          ) : (
            <div className="product-card-image-placeholder">No image</div>
          )}

          {variant.is_box_damaged && (
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
          <p className="product-card-series">{product.series}</p>
          <h3 className="product-card-title">{product.name}</h3>

          <div className="product-card-price-wrap">
            {oldPrice && <span className="old-price">{oldPrice} грн</span>}
            <span className="price">{price} грн</span>
          </div>

          <div
            className={`product-card-status ${
              variant.availability_status === "in_stock"
                ? "status-in-stock"
                : "status-preorder"
            }`}
          >
            {variant.availability_status === "in_stock"
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
    </>
  );
}