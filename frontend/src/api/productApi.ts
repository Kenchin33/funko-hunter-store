import axios from "axios";
import type { Product } from "../types/product";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export async function getAllProducts(): Promise<Product[]> {
  const response = await api.get<Product[]>("/products");
  return response.data;
}

export async function getNewProducts(): Promise<Product[]> {
  const response = await api.get<Product[]>("/products/new");
  return response.data;
}

export async function getPreorderProducts(): Promise<Product[]> {
  const response = await api.get<Product[]>("/products/preorder");
  return response.data;
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const response = await api.get<Product>(`/products/${slug}`);
  return response.data;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const response = await api.get<Product[]>("/products/search", {
    params: { q: query },
  });
  return response.data;
}

export async function searchProductsLimited(query: string): Promise<Product[]> {
  const response = await api.get<Product[]>("/products/search", {
    params: { q: query },
  });

  return response.data.slice(0, 6);
}

export async function getCatalogProducts(
  category: string,
  subcategory?: string,
  excludeSubcategories?: string[]
): Promise<Product[]> {
  const path = subcategory
    ? `/products/catalog/${category}/${subcategory}`
    : `/products/catalog/${category}`;

  const response = await api.get<Product[]>(path, {
    params: excludeSubcategories?.length
      ? { exclude_subcategories: excludeSubcategories.join(",") }
      : undefined,
  });

  return response.data;
}

export async function getPreorderCatalogProducts(): Promise<Product[]> {
  const response = await api.get<Product[]>("/products/catalog/preorder");
  return response.data;
}