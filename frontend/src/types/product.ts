export interface ProductImage {
  id: number;
  image_url: string;
  sort_order: number;
}

export interface ProductAlias {
  id: number;
  alias: string;
}

export interface ProductVariant {
  id: number;
  slug: string;
  variant_name: string;
  price: string;
  compare_at_price: string | null;
  availability_status: string;
  delivery_eta: string | null;
  stock_quantity: number;
  is_box_damaged: boolean;
  is_active: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  subcategory: string | null;
  series: string;
  product_number: string | null;
  short_description: string;
  rarity: string;
  is_new: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
  aliases: ProductAlias[];
  variants: ProductVariant[];
}