import type { MetadataRoute } from "next";
import { MODULES } from "@/lib/modules";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theprimer.app";

/**
 * Sitemap.
 *
 * Only public, indexable pages. The app itself is deliberately absent:
 * /learning and /parent are behind an account, hold a child's data, and would
 * be a privacy problem in a search index rather than a traffic win. Same for
 * /onboarding, which is meaningless without an account.
 *
 * Module pages are the long tail worth having: a parent searching "how to teach
 * blending sounds" should land on the module that does it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/features`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/modules`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/signup`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE}/signin`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const modules: MetadataRoute.Sitemap = MODULES.map((m) => ({
    url: `${SITE}/modules/${m.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...core, ...modules];
}
