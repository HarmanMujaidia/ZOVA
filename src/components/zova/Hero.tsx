import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { media, flavors } from "@/lib/media";
import { Bubbles, MagneticButton } from "./primitives";
import { scrollToId } from "./chrome";
import { HeroFlavorCan, HeroFlavorCopy, HeroFlavorGlow, HeroFlavorSelector } from "./HeroFlavor";

export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [14, -14]), { stiffness: 120, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-18, 18]), { stiffness: 120, damping: 14 });
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 800], [0, 200]);
  const wordY = useTransform(scrollY, [0, 800], [0, -120]);

  const [flavorIndex, setFlavorIndex] = useState(0);
  const flavor = flavors[flavorIndex] ?? flavors[0]!;

  useEffect(() => {
    for (const f of flavors) {
      const img = new Image();
      img.src = f.can;
    }
  }, []);

  return (
    <section
      id="home"
      aria-label="ZOVA hero"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <video
          className="h-full w-full object-cover opacity-50"
          src={media.heroVideo}
          poster={media.heroPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
        <HeroFlavorGlow color={flavor.color} opacity={0.14} className="left-1/2 top-1/3 h-[90vmax] w-[90vmax] -translate-x-1/2 -translate-y-1/2 md:left-3/4" />
      </motion.div>
      <Bubbles count={24} />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-8 px-6 pb-28 pt-24 md:grid-cols-2">
        <motion.div style={{ y: wordY }} className="text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            className="mb-4 inline-block rounded-full glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-accent"
          >
            Next-gen refreshment
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-neon text-glow text-[22vw] font-black leading-none md:text-[11rem]"
          >
            ZOVA
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }} className="mt-4 font-display text-xl font-semibold sm:text-2xl">
            Chill. Charged. ZOVA.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="mt-4">
            <HeroFlavorCopy flavor={flavor} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.1 }} className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
            <MagneticButton onClick={() => scrollToId("flavors")}>Explore Flavors</MagneticButton>
            <MagneticButton variant="glass" onClick={() => scrollToId("order")}>Order Now</MagneticButton>
          </motion.div>
        </motion.div>

        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-6 lg:gap-10">
          <div className="relative flex justify-center" style={{ perspective: 1000 }}>
            <HeroFlavorGlow color={flavor.color} opacity={0.55} className="inset-10 rounded-full blur-3xl" />
            <div className="animate-float relative">
              <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 1 }}>
                <HeroFlavorCan flavor={flavor} rotateX={rx} rotateY={ry} />
              </motion.div>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}>
            <HeroFlavorSelector activeIndex={flavorIndex} onSelect={setFlavorIndex} />
          </motion.div>
        </div>
      </div>

      <button onClick={() => scrollToId("flavors")} aria-label="Scroll to flavors" className="absolute bottom-28 left-1/2 z-10 hidden -translate-x-1/2 text-muted-foreground md:block">
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </button>
    </section>
  );
}
