import { createContext, useContext, useState, type ReactNode } from "react";
import { flavors, type Flavor } from "./media";

type CartLine = { id: string; qty: number };
type CartCtx = {
  lines: (CartLine & { flavor: Flavor })[];
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: number;
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const lines = raw.map((l) => ({ ...l, flavor: flavors.find((f) => f.id === l.id)! }));
  const add = (id: string, qty = 1) =>
    setRaw((r) => (r.some((l) => l.id === id) ? r.map((l) => (l.id === id ? { ...l, qty: Math.min(99, l.qty + qty) } : l)) : [...r, { id, qty }]));
  const setQty = (id: string, qty: number) =>
    setRaw((r) => (qty <= 0 ? r.filter((l) => l.id !== id) : r.map((l) => (l.id === id ? { ...l, qty: Math.min(99, qty) } : l))));
  const remove = (id: string) => setRaw((r) => r.filter((l) => l.id !== id));
  const total = lines.reduce((s, l) => s + l.qty * l.flavor.price, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  return (
    <Ctx.Provider value={{ lines, add, setQty, remove, clear: () => setRaw([]), total, count, open, setOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
