import { useEffect, useState } from "react";

// Every image in src/assets is preloaded automatically.
const imageUrls = Object.values(
  import.meta.glob("../assets/*.{webp,png,jpg,jpeg,avif}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
) as string[];

// Only the hero video is waited for (it is the first thing people see).
const videoUrls = ["/media/hero.mp4"];

const MIN_MS = 1500;
const MAX_MS = 8000;

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const total = imageUrls.length + videoUrls.length;
    let loaded = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      const wait = Math.max(0, MIN_MS - (Date.now() - start));
      setTimeout(() => {
        setProgress(100);
        setDone(true);
      }, wait);
    };

    const makeTick = () => {
      let called = false;
      return () => {
        if (called) return;
        called = true;
        loaded += 1;
        setProgress(Math.round((loaded / total) * 100));
        if (loaded >= total) finish();
      };
    };

    document.body.style.overflow = "hidden";

    imageUrls.forEach((src) => {
      const tick = makeTick();
      const img = new Image();
      img.onload = tick;
      img.onerror = tick;
      img.src = src;
    });

    videoUrls.forEach((src) => {
      const tick = makeTick();
      const v = document.createElement("video");
      v.preload = "auto";
      v.muted = true;
      v.onloadeddata = tick;
      v.onerror = tick;
      v.src = src;
    });

    if (total === 0) finish();
    const maxTimer = setTimeout(finish, MAX_MS);
    return () => clearTimeout(maxTimer);
  }, []);

  useEffect(() => {
    if (!done) return;
    document.body.style.overflow = "";
    const t = setTimeout(() => setGone(true), 700);
    return () => clearTimeout(t);
  }, [done]);

  if (gone) return null;

  return (
    <div
      aria-hidden={done}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#05060A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        overflow: "hidden",
        opacity: done ? 0 : 1,
        transition: "opacity 0.7s ease",
        pointerEvents: done ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes zova-rise {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          15% { opacity: 0.8; }
          100% { transform: translateY(-110vh) scale(1.2); opacity: 0; }
        }
        @keyframes zova-glow {
          0%, 100% { filter: drop-shadow(0 0 18px rgba(0,229,255,.45)); }
          50% { filter: drop-shadow(0 0 34px rgba(182,255,0,.55)); }
        }
      `}</style>

      {Array.from({ length: 14 }).map((_, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            bottom: -30,
            left: `${(i * 7 + 5) % 100}%`,
            width: 8 + (i % 4) * 6,
            height: 8 + (i % 4) * 6,
            borderRadius: "50%",
            border: "1px solid rgba(0,229,255,0.5)",
            background: "rgba(0,229,255,0.08)",
            animation: `zova-rise ${4 + (i % 5)}s ease-in ${(i % 7) * 0.5}s infinite`,
          }}
        />
      ))}

      <div
        style={{
          fontFamily: "Unbounded, Inter, sans-serif",
          fontWeight: 900,
          fontSize: "clamp(52px, 13vw, 104px)",
          letterSpacing: "0.08em",
          background: "linear-gradient(90deg, #00E5FF, #B6FF00)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          animation: "zova-glow 2.4s ease-in-out infinite",
        }}
      >
        ZOVA
      </div>

      <div style={{ width: "min(280px, 70vw)" }}>
        <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #00E5FF, #B6FF00)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <div style={{ marginTop: 10, textAlign: "center", color: "#9aa4b2", fontFamily: "Inter, sans-serif", fontSize: 13, letterSpacing: "0.2em" }}>
          {progress}%
        </div>
      </div>
    </div>
  );
}