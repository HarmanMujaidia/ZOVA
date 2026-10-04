import { createFileRoute } from "@tanstack/react-router";
import { CartProvider } from "@/lib/cart";
import { Loader, Cursor, TopBar, Dock } from "@/components/zova/chrome";
import { Hero } from "@/components/zova/Hero";
import { Flavors } from "@/components/zova/Flavors";
import { Experience, Process } from "@/components/zova/Story";
import { Gallery, Reviews } from "@/components/zova/Gallery";
import { Order, CartDrawer } from "@/components/zova/Order";
import { FindZova, Contact, Footer } from "@/components/zova/Connect";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZOVA — Chill. Charged. Sparkling Sodas & Energy Coolers" },
      { name: "description", content: "ZOVA is a next-gen cold drink: ice-cold sparkling fruit sodas and energy coolers. Explore 5 flavors and order online." },
      { property: "og:title", content: "ZOVA — Chill. Charged. ZOVA." },
      { property: "og:description", content: "Ice-cold sparkling fruit sodas and energy coolers. Explore Arctic Mint, Blaze Mango, Neon Berry, Solar Lemon and Cosmic Cola." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
