import { Link } from "react-router-dom";
import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0]?.image_url;

  return (
    <Link to={`/product/${product.slug}`} className="product-card">
      <div className="product-card-image-wrap">
        {image ? (
          <img src={image} alt={product.name} className="product-card-image" />
        ) : (
          <div className="product-card-image-placeholder">No image</div>
        )}
      </div>

      <div className="product-card-body">
        <p className="product-card-series">{product.series}</p>
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-price">{product.price} грн</p>

        <div className="product-card-status">
          {product.availability_status === "in_stock"
            ? "В наявності"
            : "Передзамовлення"}
        </div>
      </div>
    </Link>
  );
}