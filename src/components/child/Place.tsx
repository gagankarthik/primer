import { cn } from "@/components/ui/cn";

/**
 * THE PLACE CHIP
 *
 * The number at the left of a leaderboard row.
 *
 * The top three are coloured, and everything below is not. That is a real
 * design tension worth stating: colouring a podium is the thing that turns
 * fourth place into "not on the podium", which is precisely the message a
 * children's board should avoid.
 *
 * It is here anyway, softened, because the alternative is worse. An entirely
 * flat list gives a child nothing to aim at, and a board with nothing to aim
 * at is just a list of names they scroll past. So:
 *
 *  - The colours are warm and quiet rather than metallic. Gold, slate and
 *    copper at low saturation, not a trophy graphic.
 *  - They stop at three and do not fade out gradually, so there is no visual
 *    gradient of worth running down the page.
 *  - "You" always wins the styling contest, whatever position it is in. A
 *    child scanning this page is looking for themselves first, and finding
 *    yourself should never be harder at position 40 than at position 2.
 */
export function Place({
  position,
  isMe,
  size = "md",
}: {
  position: number;
  isMe?: boolean;
  size?: "sm" | "md";
}) {
  const podium =
    position === 1
      ? "bg-amber/20 text-[#8A5A00] ring-1 ring-amber/40"
      : position === 2
        ? "bg-[#E4E8EF] text-[#4A5568] ring-1 ring-[#C2CAD6]"
        : position === 3
          ? "bg-[#F2DFD2] text-[#8A5230] ring-1 ring-[#DCBBA3]"
          : "bg-grey-tint text-ink-45";

  return (
    <span
      aria-hidden
      className={cn(
        "figure-num grid shrink-0 place-items-center rounded-full font-bold",
        size === "sm" ? "h-7 w-7 text-[0.8125rem]" : "h-9 w-9 text-[0.9375rem]",
        // You always reads as you, at any position.
        isMe ? "bg-indigo text-white ring-2 ring-indigo/30" : podium,
      )}
    >
      {position}
    </span>
  );
}
