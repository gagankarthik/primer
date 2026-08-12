"use client";

import Image from "next/image";
import { motion } from "motion/react";

/**
 * 404, "4 [character] 4"
 *
 * The character floats between the two digits, bobs continuously, and wobbles
 * on hover. This is the one place in the product where being playful is the
 * whole point: a lost five-year-old on an error page needs something friendly,
 * not an apology set in grey.
 *
 * The character is a Clay avatar vendored into /public (CC0 1.0, see
 * scripts/fetch-avatars.mjs). Deliberately not hotlinked: an error page that
 * depends on a third party being up is an error page that eventually renders a
 * broken-image icon.
 *
 * IMPLEMENTATION NOTE, read before "tidying" this into variants.
 *
 * The first version used a Motion variant container with staggerChildren. The
 * digits and all the copy stayed at `opacity: 0` forever: only the character,
 * which had its own `animate` array and so opted out of inheritance, appeared.
 * This is the same failure that hid the landing hero's headline and CTA.
 *
 * So: entrances are CSS keyframes with `both` fill, which cannot fail to
 * resolve, and Motion drives only the two things it's actually needed for,
 * the endless bob and the hover wobble. Content is never gated behind JS.
 */

const EASE = "cubic-bezier(.22,1,.36,1)";

export function LostCharacter({
  children,
  left = "4",
  right = "4",
}: {
  children: React.ReactNode;
  /** The two digits either side of the character. "4"/"4" here, "5"/"0" on the error page. */
  left?: string;
  right?: string;
}) {
  return (
    <div className="text-center">
      <div className="mb-8 flex items-center justify-center gap-3 sm:gap-6 md:mb-12">
        <span
          className="select-none text-[clamp(4.5rem,14vw,8.5rem)] font-bold leading-none tracking-[-0.05em] text-ink"
          style={{ animation: `slide-in-left 700ms ${EASE} both` }}
        >
          {left}
        </span>

        <motion.div
          // Bob forever; wobble and lift on hover. Both stop under
          // prefers-reduced-motion via the global rule in globals.css.
          animate={{ y: [-6, 6] }}
          transition={{
            duration: 2.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          whileHover={{ scale: 1.12, rotate: [0, -6, 6, -6, 0] }}
          className="cursor-grab active:cursor-grabbing"
          style={{ animation: `pop-in 620ms ${EASE} 160ms both` }}
        >
          <Image
            src="/avatars/misc/lost-primer.svg"
            alt=""
            width={140}
            height={140}
            priority
            draggable={false}
            className="h-[84px] w-[84px] select-none object-contain drop-shadow-[0_14px_30px_rgba(11,18,32,0.16)] sm:h-[120px] sm:w-[120px] md:h-[140px] md:w-[140px]"
          />
        </motion.div>

        <span
          className="select-none text-[clamp(4.5rem,14vw,8.5rem)] font-bold leading-none tracking-[-0.05em] text-ink"
          style={{ animation: `slide-in-right 700ms ${EASE} both` }}
        >
          {right}
        </span>
      </div>

      <div style={{ animation: `rise 600ms ${EASE} 260ms both` }}>{children}</div>
    </div>
  );
}
