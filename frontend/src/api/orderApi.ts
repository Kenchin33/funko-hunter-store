import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export interface OrderItemPayload {
  product_id: number;
  variant_id: number;
  product_name: string;
  variant_name: string;
  image_url?: string | null;
  price: number;
  quantity: number;
}

export interface CreateOrderPayload {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  branch: string;
  items: OrderItemPayload[];
}

export async function createOrder(payload: CreateOrderPayload) {
  const response = await api.post("/orders", payload);
  return response.data;
}