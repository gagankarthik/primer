"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { PHOTOS, photoUrl, type PhotoKey } from "@/lib/photos";
import { SPRING_SNAP } from "@/lib/motion";
import { cn } from "@/components/ui/cn";

/**
 * HERO COLLAGE
 *
 * Five tilted, overlapping cards, the arrangement a contact sheet falls into
 * when you fan it across a table. Several moments at once, so a parent sees the
 * range of the product before reading a word.
 *
 * All five are photographs, and getting here took two corrections. The first
 * version used abstract module art in two slots; it read as blank boxes,
 * because cover art that works at 300px on a catalogue card disappears at 90px
 * behind a border. The replacement was a drawn app screen, which failed the
 * same way for a different reason: at this size its interface reduces to pale
 * grey bars on white, which is indistinguishable from a loading skeleton. It
 * was reported as a missing image, which is exactly right.
 *
 * The lesson both times: this component renders at roughly 90 to 170px wide.
 * Only photographs survive that. The product screen earns its place further
 * down the page at a size where it can actually be read.
 *
 * The middle card is largest and untilted: a fan where everything is rotated
 * has no centre for the eye to land on.
 */

type Card = { photo: PhotoKey; rotate: number; y: number; scale: number };

const CARDS: Card[] = [
  { photo: "blocks", rotate: -8, y: 16, scale: 0.86 },
  { photo: "crafting", rotate: 4, y: 4, scale: 0.95 },
  { photo: "pictureBook", rotate: 0, y: -10, scale: 1.1 },
  { photo: "counting", rotate: -5, y: 4, scale: 0.95 },
  { photo: "readingTogether", rotate: 9, y: 18, scale: 0.86 },
];

export function Collage() {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {CARDS.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40, rotate: c.rotate * 2 }}
          animate={{ opacity: 1, y: c.y, rotate: c.rotate }}
          transition={{ ...SPRING_SNAP, delay: 0.08 * i }}
          whileHover={{ y: c.y - 12, rotate: 0, scale: c.scale * 1.04, zIndex: 20 }}
          style={{ scale: c.scale }}
          className={cn(
            "relative aspect-[3/4] w-[19%] shrink-0 overflow-hidden rounded-2xl border-[3px] border-white bg-grey-tint shadow-pop sm:rounded-3xl sm:border-4",
            i === 2 ? "z-[5]" : i === 1 || i === 3 ? "z-[3]" : "z-[1]",
          )}
        >
          <Image
            src={photoUrl(c.photo, { w: 520, h: 700, q: 72 })}
            alt={PHOTOS[c.photo].alt}
            fill
            // Cards are ~19% of a 1152px container on desktop. Telling the
            // optimiser this stops it shipping a desktop crop to a phone.
            sizes="(max-width: 640px) 22vw, 230px"
            className="object-cover"
            priority={i === 2}
          />
          {/*
            A hairline inside the frame. Two of these photos are light at the
            edges and would otherwise dissolve into the page background.
          */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-ink/[0.06]"
          />
        </motion.div>
      ))}
    </div>
  );
}
