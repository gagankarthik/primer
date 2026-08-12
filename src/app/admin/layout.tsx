import Link from "next/link";
import { AppShell, type NavGroup } from "@/components/app/AppShell";
import { SAFETY_FLAGS } from "@/lib/platform";

export const metadata = {
  title: { default: "Admin", template: "%s · Admin · Primer" },
  robots: { index: false, follow: false },
};

const GROUPS: NavGroup[] = [
  {
    title: "Run the platform",
    items: [
      { href: "/admin", label: "Overview", icon: "dashboard" },
      { href: "/admin/safety", label: "Safety queue", icon: "flag" },
      { href: "/admin/review", label: "Module review", icon: "review" },
    ],
  },
  {
    title: "People and money",
    items: [
      { href: "/admin/accounts", label: "Accounts", icon: "people" },
      { href: "/admin/revenue", label: "Revenue", icon: "money" },
      { href: "/admin/settings", label: "Settings", icon: "settings" },
    ],
  },
];

/**
 * ADMIN.
 *
 * A rose accent bar on the rail, which no other area uses. Admin actions are
 * the expensive ones on this platform (suspending an account, publishing a
 * module to every child on it), and the cheapest way to stop somebody doing
 * one while they think they are in studio is to make the two impossible to
 * confuse at a glance.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const open = SAFETY_FLAGS.filter((f) => !f.reviewed).length;

  return (
    <AppShell
      area="admin"
      title="Primer Admin"
      subtitle="internal"
      accent="rose"
      groups={GROUPS}
      footer={
        <div className="space-y-3">
          {open > 0 && (
            <Link
              href="/admin/safety"
              className="block rounded-xl bg-rose/10 px-3 py-2.5 text-[0.875rem] font-semibold text-rose transition-colors hover:bg-rose/15"
            >
              {open} flag{open === 1 ? "" : "s"} waiting
            </Link>
          )}
          <p className="px-1 text-[0.75rem] leading-snug text-ink-45">
            You cannot read a child&rsquo;s sessions here. Only a flag that has
            escalated opens the exchange it matched on.
          </p>
        </div>
      }
    >
      {children}
    </AppShell>
  );
}
