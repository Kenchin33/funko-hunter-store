import type { ProductCardItem } from "../types/productCard";
import ProductVariantCard from "./ProductVariantCard";

interface ProductSectionProps {
  title: string;
  items: ProductCardItem[];
}

export default function ProductSection({ title, items }: ProductSectionProps) {
  return (
    <section className="product-section">
      <div className="section-header">
        <h2>{title}</h2>
      </div>

      <div className="product-grid">
        {items.map((item) => (
          <ProductVariantCard
            key={`${item.productId}-${item.variantId}`}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}