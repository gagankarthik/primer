/**
 * ILLUSTRATIONS
 *
 * Drawn rather than photographed, deliberately. Stock photography of children
 * in a product marketing page is a consent problem, the child in the photo did
 * not agree to sell a tutoring app, and it always reads as stock. Illustration
 * also lets one figure stand for any child, which photography cannot.
 *
 * Style rules, so a new scene can be added without breaking the set:
 *  - Flat vector, no gradients except one soft ground shape per scene.
 *  - Figures are built from circles and rounded rectangles on a consistent
 *    scale; the same head radius everywhere.
 *  - Skin is a prop, defaulting to a warm mid tone. Never hardcode it.
 *  - Palette is limited to the product's own tokens plus that skin tone, so
 *    illustrations sit beside the UI rather than looking pasted in.
 */

type Skin = "warm" | "deep" | "light";

const SKIN: Record<Skin, { fill: string; shade: string }> = {
  light: { fill: "#F2CBAE", shade: "#E0B092" },
  warm: { fill: "#D89B70", shade: "#C08355" },
  deep: { fill: "#8A5A3C", shade: "#6F462D" },
};

/**
 * A child listening to the Primer.
 *
 * The device is deliberately showing the help gauge rather than a cartoon, the
 * thing on screen in the illustration is the thing that's on screen in the
 * product.
 */
export function ChildListening({
  className,
  skin = "warm",
}: {
  className?: string;
  skin?: Skin;
}) {
  const s = SKIN[skin];

  return (
    <svg
      viewBox="0 0 360 300"
      className={className}
      fill="none"
      role="img"
      aria-label="A child sitting with the Primer, listening to a question"
    >
      {/* soft ground */}
      <ellipse cx="180" cy="252" rx="140" ry="30" fill="var(--color-indigo-tint)" />
      <circle cx="292" cy="72" r="46" fill="var(--color-green-tint)" />
      <circle cx="66" cy="96" r="30" fill="var(--color-amber)" opacity="0.13" />

      {/* stool */}
      <rect x="146" y="212" width="68" height="12" rx="6" fill="#D3D8E2" />
      <rect x="156" y="222" width="10" height="30" rx="5" fill="#D3D8E2" />
      <rect x="194" y="222" width="10" height="30" rx="5" fill="#D3D8E2" />

      {/* legs */}
      <rect x="158" y="196" width="18" height="46" rx="9" fill="#3D4EE8" />
      <rect x="184" y="196" width="18" height="46" rx="9" fill="#3D4EE8" />
      <rect x="152" y="234" width="30" height="14" rx="7" fill="#0B1220" />
      <rect x="178" y="234" width="30" height="14" rx="7" fill="#0B1220" />

      {/* torso */}
      <path
        d="M148 148c0-18 14-32 32-32s32 14 32 32v54h-64v-54Z"
        fill="var(--color-green)"
      />
      {/* collar */}
      <path d="M168 118h24l-12 14-12-14Z" fill="#0B1220" opacity="0.12" />

      {/* far arm, reaching to the device */}
      <path
        d="M150 158c-16 6-28 16-32 30"
        stroke="var(--color-green)"
        strokeWidth="17"
        strokeLinecap="round"
      />
      <circle cx="116" cy="190" r="9" fill={s.fill} />

      {/* near arm resting */}
      <path
        d="M210 158c16 8 24 20 24 34"
        stroke="var(--color-green)"
        strokeWidth="17"
        strokeLinecap="round"
      />
      <circle cx="234" cy="194" r="9" fill={s.fill} />

      {/* neck + head */}
      <rect x="172" y="104" width="16" height="18" rx="8" fill={s.shade} />
      <circle cx="180" cy="86" r="30" fill={s.fill} />
      {/* hair */}
      <path
        d="M150 84a30 30 0 0 1 60 0c0-6-6-10-14-12-9-2-14 4-24 2-12-2-18 4-22 10Z"
        fill="#0B1220"
      />
      <path d="M150 84c-2-22 14-34 30-34s32 12 30 34c-4-16-16-22-30-22s-26 6-30 22Z" fill="#0B1220" />
      {/* face, eyes closed and listening, mouth relaxed */}
      <path
        d="M168 86q4 4 8 0M192 86q-4 4-8 0"
        stroke="#0B1220"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M174 98q6 5 12 0"
        stroke="#0B1220"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="160" cy="95" r="5" fill="#E5484D" opacity="0.16" />
      <circle cx="200" cy="95" r="5" fill="#E5484D" opacity="0.16" />

      {/* the device, showing the real help gauge */}
      <g transform="translate(58 176) rotate(-8)">
        <rect width="86" height="60" rx="10" fill="#FFFFFF" stroke="#D3D8E2" strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect
            key={i}
            x={9 + i * 12}
            y="12"
            width="9"
            height="5"
            rx="2.5"
            fill={`var(--color-help-${i})`}
            opacity={i <= 2 ? 1 : 0.28}
          />
        ))}
        <rect x="9" y="27" width="60" height="5" rx="2.5" fill="#E6E9EF" />
        <rect x="9" y="38" width="44" height="5" rx="2.5" fill="#E6E9EF" />
      </g>

      {/* sound leaving the device */}
      <g stroke="var(--color-indigo)" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M152 170a16 16 0 0 1 0 22" opacity="0.75" />
        <path d="M162 162a28 28 0 0 1 0 38" opacity="0.45" />
        <path d="M172 154a40 40 0 0 1 0 54" opacity="0.2" />
      </g>
    </svg>
  );
}

/**
 * A parent and child looking at the week together. Used wherever the product
 * talks about oversight, the point being that this is a thing you do *with*
 * them, not surveillance you run on them.
 */
export function ParentAndChild({
  className,
  skin = "warm",
  skinB = "deep",
}: {
  className?: string;
  skin?: Skin;
  skinB?: Skin;
}) {
  const a = SKIN[skin];
  const b = SKIN[skinB];

  return (
    <svg
      viewBox="0 0 360 260"
      className={className}
      fill="none"
      role="img"
      aria-label="A parent and child looking at the week's progress together"
    >
      <ellipse cx="180" cy="224" rx="150" ry="26" fill="var(--color-grey-tint)" />
      <circle cx="60" cy="66" r="34" fill="var(--color-amber)" opacity="0.14" />
      <circle cx="308" cy="84" r="26" fill="var(--color-green-tint)" />

      {/* --- adult --- */}
      <path
        d="M96 130c0-22 17-40 39-40s39 18 39 40v90H96v-90Z"
        fill="var(--color-indigo)"
      />
      <rect x="126" y="76" width="18" height="20" rx="9" fill={a.shade} />
      <circle cx="135" cy="56" r="30" fill={a.fill} />
      <path
        d="M105 54c0-18 13-30 30-30s30 12 30 30c-6-12-16-16-30-16s-24 4-30 16Z"
        fill="#3A2C2C"
      />
      <path
        d="M124 56q4 3 7 0M143 56q4 3 7 0"
        stroke="#0B1220"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M129 68q6 5 12 0" stroke="#0B1220" strokeWidth="2.6" strokeLinecap="round" />

      {/* --- child --- */}
      <path
        d="M198 156c0-17 13-31 30-31s30 14 30 31v64h-60v-64Z"
        fill="var(--color-green)"
      />
      <rect x="220" y="112" width="15" height="17" rx="7.5" fill={b.shade} />
      <circle cx="228" cy="96" r="25" fill={b.fill} />
      <path
        d="M203 94c0-15 11-25 25-25s25 10 25 25c-5-10-13-14-25-14s-20 4-25 14Z"
        fill="#1A1310"
      />
      <path
        d="M219 96q3 3 6 0M234 96q3 3 6 0"
        stroke="#0B1220"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M222 107q6 5 11 0" stroke="#0B1220" strokeWidth="2.4" strokeLinecap="round" />

      {/* the report they're both looking at */}
      <g transform="translate(140 150)">
        <rect width="92" height="64" rx="9" fill="#FFFFFF" stroke="#D3D8E2" strokeWidth="2" />
        <rect x="11" y="12" width="46" height="5" rx="2.5" fill="#E6E9EF" />
        <path
          d="M11 42l14-12 12 8 14-16 16 12 14-20"
          stroke="var(--color-indigo)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="81" cy="14" r="4" fill="var(--color-green)" />
      </g>
    </svg>
  );
}

/**
 * A single figure mid-thought. Small, used inline where a page needs a beat of
 * warmth without a full scene.
 */
export function Thinking({
  className,
  skin = "light",
}: {
  className?: string;
  skin?: Skin;
}) {
  const s = SKIN[skin];
  return (
    <svg
      viewBox="0 0 200 180"
      className={className}
      fill="none"
      role="img"
      aria-label="A child working something out"
    >
      <circle cx="100" cy="96" r="70" fill="var(--color-indigo-tint)" />
      <path
        d="M64 154c0-20 16-36 36-36s36 16 36 36v14H64v-14Z"
        fill="var(--color-indigo)"
      />
      <rect x="92" y="98" width="16" height="18" rx="8" fill={s.shade} />
      <circle cx="100" cy="80" r="28" fill={s.fill} />
      <path
        d="M72 78c0-16 12-28 28-28s28 12 28 28c-6-11-15-15-28-15s-22 4-28 15Z"
        fill="#5B3B26"
      />
      <path
        d="M89 80q4 3 7 0M105 80q4 3 7 0"
        stroke="#0B1220"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* mouth to one side, working it out, not smiling on cue */}
      <path d="M94 92q7 3 13-1" stroke="#0B1220" strokeWidth="2.6" strokeLinecap="round" />

      {/* thought marks */}
      <circle cx="146" cy="52" r="5" fill="var(--color-help-2)" />
      <circle cx="158" cy="38" r="7" fill="var(--color-help-1)" />
      <circle cx="172" cy="20" r="10" fill="var(--color-help-0)" />
    </svg>
  );
}
