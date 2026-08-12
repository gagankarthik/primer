import type { SVGProps } from "react";

/**
 * MENU ICONS
 *
 * Purpose-drawn for the six mega-menu entries, rather than pulled from the
 * general icon set. A dropdown is where a visitor decides which part of the
 * product to look at, so each icon draws the *actual thing* behind the link,
 * the help gauge, the five profile dimensions, the descent trace, instead of a
 * generic shield or clock that could sit in any menu on the web.
 *
 * Shared construction so they read as one family: 28×28 grid, 2px strokes,
 * round caps, one tinted fill from the tile behind them, and the help-scale
 * ramp wherever the concept involves depth of help.
 */

type P = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

/** The scaffold ladder, six rungs, the third one lit. */
export const MenuLadder = (p: P) => (
  <Svg {...p}>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect
        key={i}
        x={4}
        y={3.5 + i * 3.6}
        width={20}
        height={2.2}
        rx={1.1}
        fill={i === 2 ? "currentColor" : "currentColor"}
        opacity={i === 2 ? 1 : i < 2 ? 0.45 : 0.2}
      />
    ))}
  </Svg>
);

/** The learner profile, five bars, two solid, three faint: what we trust. */
export const MenuProfile = (p: P) => (
  <Svg {...p}>
    {[
      { h: 16, o: 1 },
      { h: 13, o: 1 },
      { h: 9, o: 0.4 },
      { h: 6, o: 0.3 },
      { h: 4, o: 0.22 },
    ].map((b, i) => (
      <rect
        key={i}
        x={3.5 + i * 4.4}
        y={22 - b.h}
        width={3}
        height={b.h}
        rx={1.5}
        fill="currentColor"
        opacity={b.o}
      />
    ))}
    <path
      d="M3 24.5h22"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      opacity="0.35"
    />
  </Svg>
);

/** Safety, a shield with a struck-through microphone inside it. */
export const MenuShield = (p: P) => (
  <Svg {...p}>
    <path
      d="M14 2.5l9 3.8v6.6c0 5.6-3.7 10.5-9 12-5.3-1.5-9-6.4-9-12V6.3l9-3.8Z"
      fill="currentColor"
      fillOpacity="0.14"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    <rect
      x="11.6"
      y="8.5"
      width="4.8"
      height="7.4"
      rx="2.4"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M9 17.5a5 5 0 0 0 10 0"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
    <path
      d="M7.5 6.5l13 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

/** The dashboard, the descent trace drawn inside a card. */
export const MenuTrace = (p: P) => (
  <Svg {...p}>
    <rect
      x="2.5"
      y="4.5"
      width="23"
      height="19"
      rx="3.5"
      fill="currentColor"
      fillOpacity="0.12"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M6.5 12l3.5 5 3.5-3 3 4.5 4.5-9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="21" cy="9.5" r="2" fill="currentColor" />
  </Svg>
);

/** Hours and limits, a clock with the allowed window marked on its face. */
export const MenuHours = (p: P) => (
  <Svg {...p}>
    <circle
      cx="14"
      cy="14"
      r="10.5"
      fill="currentColor"
      fillOpacity="0.12"
      stroke="currentColor"
      strokeWidth="1.9"
    />
    {/* the permitted window, drawn as an arc on the dial */}
    <path
      d="M14 3.5a10.5 10.5 0 0 1 9.1 5.2"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
    <path
      d="M14 8v6.3l4 2.4"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** What we never keep, a waveform being deleted. */
export const MenuVoiceOff = (p: P) => (
  <Svg {...p}>
    {[
      { h: 6, o: 1 },
      { h: 12, o: 1 },
      { h: 17, o: 0.85 },
      { h: 11, o: 0.5 },
      { h: 6, o: 0.28 },
      { h: 3, o: 0.15 },
    ].map((b, i) => (
      <rect
        key={i}
        x={3 + i * 4}
        y={14 - b.h / 2}
        width={2.6}
        height={b.h}
        rx={1.3}
        fill="currentColor"
        opacity={b.o}
      />
    ))}
    <path
      d="M4 23.5h20"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeDasharray="2 3.5"
      opacity="0.5"
    />
  </Svg>
);

export const MENU_ICONS = {
  ladder: MenuLadder,
  profile: MenuProfile,
  shield: MenuShield,
  trace: MenuTrace,
  hours: MenuHours,
  voiceOff: MenuVoiceOff,
} as const;
