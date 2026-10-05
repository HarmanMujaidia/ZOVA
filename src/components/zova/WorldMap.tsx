import { WORLD_LAND_PATH, WORLD_MAP_VIEWBOX } from "./world-map-data";

export type MapMarker = { id: string; lat: number; lng: number };

const { width, height, north, south } = WORLD_MAP_VIEWBOX;

const EDGE_FADE =
  "radial-gradient(ellipse 72% 78% at 50% 50%, #000 58%, transparent 100%)";

function project(lat: number, lng: number) {
  return {
    left: ((lng + 180) / 360) * 100,
    top: ((north - lat) / (north - south)) * 100,
  };
}

export function WorldMap({ markers, activeId }: { markers: MapMarker[]; activeId?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-[4%]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 52%, color-mix(in oklab, var(--flavor) 7%, transparent), transparent 70%)",
        }}
      />
      <div className="relative w-full" style={{ aspectRatio: `${width} / ${height}` }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
          aria-hidden
          focusable="false"
        >
          <defs>
            <linearGradient id="zova-land" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--foreground)" stopOpacity={0.09} />
              <stop offset="100%" stopColor="var(--foreground)" stopOpacity={0.045} />
            </linearGradient>
          </defs>
          <path
            d={WORLD_LAND_PATH}
            fill="url(#zova-land)"
            stroke="color-mix(in oklab, var(--foreground) 16%, transparent)"
            strokeWidth={0.6}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {markers.map((m, i) => {
          const { left, top } = project(m.lat, m.lng);
          const active = m.id === activeId;
          const core = active ? "h-2.5 w-2.5" : "h-1.5 w-1.5 sm:h-2 sm:w-2";
          return (
            <span
              key={m.id}
              className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <span
                className="animate-map-pulse absolute h-4 w-4 rounded-full border motion-reduce:animate-none sm:h-5 sm:w-5"
                style={{
                  borderColor: "color-mix(in oklab, var(--flavor) 70%, transparent)",
                  animationDelay: `${(i * 0.6) % 4.5}s`,
                }}
              />
              <span
                className="absolute h-4 w-4 rounded-full sm:h-5 sm:w-5"
                style={{
                  background: "color-mix(in oklab, var(--flavor) 10%, transparent)",
                  boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--flavor) 30%, transparent)",
                }}
              />
              <span
                className={`relative block rounded-full ${core}`}
                style={{
                  background:
                    "radial-gradient(circle at 35% 35%, color-mix(in oklab, var(--flavor) 40%, white), var(--flavor) 70%)",
                  boxShadow: active
                    ? "0 0 10px 2px color-mix(in oklab, var(--flavor) 65%, transparent), 0 0 28px 6px color-mix(in oklab, var(--flavor) 25%, transparent)"
                    : "0 0 8px 1px color-mix(in oklab, var(--flavor) 55%, transparent)",
                }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}
