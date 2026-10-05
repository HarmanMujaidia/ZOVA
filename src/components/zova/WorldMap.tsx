import { WORLD_LAND_PATH, WORLD_MAP_VIEWBOX } from "./world-map-data";

export type MapMarker = { id: string; lat: number; lng: number };

const { width, height, north, south } = WORLD_MAP_VIEWBOX;

function project(lat: number, lng: number) {
  return {
    left: ((lng + 180) / 360) * 100,
    top: ((north - lat) / (north - south)) * 100,
  };
}

export function WorldMap({ markers, activeId }: { markers: MapMarker[]; activeId?: string }) {
  return (
    <div className="absolute inset-0 flex items-center px-[3%]">
      <div className="relative w-full" style={{ aspectRatio: `${width} / ${height}` }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
          focusable="false"
        >
          <path
            d={WORLD_LAND_PATH}
            fill="color-mix(in oklab, var(--foreground) 7%, transparent)"
            stroke="color-mix(in oklab, var(--foreground) 14%, transparent)"
            strokeWidth={0.6}
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {markers.map((m, i) => {
          const { left, top } = project(m.lat, m.lng);
          const active = m.id === activeId;
          const size = active ? "h-3.5 w-3.5" : "h-2.5 w-2.5 sm:h-3 sm:w-3";
          return (
            <span
              key={m.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <span
                className="animate-map-pulse absolute inset-0 rounded-full motion-reduce:animate-none"
                style={{ background: "var(--flavor)", animationDelay: `${(i * 0.45) % 3}s` }}
              />
              <span
                className={`relative block rounded-full ${size}`}
                style={{
                  background: "var(--flavor)",
                  boxShadow: active
                    ? "0 0 0 3px color-mix(in oklab, var(--flavor) 25%, transparent), 0 0 22px var(--flavor)"
                    : "0 0 14px var(--flavor)",
                }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}
