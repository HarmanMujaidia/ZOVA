import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Minus, Plus, Trash2, X, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { flavors, imageFallback } from "@/lib/media";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { MagneticButton, Reveal, SectionTitle } from "./primitives";

function Qty({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="glass flex items-center rounded-full" role="group" aria-label={`Quantity for ${label}`}>
      <button onClick={() => onChange(value - 1)} className="p-2" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
      <span className="w-8 text-center font-semibold" aria-live="polite">{value}</span>
      <button onClick={() => onChange(value + 1)} className="p-2" aria-label="Increase"><Plus className="h-4 w-4" /></button>
    </div>
  );
}

export function Order() {
  const { add } = useCart();
  const [qty, setQty] = useState<Record<string, number>>(() => Object.fromEntries(flavors.map((f) => [f.id, 1])));
  return (
    <section id="order" className="py-28" aria-label="Order ZOVA">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle eyebrow="Shop" title={<>Stock the <span className="text-neon">fridge</span></>} sub="Single cans, shipped ice-cold. Mix and match your lineup." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {flavors.map((f, i) => (
            <Reveal key={f.id} delay={i * 0.08}>
              <article className="glass group flex h-full flex-col items-center rounded-3xl p-6 text-center transition-shadow hover:shadow-[0_0_50px_-12px_var(--c)]" style={{ ["--c" as string]: f.color }}>
                <div className="relative mb-4 flex h-48 items-center justify-center">
                  <div aria-hidden className="absolute h-32 w-32 rounded-full blur-2xl" style={{ background: f.color, opacity: 0.4 }} />
                  <img src={f.can} alt={`ZOVA ${f.name} can`} onError={imageFallback} loading="lazy" width={768} height={1280} className="relative h-48 w-auto transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" />
                </div>
                <h3 className="text-lg font-bold">{f.name}</h3>
                <p className="mt-1 font-display text-2xl font-bold" style={{ color: f.color }}>${f.price.toFixed(2)}</p>
                <div className="mt-4 flex flex-col items-center gap-3">
                  <Qty value={qty[f.id] ?? 1} label={f.name} onChange={(n) => setQty((q) => ({ ...q, [f.id]: Math.max(1, Math.min(99, n)) }))} />
                  <button
                    onClick={() => { add(f.id, qty[f.id] ?? 1); toast.success(`${qty[f.id]} × ${f.name} added`); }}
                    className="bg-neon rounded-full px-5 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const checkoutSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().regex(/^[+\d\s()-]{5,30}$/, "Enter a valid phone number"),
  address: z.string().trim().min(5, "Address is too short").max(500),
});

export function CartDrawer() {
  const { lines, setQty, remove, total, open, setOpen, clear } = useCart();
  const [step, setStep] = useState<"cart" | "checkout">("cart");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = checkoutSchema.safeParse(fd);
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    setBusy(true);
    const { error } = await supabase.from("orders").insert({
      ...parsed.data,
      items: lines.map((l) => ({ id: l.id, name: l.flavor.name, qty: l.qty, price: l.flavor.price })),
      total: Number(total.toFixed(2)),
    });
    setBusy(false);
    if (error) { toast.error("Couldn't place order. Please try again."); return; }
    toast.success("Order placed! We'll be in touch soon.");
    clear(); setStep("cart"); setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[70] bg-background/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="glass fixed right-0 top-0 z-[75] flex h-full w-full max-w-md flex-col bg-card/90 p-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{step === "cart" ? "Your Cart" : "Checkout"}</h2>
              <button onClick={() => setOpen(false)} className="glass rounded-full p-2" aria-label="Close cart"><X className="h-5 w-5" /></button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center text-muted-foreground">
                <ShoppingBag className="mb-4 h-12 w-12" />
                <p>Your cart is empty.</p>
              </div>
            ) : step === "cart" ? (
              <>
                <ul className="flex-1 space-y-4 overflow-y-auto">
                  {lines.map((l) => (
                    <li key={l.id} className="glass flex items-center gap-4 rounded-2xl p-3">
                      <img src={l.flavor.can} alt={`ZOVA ${l.flavor.name} can`} onError={imageFallback} className="h-16 w-auto" />
                      <div className="flex-1">
                        <p className="font-semibold">{l.flavor.name}</p>
                        <p className="text-sm text-muted-foreground">${(l.flavor.price * l.qty).toFixed(2)}</p>
                      </div>
                      <Qty value={l.qty} label={l.flavor.name} onChange={(n) => setQty(l.id, n)} />
                      <button onClick={() => remove(l.id)} aria-label={`Remove ${l.flavor.name}`} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 border-t pt-6">
                  <div className="mb-4 flex justify-between text-lg"><span>Total</span><span className="font-display font-bold">${total.toFixed(2)}</span></div>
                  <MagneticButton className="w-full" onClick={() => setStep("checkout")}>Checkout</MagneticButton>
                </div>
              </>
            ) : (
              <form onSubmit={submit} className="flex flex-1 flex-col gap-4" noValidate>
                {(["name", "phone", "address"] as const).map((k) => (
                  <label key={k} className="block">
                    <span className="mb-1 block text-sm capitalize text-muted-foreground">{k}</span>
                    {k === "address" ? (
                      <textarea name={k} rows={3} maxLength={500} className="glass w-full rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
                    ) : (
                      <input name={k} type={k === "phone" ? "tel" : "text"} maxLength={k === "phone" ? 30 : 100} className="glass w-full rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
                    )}
                    {errors[k] && <span className="mt-1 block text-sm text-destructive">{errors[k]}</span>}
                  </label>
                ))}
                <div className="mt-auto border-t pt-6">
                  <div className="mb-4 flex justify-between text-lg"><span>Total</span><span className="font-display font-bold">${total.toFixed(2)}</span></div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep("cart")} className="glass rounded-full px-5 py-3 text-sm">Back</button>
                    <MagneticButton type="submit" disabled={busy} className="flex-1">{busy ? "Placing…" : "Place Order"}</MagneticButton>
                  </div>
                </div>
              </form>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
