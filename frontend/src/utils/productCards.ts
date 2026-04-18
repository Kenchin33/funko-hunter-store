import type { Product } from "../types/product";
import type { ProductCardItem } from "../types/productCard";

export function mapProductsToCardItems(products: Product[]): ProductCardItem[] {
  return products.flatMap((product) => {
    const imageUrl = product.images[0]?.image_url ?? null;

    return product.variants
      .filter((variant) => variant.is_active)
      .map((variant) => ({
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        series: product.series,
        rarity: product.rarity,
        imageUrl,

        variantId: variant.id,
        variantSlug: variant.slug,
        variantName: variant.variant_name,
        price: Number(variant.price),
        compareAtPrice: variant.compare_at_price
          ? Number(variant.compare_at_price)
          : null,
        availabilityStatus: variant.availability_status,
        deliveryEta: variant.delivery_eta,
        stockQuantity: variant.stock_quantity,
        isBoxDamaged: variant.is_box_damaged,
      }));
  });
}