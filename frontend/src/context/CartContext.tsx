import { createContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getCartFromStorage, saveCartToStorage } from "../utils/cartStorage";
import type { CartItem } from "../types/cart";

interface AddToCartPayload {
  variantId: number;
  variantSlug: string;
  productId: number;
  productName: string;
  variantName: string;
  imageUrl: string | null;
  price: number;
  compareAtPrice: number | null;
  availabilityStatus: string;
  isBoxDamaged: boolean;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (item: AddToCartPayload) => void;
  removeFromCart: (variantId: number) => void;
  increaseQuantity: (variantId: number) => void;
  decreaseQuantity: (variantId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => getCartFromStorage());

  const addToCart = (payload: AddToCartPayload) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.variantId === payload.variantId);

      const next =
        existing
          ? prev.map((item) =>
              item.variantId === payload.variantId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [
              ...prev,
              {
                ...payload,
                quantity: 1,
              },
            ];

      saveCartToStorage(next);
      return next;
    });
  };

  const removeFromCart = (variantId: number) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.variantId !== variantId);
      saveCartToStorage(next);
      return next;
    });
  };

  const increaseQuantity = (variantId: number) => {
    setItems((prev) => {
      const next = prev.map((item) =>
        item.variantId === variantId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveCartToStorage(next);
      return next;
    });
  };

  const decreaseQuantity = (variantId: number) => {
    setItems((prev) => {
      const next = prev
        .map((item) =>
          item.variantId === variantId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);

      saveCartToStorage(next);
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    saveCartToStorage([]);
  };

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const value: CartContextValue = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext };