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

export async function createOrder(payload: CreateOrderPayload, token: string) {
  const response = await api.post("/orders", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export interface OrderItemRead {
  id: number;
  product_id: number;
  product_name_snapshot: string;
  image_url_snapshot?: string | null;
  price_snapshot: string;
  quantity: number;
}

export interface OrderRead {
  id: number;
  order_number: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_city: string;
  delivery_branch: string;
  status: string;
  tracking_number: string | null;
  total_amount: string;
  created_at: string;
  items: OrderItemRead[];
}

export async function getMyOrders(token: string) {
  const response = await api.get<OrderRead[]>("/orders/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getMyOrderByNumber(orderNumber: string, token: string) {
  const response = await api.get<OrderRead>(`/orders/me/${orderNumber}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export interface TrackOrderPayload {
  order_number: string;
  email: string;
}

export async function trackOrder(payload: TrackOrderPayload) {
  const response = await api.post<OrderRead>("/orders/track", payload);
  return response.data;
}