// Local, case-consistent media imports are bundled with the site.
import canMint from "@/assets/can-arctic-mint.webp";
import canMango from "@/assets/can-blaze-mango.webp";
import canBerry from "@/assets/can-neon-berry.webp";
import canLemon from "@/assets/can-solar-lemon.webp";
import canCola from "@/assets/can-cosmic-cola.webp";
import heroSplash from "@/assets/hero-splash.jpg";
import gMango from "@/assets/gallery-blaze-mango.webp";
import gLemon from "@/assets/gallery-solar-lemon.webp";
import gMint from "@/assets/gallery-arctic-mint.webp";
import gBerry from "@/assets/gallery-neon-berry.webp";
import gCola from "@/assets/gallery-cosmic-cola.webp";

export const media = {
  heroPoster: heroSplash,
  heroVideo: "/media/hero.webm",
  experienceVideo: "/media/experience.webm",
  galleryVideo: "/media/gallery.webm",
  imageFallback: "/media/zova-placeholder.svg",
};

export function imageFallback(event: { currentTarget: HTMLImageElement }) {
  const image = event.currentTarget;
  if (!image.src.endsWith(media.imageFallback)) image.src = media.imageFallback;
}

export type Flavor = {
  id: string;
  name: string;
  color: string; // oklch value, drives the live --flavor token
  can: string;
  tagline: string;
  description: string;
  price: number;
};

export const flavors: Flavor[] = [
  { id: "arctic-mint", name: "Arctic Mint", color: "oklch(0.85 0.15 205)", can: canMint, tagline: "Glacier-cold clarity", description: "Crisp peppermint and cool lime over a sub-zero fizz. Like breathing in a snowstorm.", price: 2.99 },
  { id: "blaze-mango", name: "Blaze Mango", color: "oklch(0.75 0.19 50)", can: canMango, tagline: "Tropical heatwave", description: "Sun-ripened Alphonso mango with a hit of chili-lime spark. Sweet heat, ice-cold finish.", price: 2.99 },
  { id: "neon-berry", name: "Neon Berry", color: "oklch(0.66 0.26 0)", can: canBerry, tagline: "After-dark superfruit", description: "Raspberry, blackberry and blueberry charged with natural caffeine for the late shift.", price: 3.29 },
  { id: "solar-lemon", name: "Solar Lemon", color: "oklch(0.92 0.22 125)", can: canLemon, tagline: "Pure daylight", description: "Sicilian lemon zest, electrolytes and a bright citrus burst that tastes like noon.", price: 2.99 },
  { id: "cosmic-cola", name: "Cosmic Cola", color: "oklch(0.6 0.22 25)", can: canCola, tagline: "A higher dimension", description: "Classic cola reimagined with vanilla, cherry and a deep cosmic spice. Bold, dark, endless.", price: 3.29 },
];

export const gallery = [
  { src: gMango, alt: "Model holding a Blaze Mango ZOVA can on an orange studio backdrop", tall: true },
  { src: gLemon, alt: "Hand holding a Solar Lemon ZOVA can against a lime-green splash background", tall: false },
  { src: gMint, alt: "Arctic Mint ZOVA can floating over icy blue water with a surfer", tall: true },
  { src: gBerry, alt: "Neon Berry ZOVA can in a magenta fruit splash", tall: false },
  { src: gCola, alt: "Cosmic Cola ZOVA can coiled by a black dragon in a cosmic red scene", tall: false },
  { src: "video", alt: "Slow-motion splash video", tall: false },
];
