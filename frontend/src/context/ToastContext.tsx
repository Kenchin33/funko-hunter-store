import { createContext } from "react";

export type ToastVariant = "default" | "error";

export type ToastContextType = {
  showToast: (message: string, variant?: ToastVariant) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);