import { SiteChrome } from "@/components/marketing/Chrome";

/**
 * This file used to be untouched `create-next-app` scaffolding: it declared its
 * own <html> and <body> inside the root layout's, and set the page title to
 * "Next.js". That is why the modules pages rendered without the site fonts and
 * without a header, and why they looked like a different website.
 *
 * It now does the one thing a nested layout should do here, which is give every
 * /modules route the same chrome as the rest of the public site.
 */
export default function ModulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome>{children}</SiteChrome>;
}
