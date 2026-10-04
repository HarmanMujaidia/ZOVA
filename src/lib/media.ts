// Central media registry — swap any of these for your own files in src/assets.
import canMint from "@/assets/can-arctic-mint.png";
import canMango from "@/assets/can-blaze-mango.png";
import canBerry from "@/assets/can-neon-berry.png";
import canLemon from "@/assets/can-solar-lemon.png";
import canCola from "@/assets/can-cosmic-cola.png";
import heroSplash from "@/assets/hero-splash.jpg";
import gClub from "@/assets/gallery-club.jpg";
import gBeach from "@/assets/gallery-beach.jpg";
import gGym from "@/assets/gallery-gym.jpg";
import gCity from "@/assets/gallery-city.jpg";

export const media = {
  heroPoster: heroSplash,
  heroVideo: "https://assets.mixkit.co/videos/18294/18294-720.mp4",
  experienceVideo: "https://assets.mixkit.co/videos/41552/41552-720.mp4",
  galleryVideo: "https://assets.mixkit.co/videos/4962/4962-720.mp4",
};

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
  { src: gClub, alt: "Friends raising ZOVA cans at a neon nightclub", tall: true },
  { src: gBeach, alt: "Woman holding a Solar Lemon ZOVA at a sunset beach", tall: false },
  { src: "video", alt: "Slow-motion splash video", tall: false },
  { src: gGym, alt: "Athlete drinking Arctic Mint ZOVA at the gym", tall: true },
  { src: gCity, alt: "Man holding Cosmic Cola ZOVA on a neon city street at night", tall: false },
  { src: heroSplash, alt: "Ice cubes and liquid splashing under neon light", tall: false },
];
