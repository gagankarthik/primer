/**
 * Tone → class mapping. Single source of truth.
 *
 * These strings were previously duplicated across the module card, the child
 * home, the parent dashboard and the play session, which meant a palette change
 * had to be made in four places and was wrong in at least one of them. Every
 * surface now resolves colour through here.
 *
 * Tailwind scans source for complete class names, so the classes are written
 * out in full rather than composed from a template string, an interpolated
 * `bg-${tone}-tint` would be silently purged from the build.
 */

export type Tone = "indigo" | "green" | "amber" | "rose";

/** Tinted background, used behind cover art and on module surfaces. */
export function toneBg(tone: Tone): string {
  switch (tone) {
    case "indigo":
      return "bg-indigo-tint";
    case "green":
      return "bg-green-tint";
    case "amber":
      return "bg-amber/10";
    case "rose":
      return "bg-rose/8";
  }
}

/** Solid fill, primary buttons and the child's talk control. */
export function toneSolid(tone: Tone): string {
  switch (tone) {
    case "indigo":
      return "bg-indigo";
    case "green":
      return "bg-green";
    case "amber":
      return "bg-amber";
    case "rose":
      return "bg-rose";
  }
}

/** Chip, small category labels sitting on a tinted ground. */
export function toneChip(tone: Tone): string {
  switch (tone) {
    case "indigo":
      return "bg-indigo/10 text-indigo";
    case "green":
      return "bg-green/12 text-green";
    case "amber":
      return "bg-amber/15 text-[#8A5B00]";
    case "rose":
      return "bg-rose/10 text-rose";
  }
}

/** Progress fill. */
export function toneBar(tone: Tone): string {
  return toneSolid(tone);
}

/** Text colour on a light ground. */
export function toneText(tone: Tone): string {
  switch (tone) {
    case "indigo":
      return "text-indigo";
    case "green":
      return "text-green";
    case "amber":
      return "text-[#8A5B00]";
    case "rose":
      return "text-rose";
  }
}
