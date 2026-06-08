import type { CartLine } from "./cart";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "cancelled";

export type Customer = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  zone?: string;
};

export type Order = {
  lines: CartLine[];
  total: number;
  customer: Customer;
  status: OrderStatus;
  createdAt: string;
};

export function linesToOrder(
  lines: CartLine[],
  customer: Customer,
  total: number
): Order {
  return {
    lines,
    total,
    customer,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}
