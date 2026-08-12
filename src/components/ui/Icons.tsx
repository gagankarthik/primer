import type { SVGProps } from "react";

/**
 * THE ICON SET, duotone.
 *
 * Every icon is a solid tinted shape with a crisp 1.75 stroke drawn over it.
 * Thin single-weight outlines look weightless next to heavy display type and
 * read as unfinished at 20px; the filled underlayer gives them presence and
 * lets one accent colour carry through the whole interface.
 *
 * All icons share a 24 grid, a 1.75 stroke, round caps, and the same geometric
 * vocabulary, stacked bars, a circle, a plumb line, so the set reads as one
 * family rather than as stock clip art.
 *
 * Colour is applied by the caller: `text-*` drives the stroke, and the fill
 * inherits at 14% opacity so a single class themes the whole icon.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 22, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      {...rest}
    >
      <g
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
    </svg>
  );
}

const FILL = { fill: "currentColor", fillOpacity: 0.14, stroke: "none" } as const;

/** The rung ladder, the core mark. How much help was given. */
export const IconRungs = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="3.5" width="18" height="17" rx="4" {...FILL} />
    <path d="M9 8h6M10.5 12h3M7 16h10" />
  </Svg>
);

/** A question asked back, an arc returning to its own start. */
export const IconAsk = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" {...FILL} />
    <path d="M4.5 12A7.5 7.5 0 1 1 7 17.6" />
    <path d="M3.5 6.5v4h4" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
  </Svg>
);

/** The moment it lands. */
export const IconSpark = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" {...FILL} />
    <circle cx="12" cy="12" r="3.25" />
    <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.4 5.4l2.1 2.1M16.5 16.5l2.1 2.1M18.6 5.4l-2.1 2.1M7.5 16.5l-2.1 2.1" />
  </Svg>
);

/** Voice, sound leaving a point. */
export const IconVoice = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="7.5" cy="12" r="3" {...FILL} />
    <circle cx="7.5" cy="12" r="2.25" />
    <path d="M12.5 8.2a5.5 5.5 0 0 1 0 7.6M16 5.4a9.5 9.5 0 0 1 0 13.2" />
  </Svg>
);

/** A session's descent trace. */
export const IconTrace = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 8.5l4 5.5 4.5-4 4 6L20 6v13H3V8.5Z" {...FILL} />
    <path d="M3 8.5l4 5.5 4.5-4 4 6L20 6" />
    <circle cx="20" cy="6" r="1.6" fill="currentColor" stroke="none" />
  </Svg>
);

/** Growth over time. */
export const IconGrow = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 11c0-3 2.4-5.4 5.4-5.4 0 3-2.4 5.4-5.4 5.4ZM12 15.5c0-2.6-2.1-4.7-4.7-4.7 0 2.6 2.1 4.7 4.7 4.7Z" {...FILL} />
    <path d="M12 21V8" />
    <path d="M12 11c0-3 2.4-5.4 5.4-5.4 0 3-2.4 5.4-5.4 5.4ZM12 15.5c0-2.6-2.1-4.7-4.7-4.7 0 2.6 2.1 4.7 4.7 4.7Z" />
  </Svg>
);

/** Safety. */
export const IconShield = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2.6l8 3.4v6c0 4.9-3.3 9.2-8 10.4-4.7-1.2-8-5.5-8-10.4V6l8-3.4Z" {...FILL} />
    <path d="M12 2.6l8 3.4v6c0 4.9-3.3 9.2-8 10.4-4.7-1.2-8-5.5-8-10.4V6l8-3.4Z" />
    <path d="M8.75 12.2l2.2 2.2 4.3-4.6" />
  </Svg>
);

export const IconClock = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" {...FILL} />
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.2l3.2 2" />
  </Svg>
);

/** A page of the Primer. */
export const IconPage = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5.5 3h8L18.5 8v13h-13V3Z" {...FILL} />
    <path d="M5.5 3h8L18.5 8v13h-13V3Z" />
    <path d="M13.5 3v5h5M8.5 13h7M8.5 16.5h4.5" />
  </Svg>
);

export const IconParent = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="7.5" r="3.4" {...FILL} />
    <circle cx="9" cy="7.5" r="3.4" />
    <path d="M2.8 20.5c0-3.4 2.8-6.2 6.2-6.2s6.2 2.8 6.2 6.2" />
    <circle cx="17.8" cy="11" r="2.2" />
    <path d="M15.2 20.5c0-2.2 1.2-3.9 2.6-3.9s2.6 1.7 2.6 3.9" />
  </Svg>
);

export const IconChild = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="7.5" r="3.6" {...FILL} />
    <circle cx="12" cy="7.5" r="3.6" />
    <path d="M5 20.5c0-3.9 3.1-7 7-7s7 3.1 7 7" />
  </Svg>
);

export const IconCheck = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9.25" {...FILL} />
    <path d="M7.75 12.3l3 3 5.5-6.4" />
  </Svg>
);

export const IconArrow = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12h14M12.5 6.5L18 12l-5.5 5.5" />
  </Svg>
);

export const IconLock = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="10.25" width="16" height="10.75" rx="3" {...FILL} />
    <rect x="4" y="10.25" width="16" height="10.75" rx="3" />
    <path d="M7.75 10.25V7.5a4.25 4.25 0 0 1 8.5 0v2.75" />
  </Svg>
);

export const IconMail = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.75" y="5" width="18.5" height="14" rx="3" {...FILL} />
    <rect x="2.75" y="5" width="18.5" height="14" rx="3" />
    <path d="M3.5 7l8.5 5.8L20.5 7" />
  </Svg>
);

export const IconFlag = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5.5 4h12l-2.75 4.25L17.5 12.5h-12V4Z" {...FILL} />
    <path d="M5.5 21V3.5" />
    <path d="M5.5 4h12l-2.75 4.25L17.5 12.5h-12" />
  </Svg>
);

/**
 * Icon in a tinted tile.
 *
 * A bare 24px stroke icon floating on a white card reads as weightless next to
 * heavy display type, it looks like a placeholder rather than a decision.
 * Setting it on a tinted rounded tile gives it presence at small sizes and
 * matches the badge tiles, so icons and badges read as one system.
 */
export function IconTile({
  Icon,
  tone = "indigo",
  size = 40,
}: {
  Icon: (p: IconProps) => React.JSX.Element;
  tone?: "indigo" | "green" | "amber" | "night";
  size?: number;
}) {
  const tones = {
    indigo: "bg-indigo-tint text-indigo",
    green: "bg-green-tint text-green",
    amber: "bg-amber/12 text-amber",
    night: "bg-white/10 text-indigo-hi",
  } as const;

  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-xl ${tones[tone]}`}
      style={{ width: size, height: size }}
    >
      <Icon size={Math.round(size * 0.55)} />
    </span>
  );
}

export const ICON_SET = {
  rungs: IconRungs,
  ask: IconAsk,
  spark: IconSpark,
  voice: IconVoice,
  trace: IconTrace,
  grow: IconGrow,
  shield: IconShield,
  clock: IconClock,
  page: IconPage,
  parent: IconParent,
  child: IconChild,
  check: IconCheck,
  arrow: IconArrow,
  lock: IconLock,
  mail: IconMail,
  flag: IconFlag,
} as const;

export type IconName = keyof typeof ICON_SET;
