"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { AppIcon, type AppIconName } from "@/components/app/AppIcons";
import { cn } from "@/components/ui/cn";

/**
 * APP SHELL
 *
 * The sidebar for the two adult working areas, admin and studio.
 *
 * Extracted rather than copied. There were already two hand-written rails,
 * ParentShell and ChildShell, and a third and fourth would have guaranteed
 * four slightly different collapse behaviours and four slightly different
 * active-state rules. Those two stay as they are because each is genuinely
 * tuned to its reader: the child rail has 48px targets and a bottom bar, the
 * parent rail carries a child switcher. Admin and studio have neither, so they
 * share this.
 *
 * Collapse state is keyed per area, so collapsing the admin rail does not
 * collapse the studio one. They are different jobs done on different days.
 */

export type NavItem = { href: string; label: string; icon: AppIconName };
export type NavGroup = { title: string; items: NavItem[] };

export function AppShell({
  area,
  title,
  subtitle,
  groups,
  accent = "ink",
  footer,
  children,
}: {
  /** Also the localStorage key for collapse. */
  area: string;
  /** Shown under the wordmark: which product surface this is. */
  title: string;
  subtitle?: string;
  groups: NavGroup[];
  /** The strip above the wordmark. Admin is not the same product as studio. */
  accent?: "ink" | "rose" | "green";
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(`primer:${area}-rail`) === "collapsed");
  }, [area]);

  function toggle() {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem(`primer:${area}-rail`, next ? "collapsed" : "open");
      return next;
    });
  }

  const root = groups[0]?.items[0]?.href ?? "/";
  const isActive = (href: string) =>
    href === root ? path === href : path.startsWith(href);

  const accentBar = {
    ink: "bg-ink",
    rose: "bg-rose",
    green: "bg-green",
  }[accent];

  const nav = (narrow: boolean) => (
    <div className="min-h-0 flex-1 space-y-6 overflow-y-auto">
      {groups.map((g) => (
        <div key={g.title}>
          {narrow ? (
            <p className="sr-only">{g.title}</p>
          ) : (
            <p className="eyebrow mb-2 px-2 text-ink-45">{g.title}</p>
          )}
          <nav aria-label={g.title}>
            <ul className="space-y-0.5">
              {g.items.map((n) => {
                const on = isActive(n.href);
                return (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      onClick={() => setDrawer(false)}
                      aria-current={on ? "page" : undefined}
                      title={narrow ? n.label : undefined}
                      className={cn(
                        "flex min-h-[2.75rem] items-center rounded-xl text-[0.9375rem] font-medium transition-colors",
                        narrow ? "justify-center px-0" : "gap-3 px-3",
                        on
                          ? "bg-ink text-white"
                          : "text-ink-70 hover:bg-grey-tint hover:text-ink",
                      )}
                    >
                      <AppIcon name={n.icon} size={19} />
                      <span className={narrow ? "sr-only" : undefined}>
                        {n.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-dvh bg-base">
      {/* ------------------------------------------------------ mobile bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-base/85 px-5 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2.5">
          <LogoMark size={26} />
          <span className="text-[0.9375rem] font-semibold text-ink">{title}</span>
        </div>
        <button
          type="button"
          onClick={() => setDrawer(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-grey-tint"
        >
          <span className="block h-[1.5px] w-[18px] rounded bg-ink" />
          <span className="block h-[1.5px] w-[18px] rounded bg-ink" />
          <span className="block h-[1.5px] w-[18px] rounded bg-ink" />
        </button>
      </header>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawer(false)}
            className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
          />
          <div className="absolute inset-y-0 left-0 flex w-[17rem] flex-col gap-5 overflow-y-auto border-r border-line bg-base p-5">
            <Logo size={26} />
            {nav(false)}
            {footer}
          </div>
        </div>
      )}

      <div className="lg:flex">
        {/* --------------------------------------------------- desktop rail */}
        <aside
          className={cn(
            "sticky top-0 hidden h-dvh shrink-0 flex-col overflow-x-hidden border-r border-line py-5 transition-[width] duration-200 lg:flex",
            collapsed ? "w-[4.75rem] px-3" : "w-[16rem] px-4",
          )}
        >
          {/* The accent bar is how you know at a glance which area you are in.
              Admin and studio are different products with the same brand, and
              a misplaced click in admin is expensive. */}
          <span
            aria-hidden
            className={cn("mb-4 block h-1 rounded-full", accentBar)}
          />

          <div
            className={cn(
              "mb-6 flex shrink-0 items-center border-b border-line pb-4",
              collapsed ? "justify-center" : "justify-between",
            )}
          >
            {!collapsed && (
              <Link href="/" className="min-w-0 px-2">
                <span className="flex items-center gap-2.5">
                  <LogoMark size={26} />
                  <span className="min-w-0">
                    <span className="block truncate text-[0.9375rem] font-semibold text-ink">
                      {title}
                    </span>
                    {subtitle && (
                      <span className="block truncate text-[0.75rem] text-ink-45">
                        {subtitle}
                      </span>
                    )}
                  </span>
                </span>
              </Link>
            )}
            <button
              type="button"
              onClick={toggle}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-45 transition-colors hover:bg-grey-tint hover:text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="16"
                  rx="2.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path d="M9.5 4v16" stroke="currentColor" strokeWidth="1.7" />
                <path
                  d={collapsed ? "M13.5 9.5 16 12l-2.5 2.5" : "M16.5 9.5 14 12l2.5 2.5"}
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {nav(collapsed)}

          {footer && !collapsed && (
            <div className="mt-5 shrink-0 border-t border-line pt-4">{footer}</div>
          )}
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
