"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Context,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  variantId: string;
  productSlug: string;
  productName: string;
  variantSku: string;
  keySpec: string | null;
  /** Unit price snapshot at add time (BDT). */
  price: number;
  /** Available stock when last added/updated — caps quantity steppers. */
  stock: number;
  quantity: number;
  image?: string | null;
};

export type AddToCartInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  /** Line-item total (BDT). Derived from items — not stored separately. */
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  add: (input: AddToCartInput) => { ok: true } | { ok: false; reason: string };
  remove: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
};

/**
 * Pin context identity on globalThis so Turbopack/HMR (or split client
 * chunks) cannot create a second CartContext — which would make useCart
 * throw even when a CartProvider is mounted.
 */
const globalForCart = globalThis as typeof globalThis & {
  __futureEnergyCartContext__?: Context<CartContextValue | null>;
};

const CartContext =
  globalForCart.__futureEnergyCartContext__ ??
  createContext<CartContextValue | null>(null);

globalForCart.__futureEnergyCartContext__ = CartContext;

export function CartProvider({ children }: { children: ReactNode }) {
  // TODO: persist cart to localStorage (or similar) so items survive refresh —
  // intentionally memory-only for now until checkout/auth edge cases are decided.
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((open) => !open), []);

  const add = useCallback((input: AddToCartInput) => {
    if (input.stock <= 0) {
      return { ok: false as const, reason: "This variant is out of stock." };
    }

    const addQty = Math.max(1, input.quantity ?? 1);

    setItems((prev) => {
      const existing = prev.find((item) => item.variantId === input.variantId);
      if (existing) {
        const nextQty = Math.min(existing.quantity + addQty, input.stock);
        if (nextQty === existing.quantity) return prev;
        return prev.map((item) =>
          item.variantId === input.variantId
            ? {
                ...item,
                quantity: nextQty,
                stock: input.stock,
                price: input.price,
                image: input.image ?? item.image,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          productId: input.productId,
          variantId: input.variantId,
          productSlug: input.productSlug,
          productName: input.productName,
          variantSku: input.variantSku,
          keySpec: input.keySpec,
          price: input.price,
          stock: input.stock,
          quantity: Math.min(addQty, input.stock),
          image: input.image,
        },
      ];
    });

    setIsOpen(true);
    return { ok: true as const };
  }, []);

  const remove = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((item) => item.variantId !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.variantId !== variantId);
      }
      return prev.map((item) => {
        if (item.variantId !== variantId) return item;
        return {
          ...item,
          quantity: Math.min(quantity, item.stock),
        };
      });
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      total,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      add,
      remove,
      updateQuantity,
      clear,
    }),
    [
      items,
      itemCount,
      total,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      add,
      remove,
      updateQuantity,
      clear,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
