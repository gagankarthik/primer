import Link from "next/link";
import { AppShell, type NavGroup } from "@/components/app/AppShell";

export const metadata = {
  title: { default: "Studio", template: "%s · Studio · Primer" },
  robots: { index: false, follow: false },
};

const GROUPS: NavGroup[] = [
  {
    title: "Your work",
    items: [
      { href: "/studio", label: "Overview", icon: "dashboard" },
      { href: "/studio/courses", label: "My modules", icon: "modules" },
      { href: "/studio/insights", label: "How they land", icon: "insights" },
    ],
  },
  {
    title: "Your account",
    items: [
      { href: "/studio/payouts", label: "Payouts", icon: "money" },
      { href: "/studio/profile", label: "Profile", icon: "profile" },
      { href: "/studio/guide", label: "Writing guide", icon: "help" },
    ],
  },
];

/**
 * STUDIO, where a creator writes modules.
 *
 * Green accent, against admin's rose, because the two are different products
 * with the same brand and an admin action is expensive in a way a studio
 * action is not.
 *
 * The footer states the access boundary rather than leaving it implied. A
 * creator writing for children will reasonably assume they can see how a
 * particular child got on, and the answer is no: everything on this side is
 * aggregated, and there is no screen anywhere in studio that resolves to a
 * person.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell
      area="studio"
      title="Primer Studio"
      subtitle="for creators"
      accent="green"
      groups={GROUPS}
      footer={
        <div className="space-y-3">
          <Link
            href="/studio/courses/new"
            className="block rounded-xl bg-ink px-3 py-2.5 text-center text-[0.875rem] font-semibold text-white transition-colors hover:bg-ink/88"
          >
            New module
          </Link>
          <p className="px-1 text-[0.75rem] leading-snug text-ink-45">
            You never see a named child, a transcript, or a household. Everything
            here is aggregated across every learner who used a module.
          </p>
        </div>
      }
    >
      {children}
    </AppShell>
  );
}
