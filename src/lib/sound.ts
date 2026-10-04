let enabled = false;
let ctx: AudioContext | null = null;

export const setSound = (v: boolean) => { enabled = v; };
export const isSound = () => enabled;

/** Tiny synthesized "fizz click" — no audio files needed. */
export function fizz() {
  if (!enabled || typeof window === "undefined") return;
  ctx ??= new AudioContext();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(1400, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
  g.gain.setValueAtTime(0.08, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
  o.connect(g).connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + 0.12);
}
