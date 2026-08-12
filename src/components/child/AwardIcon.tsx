import { cn } from "@/components/ui/cn";

/**
 * AWARD ICONS
 *
 * The set in /public/icons: a podium, two trophies, two medals and a
 * graduation cap. Used only where the subject genuinely is an award, never as
 * general decoration; a trophy next to a paragraph about counting is noise.
 *
 * Rendered as a CSS mask rather than an <img>. The files are single-colour
 * fills baked to #86898C, so an <img> would put grey icons on pages that have
 * a palette. A mask makes the shape take `background-color`, which means they
 * inherit our tones the same way the hand-drawn icons do, and a locked or
 * disabled state can simply change the colour.
 *
 * The trade is that a masked element is not an image to a screen reader, which
 * is correct here: every one of these sits beside a heading that already says
 * what it is.
 */

export type AwardName =
  /** A 1-2-3 podium. The board. */
  | "podium"
  /** Filled trophy. Finishing something. */
  | "trophy"
  /** Star medal on a ribbon. Badges. */
  | "medal"
  /** Circle medal on a ribbon. Rank. */
  | "ribbon"
  /** Cap and scroll. Milestones, the things already behind them. */
  | "cap"
  /** Outline cup with a star. The top ten. */
  | "cup";

const FILES: Record<AwardName, string> = {
  podium: "32",
  trophy: "36",
  medal: "40",
  ribbon: "41",
  cap: "48",
  cup: "cup",
};

export function AwardIcon({
  name,
  size = 24,
  className,
}: {
  name: AwardName;
  size?: number;
  /** Set the colour with a text-* class; the mask paints in currentColor. */
  className?: string;
}) {
  const url = `url(/icons/${FILES[name]}.svg)`;

  return (
    <span
      aria-hidden
      className={cn("inline-block shrink-0 bg-current", className)}
      style={{
        width: size,
        height: size,
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

/** The icon in a tinted tile, matching the KPI treatment. */
export function AwardTile({
  name,
  tone = "indigo",
  size = 44,
}: {
  name: AwardName;
  tone?: "indigo" | "green" | "amber" | "rose";
  size?: number;
}) {
  const styles = {
    indigo: "bg-indigo-tint text-indigo",
    green: "bg-green-tint text-green",
    amber: "bg-amber/12 text-amber",
    rose: "bg-rose/10 text-rose",
  }[tone];

  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-xl", styles)}
      style={{ width: size, height: size }}
    >
      <AwardIcon name={name} size={Math.round(size * 0.55)} />
    </span>
  );
}
