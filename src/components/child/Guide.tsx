"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/components/ui/cn";

/**
 * THE GUIDE.
 *
 * Each module has its own character, vendored from DiceBear into
 * /public/avatars/modules (see scripts/fetch-avatars.mjs). One face per
 * subject rather than one mascot for everything: a child who has done
 * "Counting to 20" three times recognises that character before they can read
 * the title, which is how a five-year-old navigates a shelf.
 *
 * They are local files, never fetched at runtime. Hotlinking an avatar service
 * would send the module id, and eventually a child's name as a seed, to a
 * third party on every session.
 *
 * The guide is not decoration: it is who is talking. Explanations sit in a
 * speech bubble attached to it, so a child can see that a voice belongs to
 * somebody, and the "it asks, you answer" contract has a face on it. It nods
 * while speaking and sits still otherwise.
 */
export function Guide({
  moduleId,
  size = 76,
  speaking = false,
  className,
}: {
  moduleId: string;
  size?: number;
  /** Bobs while its line is on screen. Stops when the child is being asked. */
  speaking?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      animate={speaking ? { y: [-3, 3] } : { y: 0 }}
      transition={
        speaking
          ? { duration: 1.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
          : { duration: 0.3 }
      }
      className={cn("shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={`/avatars/modules/${moduleId}.svg`}
        alt=""
        width={size}
        height={size}
        priority
        draggable={false}
        className="h-full w-full select-none object-contain drop-shadow-[0_8px_18px_rgba(11,18,32,0.12)]"
      />
    </motion.div>
  );
}

/**
 * The guide with its line beside it. The tail points at the character so the
 * attribution is unambiguous without a name label.
 */
export function GuideSays({
  moduleId,
  title,
  body,
  tone,
  speaking = true,
}: {
  moduleId: string;
  title?: string;
  body: string;
  tone: "indigo" | "green" | "amber" | "rose";
  speaking?: boolean;
}) {
  const soft = {
    indigo: "bg-indigo-tint",
    green: "bg-green-tint",
    amber: "bg-amber/10",
    rose: "bg-rose/8",
  }[tone];

  return (
    <div className="flex items-start gap-3 sm:gap-4">
      <Guide moduleId={moduleId} size={64} speaking={speaking} />

      <div className={cn("relative flex-1 rounded-2xl px-5 py-4", soft)}>
        {/* Tail. A rotated square rather than a border trick, so it inherits
            the bubble's exact background whatever the tone is. */}
        <span
          aria-hidden
          className={cn(
            "absolute -left-1.5 top-6 h-3 w-3 rotate-45 rounded-[2px]",
            soft,
          )}
        />
        {title && (
          <p className="text-[1.0625rem] font-bold leading-tight text-ink sm:text-[1.1875rem]">
            {title}
          </p>
        )}
        <p
          className={cn(
            "text-[1rem] leading-[1.5] text-ink-70 sm:text-[1.0625rem]",
            title && "mt-1.5",
          )}
          style={{ fontFamily: "var(--font-read)" }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}
