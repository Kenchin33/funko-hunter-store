import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export async function registerUser(payload: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}) {
  const response = await api.post<AuthResponse>("/auth/register", payload);
  return response.data;
}

export async function loginUser(payload: {
  email: string;
  password: string;
}) {
  const response = await api.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function getMe(token: string) {
  const response = await api.get<AuthUser>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}