import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useRef, type ReactNode, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { fizz } from "@/lib/sound";

export function Reveal({ children, delay = 0, className, y = 40 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub?: string }) {
  return (
    <Reveal className="mx-auto mb-14 max-w-2xl text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary">{eyebrow}</p>
      <h2 className="text-4xl font-bold sm:text-5xl md:text-6xl">{title}</h2>
      {sub && <p className="mt-4 text-muted-foreground">{sub}</p>}
    </Reveal>
  );
}

type Variant = "neon" | "glass";
export function MagneticButton({ children, variant = "neon", className, onClick, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - r.left - r.width / 2) * 0.3);
        y.set((e.clientY - r.top - r.height / 2) * 0.3);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={(e) => { fizz(); onClick?.(e); }}
      data-cursor="grow"
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
        variant === "neon" && "bg-neon text-primary-foreground glow hover:shadow-[0_0_60px_-4px_var(--flavor)]",
        variant === "glass" && "glass text-foreground hover:bg-glass-border",
        className,
      )}
      {...(rest as object)}
    >
      {children}
    </motion.button>
  );
}

export function Bubbles({ count = 18 }: { count?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const size = 4 + ((i * 37) % 18);
        return (
          <span
            key={i}
            className="animate-rise absolute bottom-[-40px] rounded-full border border-white/30 bg-white/5"
            style={{
              left: `${(i * 53) % 100}%`,
              width: size,
              height: size,
              animationDuration: `${8 + ((i * 7) % 10)}s`,
              animationDelay: `${(i * 1.3) % 8}s`,
            }}
          />
        );
      })}
    </div>
  );
}
