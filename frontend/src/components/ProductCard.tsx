import { Link } from "react-router-dom";
import type { Product } from "../types/product";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const variant = product.variants.find(v => v.is_active);

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

  return (
    <Link to={`/product/${variant.slug}`} className="product-card">
      <div className="product-card-image-wrap">
        {image && <img src={image} className="product-card-image" />}

        {variant.is_box_damaged && (
          <div className="product-badge product-badge-damaged">
            Пошкоджена коробка
          </div>
        )}

        {discount && (
          <div className="product-badge product-badge-discount">
            -{discount}%
          </div>
        )}
      </div>

      <div className="product-card-body">
        <p className="product-card-series">{product.series}</p>
        <h3>{product.name}</h3>

        <div className="product-card-price-wrap">
          {oldPrice && (
            <span className="old-price">{oldPrice} грн</span>
          )}
          <span className="price">{price} грн</span>
        </div>
      </div>
    </Link>
  );
}