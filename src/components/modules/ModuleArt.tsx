import type { ArtKey } from "@/lib/modules";

/**
 * MODULE COVER ART
 *
 * Bold geometric line work with exactly one solid fill per piece.
 *
 * Every cover *depicts its concept* rather than decorating it: the
 * multiplication cover is a 3×4 array, the division cover is a bar split into
 * equal parts with a visible remainder, the blending cover is three shapes
 * converging into one. A child who cannot yet read the title can still tell
 * these apart, which is the whole job of cover art in a product whose youngest
 * users are pre-literate.
 *
 * Drawn rather than sourced, because stock line-art libraries are abstract by
 * design, pretty, but they would make "Adding" and "Sharing out" look
 * identical to a five-year-old.
 */

const TONE_FILL: Record<string, string> = {
  indigo: "#3D4EE8",
  green: "#12B981",
  amber: "#F0A020",
  rose: "#E5484D",
};

export function ModuleArt({
  art,
  tone = "indigo",
  className,
}: {
  art: ArtKey;
  tone?: "indigo" | "green" | "amber" | "rose";
  className?: string;
}) {
  const fill = TONE_FILL[tone];

  return (
    <svg
      viewBox="0 0 240 132"
      className={className}
      fill="none"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        stroke="#0B1220"
        strokeOpacity="0.9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Art art={art} fill={fill} />
      </g>
    </svg>
  );
}

function Art({ art, fill }: { art: ArtKey; fill: string }) {
  switch (art) {
    // Counting: a row of bricks, the counted ones filled in.
    case "count":
      return (
        <>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={54 + i * 24}
              y={54}
              width="20"
              height="24"
              rx="3"
              fill={i < 4 ? fill : "none"}
            />
          ))}
          <path d="M54 92h92" strokeOpacity="0.25" />
          <path d="M54 88v8M146 88v8" strokeOpacity="0.25" />
        </>
      );

    // Number pairs: two bars of different length making one whole.
    case "bonds":
      return (
        <>
          <rect x="46" y="42" width="60" height="22" rx="4" fill={fill} />
          <rect x="110" y="42" width="84" height="22" rx="4" />
          <path d="M46 78h148" />
          <path d="M46 74v8M194 74v8" />
          <path d="M106 68v14" strokeOpacity="0.3" strokeDasharray="3 4" />
        </>
      );

    // Adding: two groups of dots brought together.
    case "add":
      return (
        <>
          <circle cx="66" cy="52" r="9" fill={fill} />
          <circle cx="90" cy="52" r="9" fill={fill} />
          <circle cx="78" cy="74" r="9" fill={fill} />
          <path d="M114 63h20M124 53v20" />
          <circle cx="158" cy="52" r="9" />
          <circle cx="182" cy="52" r="9" />
          <circle cx="158" cy="74" r="9" />
          <circle cx="182" cy="74" r="9" />
        </>
      );

    // Taking away: a group with part visibly removed.
    case "subtract":
      return (
        <>
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={62 + i * 26} cy="54" r="9" fill={fill} />
          ))}
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={62 + i * 26}
              cy="86"
              r="9"
              strokeDasharray="3 4"
              strokeOpacity="0.35"
            />
          ))}
          <path d="M178 70h26" />
        </>
      );

    // Times tables: a 3 x 4 array, the actual meaning of multiplication.
    case "multiply":
      return (
        <>
          {[0, 1, 2].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={72 + c * 26}
                y={34 + r * 26}
                width="18"
                height="18"
                rx="3"
                fill={r === 0 ? fill : "none"}
              />
            )),
          )}
          <path d="M62 34v70" strokeOpacity="0.3" />
          <path d="M72 114h96" strokeOpacity="0.3" />
        </>
      );

    // Sharing out: one bar split into equal parts, with a remainder.
    case "divide":
      return (
        <>
          <rect x="44" y="46" width="132" height="26" rx="4" />
          <path d="M77 46v26M110 46v26M143 46v26" />
          <rect x="186" y="46" width="14" height="26" rx="4" fill={fill} />
          <path d="M44 88h132" strokeOpacity="0.3" />
          <path d="M186 88h14" strokeOpacity="0.3" />
          <path d="M186 96l7 8 7-8" strokeOpacity="0.4" />
        </>
      );

    // Letter sounds: one mouth, sound leaving it.
    case "sounds":
      return (
        <>
          <circle cx="74" cy="66" r="14" fill={fill} />
          <path d="M104 50a22 22 0 0 1 0 32" />
          <path d="M124 40a36 36 0 0 1 0 52" />
          <path d="M144 30a50 50 0 0 1 0 72" strokeOpacity="0.4" />
        </>
      );

    // Blending: three separate sounds converging into one word.
    case "blend":
      return (
        <>
          <circle cx="52" cy="38" r="10" fill={fill} />
          <circle cx="52" cy="66" r="10" fill={fill} />
          <circle cx="52" cy="94" r="10" fill={fill} />
          <path d="M66 38q34 0 44 28M66 66h44M66 94q34 0 44-28" strokeOpacity="0.45" />
          <rect x="116" y="52" width="76" height="28" rx="6" />
          <path d="M130 66h48" strokeOpacity="0.35" />
        </>
      );

    // Rhyme: two different starts, identical endings.
    case "rhyme":
      return (
        <>
          <rect x="46" y="38" width="26" height="24" rx="4" />
          <rect x="76" y="38" width="52" height="24" rx="4" fill={fill} />
          <rect x="46" y="74" width="26" height="24" rx="4" strokeOpacity="0.5" />
          <rect x="76" y="74" width="52" height="24" rx="4" fill={fill} />
          <path d="M142 50h18M142 86h18" strokeOpacity="0.3" />
          <path d="M170 50a14 14 0 0 1 0 36" strokeOpacity="0.3" />
        </>
      );
  }
}
