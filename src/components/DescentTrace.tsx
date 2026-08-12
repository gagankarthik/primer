import type { ScaffoldRung } from "@/lib/profile";

/**
 * THE SIGNATURE ELEMENT (parent surface).
 *
 * One session, drawn as the path help took through it. The line drops when the
 * child got stuck and the Primer gave more, and climbs when they found their
 * footing. Down is deeper help; up is independence.
 *
 * A parent learns to read the shape in about three sessions:
 *   ╲__╱   dipped, recovered    , a normal, good session
 *   ╲╲╲    kept descending      , the concept isn't landing yet
 *   ‾‾‾‾   flat along the top   , too easy, they're coasting
 *
 * This is the chart the product exists to be able to draw. Everything else on
 * the dashboard is supporting evidence for it.
 */
export function DescentTrace({
  trace,
  width = 220,
  height = 56,
  showFloor = true,
}: {
  trace: ScaffoldRung[];
  width?: number;
  height?: number;
  showFloor?: boolean;
}) {
  if (trace.length < 2) return null;

  const pad = 6;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const stepX = w / (trace.length - 1);
  // Rung 0 sits at the top, rung 5 at the bottom: deeper help draws lower.
  const y = (rung: number) => pad + (rung / 5) * h;

  const points = trace.map((r, i) => [pad + i * stepX, y(r)] as const);
  const line = points.map(([px, py]) => `${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
  const area = `${pad},${height - pad} ${line} ${(pad + w).toFixed(1)},${height - pad}`;

  const deepest = Math.max(...trace);
  const ended = trace[trace.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      role="img"
      aria-label={`Help ran from rung ${trace[0]} to rung ${ended}, going as deep as rung ${deepest}.`}
    >
      {showFloor && (
        <>
          <line
            x1={pad}
            y1={y(0)}
            x2={pad + w}
            y2={y(0)}
            stroke="currentColor"
            strokeWidth="1"
            className="text-line"
          />
          <line
            x1={pad}
            y1={y(5)}
            x2={pad + w}
            y2={y(5)}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 4"
            className="text-line"
          />
        </>
      )}

      <polygon points={area} className="fill-indigo/10" />
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="text-indigo"
      />

      {/* Only the end point is marked. Where they finished is the fact that matters. */}
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r="3.75"
        className={ended <= 2 ? "fill-green" : ended >= 4 ? "fill-amber" : "fill-indigo"}
      />
    </svg>
  );
}
