export interface ProductCardItem {
    productId: number;
    productName: string;
    productSlug: string;
    series: string;
    rarity: string;
    imageUrl: string | null;
  
    variantId: number;
    variantSlug: string;
    variantName: string;
    price: number;
    compareAtPrice: number | null;
    availabilityStatus: string;
    deliveryEta: string | null;
    stockQuantity: number;
    isBoxDamaged: boolean;
  }