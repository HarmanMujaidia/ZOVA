import { AnimatePresence, motion, type MotionStyle } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { flavors } from "@/lib/media";
import { useCart } from "@/lib/cart";
import { MagneticButton, SectionTitle } from "./primitives";
import { cn } from "@/lib/utils";

export function Flavors() {
  const [i, setI] = useState(0);
  const [direction, setDirection] = useState(1);
  const f = flavors[i] ?? flavors[0];
  const { add } = useCart();

  useEffect(() => {
    if (!f) return;
    document.documentElement.style.setProperty("--flavor", f.color);
  }, [f]);

  const go = (d: number) => { setDirection(d); setI((x) => (x + d + flavors.length) % flavors.length); };
  const select = (idx: number) => { if (idx !== i) { setDirection(idx > i ? 1 : -1); setI(idx); } };

  if (!f) return null;

  return (
    <section id="flavors" className="relative overflow-hidden bg-background py-28" aria-label="Flavors">
      <AnimatePresence initial={false}>
        <motion.div key={f.id} aria-hidden className="flavor-bg pointer-events-none absolute inset-0" style={{ "--flavor": f.color } as MotionStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} />
      </AnimatePresence>
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionTitle eyebrow="The lineup" title={<>Pick your <span className="text-neon">charge</span></>} sub="Five flavors. Zero compromise. Tap one to feel the shift." />

        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr_1fr]">
          <div className="order-2 lg:order-1">
             <AnimatePresence mode="wait" initial={false}>
               <motion.div key={f.id} initial={{ opacity: 0, x: direction * 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: direction * -30 }} transition={{ duration: 0.4 }}>
                <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: f.color }}>{f.tagline}</p>
                <h3 className="mt-2 text-4xl font-bold sm:text-5xl">{f.name}</h3>
                <p className="mt-4 text-muted-foreground">{f.description}</p>
                <p className="mt-6 font-display text-3xl font-bold">${f.price.toFixed(2)}</p>
                <MagneticButton className="mt-6" onClick={() => { add(f.id); toast.success(`${f.name} added to cart`); }}>
                  <Plus className="h-4 w-4" /> Add to Cart
                </MagneticButton>
              </motion.div>
            </AnimatePresence>
          </div>

           <div className="relative order-1 flex h-80 items-center justify-center sm:h-[26rem] lg:order-2 lg:h-[32rem]">
            <button onClick={() => go(-1)} aria-label="Previous flavor" className="glass absolute left-0 z-10 rounded-full p-3"><ChevronLeft className="h-5 w-5" /></button>
             <AnimatePresence initial={false}>
               <motion.div key={f.id} aria-hidden className="absolute h-72 w-72 rounded-full blur-3xl sm:h-96 sm:w-96" style={{ background: f.color }} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 0.45, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }} transition={{ duration: 0.65 }} />
             </AnimatePresence>
             <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={f.id}
                src={f.can}
                alt={`ZOVA ${f.name} can`}
                width={768}
                height={1280}
                loading="lazy"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => { if (info.offset.x < -60) go(1); else if (info.offset.x > 60) go(-1); }}
                 initial={{ opacity: 0, rotate: -15 * direction, x: 45 * direction, y: 30, scale: 0.85 }}
                animate={{ opacity: 1, rotate: 0, y: 0, scale: 1 }}
                 exit={{ opacity: 0, rotate: 15 * direction, x: -45 * direction, y: -30, scale: 0.85 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                 className="absolute w-48 cursor-grab touch-pan-y drop-shadow-2xl active:cursor-grabbing sm:w-64"
              />
            </AnimatePresence>
            <button onClick={() => go(1)} aria-label="Next flavor" className="glass absolute right-0 z-10 rounded-full p-3"><ChevronRight className="h-5 w-5" /></button>
          </div>

          <ul className="order-3 flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible" role="tablist" aria-label="Choose a flavor">
            {flavors.map((fl, idx) => (
              <li key={fl.id} className="shrink-0">
                <button
                  role="tab"
                  aria-selected={idx === i}
                   onClick={() => select(idx)}
                  className={cn("glass flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all", idx === i ? "scale-[1.03]" : "opacity-60 hover:opacity-100")}
                  style={idx === i ? { boxShadow: `0 0 30px -8px ${fl.color}`, borderColor: fl.color } : undefined}
                >
                  <span className="h-4 w-4 rounded-full" style={{ background: fl.color, boxShadow: `0 0 12px ${fl.color}` }} />
                  <span className="whitespace-nowrap font-display text-sm font-semibold">{fl.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
