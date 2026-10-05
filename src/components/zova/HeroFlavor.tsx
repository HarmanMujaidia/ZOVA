import { AnimatePresence, motion, useReducedMotion, type MotionValue } from "framer-motion";
import { useRef, type KeyboardEvent } from "react";
import { flavors, imageFallback, type Flavor } from "@/lib/media";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

function FlavorLine({ flavor }: { flavor: Flavor }) {
  return (
    <>
      <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 md:justify-start">
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: flavor.color, boxShadow: `0 0 10px ${flavor.color}` }} />
        <span className="font-display text-base font-semibold text-foreground">{flavor.name}</span>
        <span aria-hidden className="text-muted-foreground/50">/</span>
        <span className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: flavor.color }}>
          {flavor.tagline}
        </span>
      </p>
      <p className="mt-2 text-muted-foreground">{flavor.description}</p>
    </>
  );
}

/** Reserves the height of the longest flavor copy so the CTAs below never shift. */
export function HeroFlavorCopy({ flavor }: { flavor: Flavor }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto grid max-w-md md:mx-0" aria-live="polite">
      {flavors.map((f) => (
        <div key={f.id} aria-hidden className="invisible [grid-area:1/1]">
          <FlavorLine flavor={f} />
        </div>
      ))}
      <AnimatePresence initial={false}>
        <motion.div
          key={flavor.id}
          className="absolute inset-0"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: reduce ? 0.15 : 0.45, ease: EASE }}
        >
          <FlavorLine flavor={flavor} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function HeroFlavorGlow({ color, className, opacity }: { color: string; className: string; opacity: number }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={color}
        aria-hidden
        className={cn("pointer-events-none absolute", className)}
        style={{ background: `radial-gradient(circle, ${color}, transparent 65%)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0.2 : 0.9, ease: "easeInOut" }}
      />
    </AnimatePresence>
  );
}

export function HeroFlavorCan({ flavor, rotateX, rotateY }: { flavor: Flavor; rotateX: MotionValue<number>; rotateY: MotionValue<number> }) {
  const reduce = useReducedMotion();
  return (
    <motion.div style={{ rotateX, rotateY }} className="relative aspect-[3/5] w-44 sm:w-64 md:w-80">
      <AnimatePresence initial={false}>
        <motion.img
          key={flavor.id}
          src={flavor.can}
          onError={imageFallback}
          alt={`ZOVA ${flavor.name} can`}
          width={768}
          height={1280}
          fetchPriority={flavor.id === flavors[0]?.id ? "high" : "auto"}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04, y: -18 }}
          transition={{ duration: reduce ? 0.2 : 0.65, ease: EASE }}
          className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
        />
      </AnimatePresence>
    </motion.div>
  );
}

export function HeroFlavorSelector({ activeIndex, onSelect }: { activeIndex: number; onSelect: (index: number) => void }) {
  const reduce = useReducedMotion();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    const target = e.key === "Home" ? 0 : e.key === "End" ? flavors.length - 1 : step ? (activeIndex + step + flavors.length) % flavors.length : -1;
    if (target < 0) return;
    e.preventDefault();
    onSelect(target);
    buttons.current[target]?.focus();
  };

  return (
    <div role="radiogroup" aria-label="Choose a flavor" onKeyDown={onKeyDown} className="glass flex items-center gap-1 rounded-full p-1.5 md:flex-col">
      {flavors.map((f, idx) => {
        const active = idx === activeIndex;
        return (
          <button
            key={f.id}
            ref={(el) => { buttons.current[idx] = el; }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={f.name}
            title={f.name}
            tabIndex={active ? 0 : -1}
            onClick={() => onSelect(idx)}
            className={cn(
              "group relative grid h-11 w-11 touch-manipulation place-items-center rounded-full outline-none transition-[opacity,background-color] duration-300 focus-visible:ring-2 focus-visible:ring-ring",
              active ? "opacity-100" : "opacity-60 hover:bg-foreground/5 hover:opacity-100",
            )}
          >
            {active && (
              <motion.span
                layoutId="hero-flavor-ring"
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{
                  background: `color-mix(in oklab, ${f.color} 12%, transparent)`,
                  boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${f.color} 55%, transparent), 0 0 20px -6px ${f.color}`,
                }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {active && !reduce && (
              <motion.span
                aria-hidden
                className="absolute inset-1.5 rounded-full"
                style={{ boxShadow: `0 0 0 1px color-mix(in oklab, ${f.color} 60%, transparent)` }}
                initial={{ opacity: 0.6, scale: 0.8 }}
                animate={{ opacity: 0, scale: 1.25 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <span
              aria-hidden
              className={cn("relative h-3.5 w-3.5 rounded-full transition-transform duration-300", active ? "scale-125" : "group-hover:scale-125")}
              style={{ background: f.color, boxShadow: `0 0 ${active ? 14 : 8}px ${f.color}` }}
            />
          </button>
        );
      })}
    </div>
  );
}
