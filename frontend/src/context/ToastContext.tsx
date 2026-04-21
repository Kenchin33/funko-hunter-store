import { createContext } from "react";

export type ToastContextType = {
  showToast: (message: string) => void;
};

export const ToastContext = createContext<ToastContextType | null>(null);