import axios from "axios";
import type { OrderRead } from "./orderApi";
import type { Product } from "../types/product";

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

export async function updateAdminOrderStatus(
  orderNumber: string,
  status: "new" | "shipped" | "resolved" | "rejected",
  token: string,
  trackingNumber?: string
) {
  const response = await api.patch<OrderRead>(
    `/admin/orders/${orderNumber}/status`,
    { 
      status,
      tracking_number: trackingNumber ?? null, 
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export interface AdminProductImageCreate {
  image_url: string;
  sort_order: number;
}

export interface AdminProductVariantCreate {
  slug: string;
  variant_name: string;
  price: number;
  compare_at_price?: number | null;
  availability_status: string;
  delivery_eta?: string | null;
  stock_quantity: number;
  is_box_damaged: boolean;
  is_active: boolean;
}

export interface AdminProductCreatePayload {
  name: string;
  slug: string;
  series: string;
  product_number: string;
  category: string;
  subcategory?: string | null;
  short_description?: string | null;
  rarity: string;
  is_new: boolean;
  is_active: boolean;
  images: AdminProductImageCreate[];
  aliases: AdminProductAliasCreate[];
  variants: AdminProductVariantCreate[];
}

export interface AdminProductAliasCreate {
  alias: string;
}

export async function getAdminProducts(token: string) {
  const response = await api.get<Product[]>("/admin/products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function createAdminProduct(
  payload: AdminProductCreatePayload,
  token: string
) {
  const response = await api.post<Product>("/admin/products", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getAdminProductById(productId: number, token: string) {
  const response = await api.get<Product>(`/admin/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateAdminProduct(
  productId: number,
  payload: AdminProductCreatePayload,
  token: string
) {
  const response = await api.put<Product>(`/admin/products/${productId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function deleteAdminProduct(productId: number, token: string) {
  await api.delete(`/admin/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export interface AdminComplaintPhoto {
  id: number;
  image_url: string;
}

export interface AdminComplaint {
  id: number;
  complaint_number: string;
  email: string | null;
  order_number: string | null;
  topic: string;
  message: string;
  status: string;
  source: string;
  is_resolved: boolean;
  created_at: string;
  updated_at: string;
  photos: AdminComplaintPhoto[];
}

export async function getAdminComplaints(token: string) {
  const response = await api.get<AdminComplaint[]>("/admin/complaints", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function updateAdminComplaintStatus(
  complaintId: number,
  status: "new" | "in_progress" | "resolved" | "rejected",
  token: string
) {
  const response = await api.patch<AdminComplaint>(
    `/admin/complaints/${complaintId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

export async function getAdminComplaintById(complaintId: number, token: string) {
  const response = await api.get<AdminComplaint>(
    `/admin/complaints/${complaintId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}