import type { Product } from "../types/product";
import ProductCard from "./ProductCard";

interface ProductSectionProps {
  title: string;
  products: Product[];
}

export default function ProductSection({
  title,
  products,
}: ProductSectionProps) {
  return (
    <section className="product-section">
      <div className="section-header">
        <h2>{title}</h2>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}