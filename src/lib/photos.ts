/**
 * PHOTOGRAPHY
 *
 * Real photographs from Unsplash, hotlinked from their CDN with sizing params
 * so we only ever pull what we render.
 *
 * ⚠️ Before this goes live, read this:
 *
 * The Unsplash licence grants commercial use of the *photograph*. It does not
 * grant a model release, that is explicitly the publisher's responsibility.
 * Using a recognisable child's face to advertise a children's product without
 * a release is a real risk, and the kind of thing that gets a startup a letter
 * rather than a lawsuit but is still worth avoiding.
 *
 * The selection is biased toward frames where the child isn't identifiable,
 * hands on blocks, a head bent over a book, a figure from behind, but three of
 * these do show a clear face, and they are flagged honestly below rather than
 * waved through. Swap every `identifiable: true` entry for a commissioned or
 * model-released shot before launch; the flags exist so that's a five-minute
 * job in one file rather than a hunt through JSX.
 */

export interface Photo {
  /** Unsplash photo id path (no query string). */
  url: string;
  alt: string;
  /** Is a face clearly recognisable? Drives what's safe to ship. */
  identifiable: boolean;
  credit: string;
}

export const PHOTOS = {
  blocks: {
    url: "https://images.unsplash.com/photo-1537655780520-1e392ead81f2",
    alt: "A grown-up and two small children playing with wooden letter blocks on a rug",
    identifiable: false,
    credit: "Unsplash",
  },
  pictureBook: {
    url: "https://images.unsplash.com/photo-1565843248736-8c41e6db117b",
    alt: "A young child looking down at an open picture book",
    // Face is clearly visible. Replace before launch.
    identifiable: true,
    credit: "Unsplash",
  },
  writing: {
    url: "https://images.unsplash.com/photo-1476950648868-16c7dca9499c",
    alt: "A child crouching outdoors, absorbed in something on the ground",
    identifiable: true,
    credit: "Unsplash",
  },
  readingTogether: {
    url: "https://images.unsplash.com/photo-1489702932289-406b7782113c",
    alt: "A child from behind, looking out over open ground",
    identifiable: false,
    credit: "Unsplash",
  },
  crafting: {
    url: "https://images.unsplash.com/photo-1637195141546-2469a5312504",
    alt: "A child's hands cutting coloured paper at a craft table",
    identifiable: false,
    credit: "Unsplash",
  },
  counting: {
    url: "https://images.unsplash.com/photo-1631032024590-140cc8dd4b32",
    alt: "A child working with coloured counting beads",
    identifiable: true,
    credit: "Unsplash",
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

/**
 * Build a sized, cropped, auto-formatted Unsplash URL.
 *
 * `auto=format` serves AVIF/WebP where supported, and asking for the exact
 * width we render avoids shipping a 4000px original to a 300px card.
 */
export function photoUrl(
  key: PhotoKey,
  { w = 800, h, q = 75 }: { w?: number; h?: number; q?: number } = {},
): string {
  const p = new URLSearchParams({
    auto: "format",
    fit: "crop",
    w: String(w),
    q: String(q),
  });
  if (h) p.set("h", String(h));
  return `${PHOTOS[key].url}?${p.toString()}`;
}
