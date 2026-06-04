"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProduct } from "./products";

type CartItem = { slug: string; qty: number };

export type CartLine = {
  slug: string;
  qty: number;
  name: string;
  price: number;
  image?: string;
  lineTotal: number;
};

type CartContextValue = {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "pantera_cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hidratar desde localStorage una sola vez en el cliente.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          // Descartar slugs que ya no existen en el catálogo visible.
          setItems(parsed.filter((it) => it && getProduct(it.slug) && it.qty > 0));
        }
      }
    } catch {
      /* localStorage no disponible o JSON inválido: arrancamos vacíos */
    }
    setHydrated(true);
  }, []);

  // Persistir cada cambio (después de hidratar para no pisar el storage).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* sin persistencia disponible */
    }
  }, [items, hydrated]);

  const add = useCallback((slug: string, qty = 1) => {
    if (!getProduct(slug)) return;
    setItems((prev) => {
      const found = prev.find((it) => it.slug === slug);
      if (found) {
        return prev.map((it) =>
          it.slug === slug ? { ...it, qty: it.qty + qty } : it
        );
      }
      return [...prev, { slug, qty }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((it) => it.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((it) => it.slug !== slug)
        : prev.map((it) => (it.slug === slug ? { ...it, qty } : it))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const lines = useMemo<CartLine[]>(() => {
    return items.flatMap((it) => {
      const product = getProduct(it.slug);
      if (!product) return [];
      return [
        {
          slug: it.slug,
          qty: it.qty,
          name: product.name,
          price: product.price,
          image: product.image,
          lineTotal: product.price * it.qty,
        },
      ];
    });
  }, [items]);

  const count = useMemo(() => items.reduce((n, it) => n + it.qty, 0), [items]);
  const total = useMemo(
    () => lines.reduce((sum, l) => sum + l.lineTotal, 0),
    [lines]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      lines,
      count,
      total,
      open,
      setOpen,
      add,
      remove,
      setQty,
      clear,
    }),
    [items, lines, count, total, open, add, remove, setQty, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
