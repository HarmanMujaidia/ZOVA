import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X, Star, Play } from "lucide-react";
import { gallery, media } from "@/lib/media";
import { Reveal, SectionTitle } from "./primitives";
import { cn } from "@/lib/utils";

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  const item = open !== null ? gallery[open] : null;

  return (
    <section id="gallery" className="py-28" aria-label="Gallery">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle eyebrow="#ZOVAnights" title={<>Wherever you <span className="text-neon">glow</span></>} />
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {gallery.map((g, i) => (
            <Reveal key={i} delay={(i % 3) * 0.1}>
              {g.src === "video" ? (
                <div className="group relative overflow-hidden rounded-3xl glass">
                  <video
                    className="aspect-square w-full object-cover"
                    src={media.galleryVideo}
                    poster={media.heroPoster}
                    muted
                    loop
                    playsInline
                    preload="none"
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                    onTouchStart={(e) => e.currentTarget.play().catch(() => {})}
                    aria-label={g.alt}
                  />
                  <span className="glass pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-opacity group-hover:opacity-0"><Play className="h-3 w-3" /> Hover to play</span>
                </div>
              ) : (
                <button onClick={() => setOpen(i)} className="group block w-full overflow-hidden rounded-3xl" aria-label={`Open image: ${g.alt}`}>
                  <img src={g.src} alt={g.alt} loading="lazy" className={cn("w-full object-cover transition-transform duration-700 group-hover:scale-110", g.tall ? "aspect-[3/4]" : "aspect-[4/3]")} />
                </button>
              )}
            </Reveal>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {item && (
          <motion.div role="dialog" aria-modal="true" aria-label={item.alt} className="fixed inset-0 z-[80] flex items-center justify-center bg-background/90 p-4 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.img src={item.src} alt={item.alt} initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="max-h-[85vh] max-w-full rounded-3xl" />
            <button onClick={() => setOpen(null)} className="glass absolute right-6 top-6 rounded-full p-3" aria-label="Close"><X className="h-5 w-5" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

const reviews = [
  { name: "Aarav S.", city: "Mumbai", text: "Neon Berry got me through finals week. Tastes like a rave in a can.", stars: 5 },
  { name: "Mia K.", city: "Berlin", text: "Arctic Mint is unreal. Colder than cold. I keep a crate in the studio.", stars: 5 },
  { name: "Jordan T.", city: "Los Angeles", text: "Finally an energy drink without the weird aftertaste. Solar Lemon all day.", stars: 5 },
  { name: "Lena P.", city: "Dubai", text: "The Cosmic Cola is dangerous. Deep, smooth, and that fizz hits different.", stars: 4 },
  { name: "Kenji M.", city: "Tokyo", text: "Design, taste, vibe — ZOVA is the whole package. Blaze Mango is fire.", stars: 5 },
];

export function Reviews() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % reviews.length), 4500);
    return () => clearInterval(t);
  }, []);
  const rv = reviews[i]!;
  return (
    <section aria-label="Customer reviews" className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <SectionTitle eyebrow="Reviews" title="Fans are charged" />
        <div className="relative min-h-64">
          <AnimatePresence mode="wait">
            <motion.figure key={i} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.5 }} className="glass gradient-border rounded-3xl p-8 text-center sm:p-10">
              <div className="mb-4 flex justify-center gap-1" aria-label={`${rv.stars} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, s) => <Star key={s} className={cn("h-5 w-5", s < rv.stars ? "fill-accent text-accent" : "text-muted")} />)}
              </div>
              <blockquote className="text-xl font-medium sm:text-2xl">“{rv.text}”</blockquote>
              <figcaption className="mt-6 flex items-center justify-center gap-3">
                <span className="bg-neon flex h-11 w-11 items-center justify-center rounded-full font-display font-bold text-primary-foreground" aria-hidden>{rv.name[0]}</span>
                <span className="text-left"><span className="block font-semibold">{rv.name}</span><span className="text-sm text-muted-foreground">{rv.city}</span></span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex justify-center gap-2">
          {reviews.map((_, d) => (
            <button key={d} onClick={() => setI(d)} aria-label={`Show review ${d + 1}`} className={cn("h-2 rounded-full transition-all", d === i ? "bg-neon w-8" : "w-2 bg-muted")} />
          ))}
        </div>
      </div>
    </section>
  );
}
