/**
 * Vendor DiceBear avatars into /public.
 *
 * Run once (`node scripts/fetch-avatars.mjs`), commit the output, and the app
 * never talks to DiceBear again.
 *
 * Why vendor rather than hotlink the HTTP API:
 *  - The seed is the thing that makes an avatar stable, and the natural seed is
 *    the child's name or the module id. Sending those to a third party on every
 *    page view is a needless leak for a children's product.
 *  - No third-party availability or rate limits in the render path.
 *  - No layout shift while a remote SVG resolves.
 *
 * Licensing checked before vendoring: Clay is CC0 1.0 (public domain, no
 * attribution required). Voxel Bot is recorded below with whatever its page
 * states — verify before shipping if you swap styles.
 *
 * Neither style ships in @dicebear/collection v9, which is why this fetches
 * from the HTTP API rather than generating locally.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "avatars");
const API = "https://api.dicebear.com/10.x";

/** Module ids — kept in sync with src/lib/modules.ts by hand. */
const MODULE_SEEDS = [
  "counting",
  "number-bonds",
  "adding",
  "subtracting",
  "times-tables",
  "dividing",
  "letter-sounds",
  "blending",
  "rhyming",
];

/** Child ids from the fixtures. */
const CHILD_SEEDS = ["nell", "harv"];

const JOBS = [
  ...MODULE_SEEDS.map((seed) => ({ style: "voxel-bot", seed, dir: "modules" })),
  ...CHILD_SEEDS.map((seed) => ({ style: "clay", seed, dir: "children" })),
];

async function fetchOne({ style, seed, dir }) {
  const url = `${API}/${style}/svg?seed=${encodeURIComponent(seed)}&radius=50`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${style}/${seed} → HTTP ${res.status}`);
  }
  const svg = await res.text();
  if (!svg.trimStart().startsWith("<svg")) {
    throw new Error(`${style}/${seed} → not an SVG (got ${svg.slice(0, 60)})`);
  }
  const target = join(OUT, dir);
  await mkdir(target, { recursive: true });
  await writeFile(join(target, `${seed}.svg`), svg, "utf8");
  return `${dir}/${seed}.svg  (${(svg.length / 1024).toFixed(1)} KB)`;
}

const results = await Promise.allSettled(JOBS.map(fetchOne));

let ok = 0;
for (const [i, r] of results.entries()) {
  if (r.status === "fulfilled") {
    ok += 1;
    console.log("  ✓", r.value);
  } else {
    console.error("  ✗", JOBS[i].style, JOBS[i].seed, "—", r.reason.message);
  }
}
console.log(`\n${ok}/${JOBS.length} avatars written to public/avatars`);
if (ok < JOBS.length) process.exitCode = 1;
