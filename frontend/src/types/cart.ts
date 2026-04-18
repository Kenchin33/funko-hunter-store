export interface CartItem {
    variantId: number;
    variantSlug: string;
    productId: number;
    productName: string;
    variantName: string;
    imageUrl: string | null;
    price: number;
    compareAtPrice: number | null;
    quantity: number;
    availabilityStatus: string;
    isBoxDamaged: boolean;
  }