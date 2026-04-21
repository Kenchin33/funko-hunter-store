import { useCallback, useState } from "react";
import { ToastContext, type ToastVariant } from "./ToastContext";

type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = "default") => {
    const id = Date.now() + Math.random();

    setToasts((prev) => {
      const alreadyExists = prev.some(
        (toast) => toast.message === message && toast.variant === variant
      );

      if (alreadyExists) {
        return prev;
      }

      return [...prev, { id, message, variant }];
    });

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast ${toast.variant === "error" ? "toast-error" : "toast-default"}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}