import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Snowflake, Citrus, ShieldCheck, Droplets, Apple, FlaskConical, Zap, Package } from "lucide-react";
import { media } from "@/lib/media";
import { Reveal, SectionTitle } from "./primitives";

const panels = [
  { icon: Snowflake, title: "Ice-Cold Crisp", text: "Cryo-carbonated at -2°C for micro-bubbles that bite harder and last longer." },
  { icon: Citrus, title: "Real Fruit Energy", text: "Cold-pressed fruit and natural caffeine from green tea. No crash, just glow." },
  { icon: ShieldCheck, title: "Zero Compromise", text: "No artificial colors, no fake sweeteners, no junk. Only what belongs." },
];

const stats = [
  { value: 100, suffix: "%", label: "Natural flavors" },
  { value: 0, suffix: "", label: "Artificial colors" },
  { value: 12, suffix: "", label: "Countries" },
  { value: 35, suffix: "kcal", label: "Per can" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

export function Experience() {
  return (
    <section id="story" className="relative overflow-hidden py-28" aria-label="The ZOVA experience">
      <video className="absolute inset-0 h-full w-full object-cover opacity-20" src={media.experienceVideo} poster={media.heroPoster} autoPlay muted loop playsInline preload="none" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionTitle eyebrow="The experience" title={<>Built for the <span className="text-neon">first sip</span></>} />
        <div className="grid gap-6 md:grid-cols-3">
          {panels.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.15}>
              <motion.article whileHover={{ y: -8 }} className="glass gradient-border h-full rounded-3xl p-8">
                <div className="bg-neon mb-6 inline-flex rounded-2xl p-3 text-primary-foreground"><p.icon className="h-6 w-6" /></div>
                <h3 className="text-2xl font-bold">{p.title}</h3>
                <p className="mt-3 text-muted-foreground">{p.text}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="text-center">
              <p className="text-neon font-display text-5xl font-black sm:text-6xl"><Counter to={s.value} suffix={s.suffix} /></p>
              <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  { icon: Droplets, title: "Glacier water", text: "Triple-filtered mineral water, chilled to near-freezing." },
  { icon: Apple, title: "Real fruit", text: "Cold-pressed fruit and botanicals, sourced ripe." },
  { icon: FlaskConical, title: "Clean charge", text: "Natural caffeine, B-vitamins and electrolytes." },
  { icon: Zap, title: "Cryo-fizz", text: "Carbonated cold for a sharper, longer sparkle." },
  { icon: Package, title: "Sealed fresh", text: "Infinitely recyclable aluminum. Locked in cold." },
];

export function Process() {
  return (
    <section aria-label="How ZOVA is made" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle eyebrow="How it's made" title="From glacier to can" />
        <div className="relative">
          <div aria-hidden className="bg-neon absolute left-6 top-0 h-full w-px opacity-40 md:left-0 md:top-10 md:h-px md:w-full" />
          <ol className="grid gap-8 md:grid-cols-5">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.12}>
                <li className="relative flex gap-5 md:flex-col md:gap-4">
                  <div className="glass relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full md:h-20 md:w-20" style={{ boxShadow: "0 0 30px -10px var(--flavor)" }}>
                    <s.icon className="h-5 w-5 text-primary md:h-7 md:w-7" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-accent">STEP 0{i + 1}</p>
                    <h3 className="mt-1 text-lg font-bold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
