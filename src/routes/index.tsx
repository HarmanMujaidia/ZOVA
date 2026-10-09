import { createFileRoute } from "@tanstack/react-router";
import { CartProvider } from "@/lib/cart";
import { Loader, Cursor, TopBar, Dock } from "@/components/zova/chrome";
import { Hero } from "@/components/zova/Hero";
import { Flavors } from "@/components/zova/Flavors";
import { Experience, Process } from "@/components/zova/Story";
import { Gallery, Reviews } from "@/components/zova/Gallery";
import { Order, CartDrawer } from "@/components/zova/Order";
import { FindZova, Contact, Footer } from "@/components/zova/Connect";
import { flavors, media } from "@/lib/media";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZOVA – Chill. Charged." },
      { name: "description", content: "Discover ZOVA premium sparkling fruit sodas and energy coolers—five bold flavors, real-fruit refreshment, and an ice-cold charge." },
      { property: "og:title", content: "ZOVA – Chill. Charged." },
      { property: "og:description", content: "Premium sparkling fruit sodas and energy coolers in five bold, ice-cold flavors." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://zovadrink.vercel.app/" },
      { property: "og:image", content: "https://zovadrink.vercel.app/media/zova-share.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ZOVA – Chill. Charged." },
      { name: "twitter:description", content: "Premium sparkling fruit sodas and energy coolers in five bold, ice-cold flavors." },
      { name: "twitter:image", content: "https://zovadrink.vercel.app/media/zova-share.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://zovadrink.vercel.app/" },
      { rel: "preload", href: media.heroPoster, as: "image", fetchPriority: "high" },
      ...flavors.map((flavor) => ({ rel: "preload", href: flavor.can, as: "image" as const })),
      { rel: "preload", href: media.heroVideo, as: "video", type: "video/mp4" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <CartProvider>
      <div className="grain">
        <Loader />
        <Cursor />
        <TopBar />
        <main>
          <Hero />
          <Flavors />
          <Experience />
          <Process />
          <Gallery />
          <Reviews />
          <Order />
          <FindZova />
          <Contact />
        </main>
        <Footer />
        <Dock />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
