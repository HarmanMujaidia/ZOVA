import { useState } from "react";
import { MapPin, Search, Instagram, Youtube, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { MagneticButton, Reveal, SectionTitle } from "./primitives";
import { scrollToId, NAV } from "./chrome";
import { WorldMap } from "./WorldMap";

const stores = [
  { city: "Mumbai", name: "ZOVA Lab — Bandra West", lat: 19.08, lng: 72.88 },
  { city: "Delhi", name: "Select Citywalk, Saket", lat: 28.61, lng: 77.21 },
  { city: "Dubai", name: "Dubai Mall, Level 2", lat: 25.2, lng: 55.27 },
  { city: "Berlin", name: "KaDeWe Food Hall", lat: 52.52, lng: 13.4 },
  { city: "London", name: "Selfridges, Oxford St", lat: 51.51, lng: -0.13 },
  { city: "New York", name: "Chelsea Market", lat: 40.71, lng: -74.0 },
  { city: "Los Angeles", name: "The Grove", lat: 34.05, lng: -118.24 },
  { city: "Tokyo", name: "Shibuya Scramble Square", lat: 35.68, lng: 139.69 },
];

export function FindZova() {
  const [q, setQ] = useState("");
  const results = stores.filter((s) => s.city.toLowerCase().includes(q.toLowerCase().trim()));
  return (
    <section aria-label="Find ZOVA near you" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionTitle eyebrow="Find ZOVA" title="Near you, ice-cold" />
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Reveal>
            <div className="glass relative aspect-[16/9] overflow-hidden rounded-3xl" role="img" aria-label="Map of ZOVA store locations">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(var(--glass-border) 1px, transparent 1px), linear-gradient(90deg, var(--glass-border) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              <WorldMap
                markers={results.map((s) => ({ id: s.name, lat: s.lat, lng: s.lng }))}
                activeId={q.trim() ? results[0]?.name : stores[0].name}
              />
              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl" style={{ boxShadow: "inset 0 0 60px 10px color-mix(in oklab, var(--background) 55%, transparent)" }} />

            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <label className="glass flex items-center gap-3 rounded-full px-5 py-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Search by city</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} maxLength={60} placeholder="Search your city…" className="w-full bg-transparent outline-none" />
            </label>
            <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto">
              {results.length === 0 && <li className="p-4 text-sm text-muted-foreground">No stores yet — coming soon to {q}!</li>}
              {results.map((s) => (
                <li key={s.name} className="glass flex items-start gap-3 rounded-2xl p-4">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                  <div><p className="font-semibold">{s.city}</p><p className="text-sm text-muted-foreground">{s.name}</p></div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(2000),
});
const emailSchema = z.string().trim().email().max(255);

export function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [news, setNews] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const parsed = contactSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success) { setErrors(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message]))); return; }
    setErrors({}); setBusy(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setBusy(false);
    if (error) { toast.error("Message failed to send."); return; }
    toast.success("Message sent — we'll reply soon!");
    form.reset();
  };

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = emailSchema.safeParse(news);
    if (!p.success) { toast.error("Enter a valid email"); return; }
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: p.data.toLowerCase() });
    if (error && error.code !== "23505") { toast.error("Couldn't subscribe."); return; }
    toast.success("You're on the list ⚡");
    setNews("");
  };

  return (
    <section id="contact" className="py-28" aria-label="Contact">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-10 px-6 lg:grid-cols-2">
        <div className="min-w-0">
          <SectionTitle eyebrow="Contact" title={<>Let's <span className="text-neon">connect</span></>} />
          <Reveal className="glass gradient-border rounded-3xl p-8">
            <h3 className="text-2xl font-bold">Join the charge</h3>
            <p className="mt-2 text-muted-foreground">Drops, new flavors and secret launches. No spam, ever.</p>
            <form onSubmit={subscribe} className="mt-6 flex gap-2">
              <label className="sr-only" htmlFor="news">Email</label>
              <input id="news" type="email" value={news} onChange={(e) => setNews(e.target.value)} maxLength={255} placeholder="you@email.com" className="glass min-w-0 flex-1 rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-ring" />
              <button className="bg-neon rounded-full px-5 font-semibold text-primary-foreground" aria-label="Subscribe"><Send className="h-4 w-4" /></button>
            </form>
            <div className="mt-8 flex gap-3">
              {[{ I: Instagram, l: "Instagram" }, { I: Youtube, l: "YouTube" }].map(({ I, l }) => (
                <a key={l} href="#" aria-label={l} className="glass rounded-full p-3 transition-shadow hover:glow"><I className="h-5 w-5" /></a>
              ))}
              <a href="#" aria-label="X" className="glass flex h-11 w-11 items-center justify-center rounded-full font-display font-bold transition-shadow hover:glow">𝕏</a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <form onSubmit={submit} noValidate className="glass gradient-border space-y-4 rounded-3xl p-8 lg:mt-36">
            {(["name", "email", "message"] as const).map((k) => (
              <label key={k} className="block">
                <span className="mb-1 block text-sm capitalize text-muted-foreground">{k}</span>
                {k === "message" ? (
                  <textarea name={k} rows={5} maxLength={2000} className="glass w-full rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
                ) : (
                  <input name={k} type={k === "email" ? "email" : "text"} maxLength={k === "email" ? 255 : 100} className="glass w-full rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
                )}
                {errors[k] && <span className="mt-1 block text-sm text-destructive">{errors[k]}</span>}
              </label>
            ))}
            <MagneticButton type="submit" disabled={busy} className="w-full">{busy ? "Sending…" : "Send Message"}</MagneticButton>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t pb-32 pt-16">
      <p aria-hidden className="text-neon pointer-events-none select-none text-center font-display text-[28vw] font-black leading-none opacity-[0.07]">ZOVA</p>
      <div className="mx-auto -mt-[10vw] flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <p className="font-display font-semibold">Chill. Charged. ZOVA.</p>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-5 text-sm text-muted-foreground">
          {NAV.map((n) => <button key={n.id} onClick={() => scrollToId(n.id)} className="hover:text-foreground">{n.label}</button>)}
          <a href="/admin" className="hover:text-foreground">Admin</a>
        </nav>
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} ZOVA Beverages</p>
      </div>
    </footer>
  );
}
