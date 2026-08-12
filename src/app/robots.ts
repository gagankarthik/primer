import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theprimer.app";

/**
 * Robots.
 *
 * The app surfaces are disallowed, not because they are secret (they are behind
 * auth) but because a crawler following a stale link should not be generating
 * requests against a child's session, and nothing there is useful in a search
 * result.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/learning/",
          "/parent/",
          "/admin",
          "/studio",
          "/onboarding",
          "/api/",
        ],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
