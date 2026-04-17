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