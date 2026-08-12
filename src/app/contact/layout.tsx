import { SiteChrome } from "@/components/marketing/Chrome";

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome>{children}</SiteChrome>;
}
