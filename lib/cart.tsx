"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { formatPrice } from "./format";

// Referencia mínima al producto que el carrito necesita guardar.
// Pasamos esto al agregar y queda persistido en localStorage como snapshot.
export type CartProductRef = {
  slug: string;
  name: string;
  price: number;
  image?: string;
};

type CartItem = CartProductRef & { size?: string; qty: number };

export type CartLine = CartItem & { id: string; lineTotal: number };

type CartContextValue = {
  items: CartItem[];
  lines: CartLine[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (product: CartProductRef, opts?: { size?: string; qty?: number }) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "pantera_cart";

// Identidad de línea: una misma prenda en distintos talles son líneas distintas.
const lineId = (slug: string, size?: string) => `${slug}__${size ?? ""}`;

// Un item válido tiene los campos del snapshot completos.
function isValidItem(it: unknown): it is CartItem {
  if (!it || typeof it !== "object") return false;
  const r = it as Record<string, unknown>;
  return (
    typeof r.slug === "string" &&
    typeof r.name === "string" &&
    typeof r.price === "number" &&
    typeof r.qty === "number" &&
    r.qty > 0
  );
}

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
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setItems(parsed.filter(isValidItem));
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

  const add = useCallback(
    (product: CartProductRef, opts?: { size?: string; qty?: number }) => {
      const size = opts?.size;
      const qty = opts?.qty ?? 1;
      setItems((prev) => {
        const idx = prev.findIndex(
          (it) => it.slug === product.slug && it.size === size,
        );
        if (idx >= 0) {
          // Si el producto ya estaba, sumamos cantidad y refrescamos el
          // snapshot por si el precio/imagen cambiaron desde la última vez.
          const next = prev.slice();
          next[idx] = {
            ...next[idx]!,
            ...product,
            size,
            qty: next[idx]!.qty + qty,
          };
          return next;
        }
        return [...prev, { ...product, size, qty }];
      });
      setOpen(true);
    },
    [],
  );

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => lineId(it.slug, it.size) !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((it) => lineId(it.slug, it.size) !== id)
        : prev.map((it) =>
            lineId(it.slug, it.size) === id ? { ...it, qty } : it,
          ),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const lines = useMemo<CartLine[]>(
    () =>
      items.map((it) => ({
        ...it,
        id: lineId(it.slug, it.size),
        lineTotal: it.price * it.qty,
      })),
    [items],
  );

  const count = useMemo(() => items.reduce((n, it) => n + it.qty, 0), [items]);
  const total = useMemo(
    () => lines.reduce((sum, l) => sum + l.lineTotal, 0),
    [lines],
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
    [items, lines, count, total, open, add, remove, setQty, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}

// Arma el mensaje pre-cargado para WhatsApp con cada línea del carrito,
// talle, cantidad, subtotal y total. Nombre / zona son opcionales y
// aparecen como cabecera si vienen.
export function buildWhatsappMessage(
  lines: CartLine[],
  total: number,
  customer?: { name?: string; zone?: string },
): string {
  const name = customer?.name?.trim();
  const zone = customer?.zone?.trim();

  const header = ["Hola Pantera, me interesa coordinar este pedido."];
  if (name || zone) {
    const meta = [name && `Soy ${name}`, zone && `desde ${zone}`]
      .filter(Boolean)
      .join(" ");
    if (meta) header.push(meta + ".");
  }

  const items = lines.map((l) => {
    const size = l.size ? ` · Talle ${l.size}` : "";
    const qty = l.qty > 1 ? ` × ${l.qty}` : "";
    return `· ${l.name}${size}${qty} — ${formatPrice(l.lineTotal)}`;
  });

  return [
    header.join(" "),
    "",
    ...items,
    "",
    `Total: ${formatPrice(total)}`,
  ].join("\n");
}
