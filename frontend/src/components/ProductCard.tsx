import { Link } from "react-router-dom";
import type { Product } from "../types/product";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const variant =
  product.variants.find((v) => v.is_active) ??
  product.variants[0];

  if (!variant) return null;

  const image = product.images[0]?.image_url;

  const price = Number(variant.price);
  const oldPrice = variant.compare_at_price
    ? Number(variant.compare_at_price)
    : null;

  const discount =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;

  function handleBuyClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    console.log("Додати в кошик:", {
      productId: product.id,
      variantId: variant.id,
      slug: variant.slug,
      name: product.name,
      price,
    });
  }

  return (
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

        <button className="product-buy-btn" onClick={handleBuyClick}>
          Купити
        </button>
      </div>
    </Link>
  );
}