import type { DraftStatus } from "@/lib/platform";

/**
 * One mapping from module status to how it is labelled, shared by every studio
 * screen. Four screens each deciding what "changes" is called is how you end
 * up with "Rejected" on one page and "Needs work" on another, describing the
 * same state, which a creator reads as two different outcomes.
 *
 * Note the wording: "Changes asked for", never "Rejected". The module is not
 * refused; a person read it and wants something specific different, and the
 * label should say that.
 */
export const STATUS: Record<
  DraftStatus,
  { label: string; tone: "neutral" | "indigo" | "green" | "amber" | "rose" }
> = {
  draft: { label: "Draft", tone: "neutral" },
  waiting: { label: "In review", tone: "indigo" },
  changes: { label: "Changes asked for", tone: "amber" },
  live: { label: "Live", tone: "green" },
};
