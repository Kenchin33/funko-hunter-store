export interface ProductImage {
    id: number;
    image_url: string;
    sort_order: number;
  }
  
  export interface ProductAlias {
    id: number;
    alias: string;
  }
  
  export interface Product {
    id: number;
    name: string;
    slug: string;
    category: string;
    subcategory: string | null;
    series: string;
    product_number: string | null;
    price: string;
    short_description: string;
    rarity: string;
    availability_status: string;
    delivery_eta: string | null;
    stock_quantity: number;
    is_new: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    images: ProductImage[];
    aliases: ProductAlias[];
  }