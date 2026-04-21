import axios from "axios";
import type { OrderRead } from "./orderApi";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export async function getAdminOrders(token: string) {
  const response = await api.get<OrderRead[]>("/admin/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getAdminOrderByNumber(orderNumber: string, token: string) {
  const response = await api.get<OrderRead>(`/admin/orders/${orderNumber}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}