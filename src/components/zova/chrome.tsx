import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Home, Sparkles, BookOpen, Images, ShoppingBag, Mail, Volume2, VolumeX } from "lucide-react";
import { useCart } from "@/lib/cart";
import { fizz, setSound } from "@/lib/sound";
import { cn } from "@/lib/utils";

export const NAV = [
  { id: "home", label: "Home", icon: Home },
  { id: "flavors", label: "Flavors", icon: Sparkles },
  { id: "story", label: "Story", icon: BookOpen },
  { id: "gallery", label: "Gallery", icon: Images },
  { id: "order", label: "Order", icon: ShoppingBag },
  { id: "contact", label: "Contact", icon: Mail },
] as const;

export function Loader() {
  const [done, setDone] = useState(false);
  const reducedMotion = useReducedMotion();
  useEffect(() => { const t = setTimeout(() => setDone(true), reducedMotion ? 0 : 1600); return () => clearTimeout(t); }, [reducedMotion]);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.6 }}
          role="status"
          aria-label="Loading ZOVA"
        >
          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, letterSpacing: "0.6em" }}
              animate={{ opacity: 1, letterSpacing: "0.15em" }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="text-neon text-6xl font-black sm:text-8xl"
            >
              ZOVA
            </motion.h1>
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute bottom-0 rounded-full border border-primary/60"
                style={{ left: `${8 + i * 7.5}%`, width: 4 + (i % 4) * 3, height: 4 + (i % 4) * 3 }}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: -120 - (i % 5) * 20, opacity: [0, 1, 0] }}
                transition={{ duration: 1.4, delay: i * 0.08, repeat: Infinity }}
              />
            ))}
          </div>
          <div className="mt-8 h-0.5 w-40 overflow-hidden rounded-full bg-muted">
            <motion.div className="bg-neon h-full" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.4 }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Cursor() {
  const x = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40 });
  const y = useSpring(useMotionValue(-100), { stiffness: 500, damping: 40 });
  const [grow, setGrow] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || reducedMotion) return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      const t = e.target;
      setGrow(t instanceof Element && !!t.closest("button, a, [data-cursor='grow']"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y, reducedMotion]);
  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] rounded-full border border-primary mix-blend-screen"
      style={{ x, y, translateX: "-50%", translateY: "-50%", boxShadow: "0 0 24px var(--flavor)" }}
      animate={{ width: grow ? 56 : 18, height: grow ? 56 : 18 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    />
  );
}

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function TopBar() {
  const { count, setOpen } = useCart();
  const [sound, setS] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 hidden md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button onClick={() => scrollToId("home")} className="text-neon font-display text-2xl font-black tracking-widest" aria-label="ZOVA home">
          ZOVA
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { const v = !sound; setS(v); setSound(v); if (v) fizz(); }}
            className="glass flex h-10 w-10 items-center justify-center rounded-full"
            aria-label={sound ? "Mute sound effects" : "Enable sound effects"}
            aria-pressed={sound}
          >
            {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
          </button>
          <button onClick={() => setOpen(true)} className="glass relative flex h-10 items-center gap-2 rounded-full px-4 text-sm" aria-label={`Open cart, ${count} items`}>
            <ShoppingBag className="h-4 w-4" />
            {count > 0 && <span className="bg-neon rounded-full px-2 text-xs font-bold text-primary-foreground">{count}</span>}
          </button>
          <button onClick={() => scrollToId("order")} className="bg-neon glow rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Buy Now
          </button>
        </div>
      </div>
    </header>
  );
}

function DockItem({ item, mouseX, active, onSelect }: { item: (typeof NAV)[number]; mouseX: MotionValue<number>; active: boolean; onSelect: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<number[]>([]);
  const dist = useTransform(mouseX, (v) => {
    const b = ref.current?.getBoundingClientRect();
    return b ? v - b.x - b.width / 2 : 999;
  });
  const scale = useSpring(useTransform(dist, [-140, 0, 140], [1, 1.45, 1]), { stiffness: 260, damping: 18 });
  const Icon = item.icon;
  const sectionColor = `var(--section-${item.id})`;
  return (
    <motion.button
      ref={ref}
      style={{ scale }}
      onClick={() => { setRipples((r) => [...r, Date.now()]); onSelect(); }}
      aria-label={item.label}
       aria-current={active ? "location" : undefined}
      className={cn(
        "relative flex origin-bottom flex-col items-center justify-center overflow-hidden rounded-2xl px-2.5 py-2 transition-colors sm:px-3.5",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {active && (
         <motion.span layoutId="dock-active" className="absolute inset-0 rounded-2xl bg-glass" style={{ boxShadow: `inset 0 0 0 1px ${sectionColor}, 0 0 24px -4px ${sectionColor}` }} />
      )}
      {ripples.map((r) => (
        <span key={r} onAnimationEnd={() => setRipples((x) => x.filter((y) => y !== r))} className="animate-ripple absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "var(--flavor)" }} />
      ))}
       <Icon className="relative h-6 w-6 sm:h-5 sm:w-5" style={active ? { color: sectionColor, filter: `drop-shadow(0 0 6px ${sectionColor})` } : undefined} />
      <span className="relative mt-1 text-[10px] font-medium">{item.label}</span>
    </motion.button>
  );
}

export function Dock() {
  const mouseX = useMotionValue(Infinity);
  const [active, setActive] = useState("home");
  const [hidden, setHidden] = useState(false);
  const { count, setOpen } = useCart();

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const updateActive = () => {
      const marker = window.innerHeight * 0.45;
      let current = NAV[0].id;
      for (const item of NAV) {
        const section = document.getElementById(item.id);
        if (section && section.getBoundingClientRect().top <= marker) current = item.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 300);
      last = y;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActive);
    };
    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", updateActive); cancelAnimationFrame(frame); };
  }, []);

  return (
    <motion.nav
      aria-label="Section navigation"
      animate={{ y: hidden ? 70 : 0, opacity: hidden ? 0.4 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="fixed inset-x-0 bottom-3 z-50 flex justify-center px-2"
      onMouseEnter={() => setHidden(false)}
    >
      <div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="glass gradient-border flex items-end gap-0.5 rounded-3xl px-2 py-1.5 shadow-2xl sm:gap-1"
      >
        {NAV.map((n) => (
          <DockItem key={n.id} item={n} mouseX={mouseX} active={active === n.id} onSelect={() => { fizz(); scrollToId(n.id); }} />
        ))}
        <button onClick={() => setOpen(true)} className="relative ml-1 flex h-12 w-12 items-center justify-center rounded-2xl md:hidden" aria-label={`Open cart, ${count} items`}>
          <ShoppingBag className="h-6 w-6" />
          {count > 0 && <span className="bg-neon absolute right-1 top-1 rounded-full px-1.5 text-[10px] font-bold text-primary-foreground">{count}</span>}
        </button>
      </div>
    </motion.nav>
  );
}
