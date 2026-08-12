"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { PARENT_ICONS } from "@/components/parent/ParentIcons";
import { cn } from "@/components/ui/cn";
import { CHILD_LIST } from "@/lib/mock";

/**
 * PARENT AREA chrome.
 *
 * Deliberately different furniture from both the marketing site and the child
 * app. A parent arriving here has a job to do, so this reads as an application.
 *
 * It was a row of three tabs when there were three pages. At seven it became a
 * sidebar: a horizontal nav that wraps, or scrolls sideways, stops telling you
 * where you are, which is the only thing a nav is for. The sidebar also gives
 * the two groups somewhere to live, "about the children" above, "about your
 * account" below, which a single row cannot express.
 *
 * Below `lg` the sidebar becomes a drawer. Same links, same order, same
 * grouping, so the mental model survives the breakpoint.
 */

type Item = { href: string; label: string; icon: keyof typeof PARENT_ICONS };

const CHILD_NAV: Item[] = [
  { href: "/parent", label: "Dashboard", icon: "dashboard" },
  { href: "/parent/learners", label: "Learners", icon: "learners" },
  { href: "/parent/courses", label: "Courses", icon: "courses" },
];

const ACCOUNT_NAV: Item[] = [
  { href: "/parent/profile", label: "Profile", icon: "profile" },
  { href: "/parent/payments", label: "Payments", icon: "payments" },
  { href: "/parent/settings", label: "Settings", icon: "settings" },
  { href: "/parent/help", label: "Help & support", icon: "help" },
];

export function ParentShell({
  childId,
  children,
  /** Off for account pages, which are not scoped to one child. */
  showChildSwitcher = true,
}: {
  childId: string;
  children: React.ReactNode;
  showChildSwitcher?: boolean;
}) {
  const path = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Restored from localStorage rather than defaulted every load. Someone who
  // collapses the rail wants it collapsed tomorrow too; re-expanding it on
  // every visit is the app overruling a decision the user already made.
  useEffect(() => {
    setCollapsed(localStorage.getItem("primer:parent-rail") === "collapsed");
  }, []);

  function toggleRail() {
    setCollapsed((c) => {
      const next = !c;
      localStorage.setItem("primer:parent-rail", next ? "collapsed" : "open");
      return next;
    });
  }

  function isActive(href: string) {
    return href === "/parent" ? path === "/parent" : path.startsWith(href);
  }

  /** The drawer is always labelled, however the desktop rail is set. */
  const nav = (railCollapsed: boolean) => (
    <>
      <NavGroup
        title="The children"
        items={CHILD_NAV}
        isActive={isActive}
        childId={childId}
        collapsed={railCollapsed}
        onNavigate={() => setDrawer(false)}
      />
      <NavGroup
        title="Your account"
        items={ACCOUNT_NAV}
        isActive={isActive}
        childId={childId}
        collapsed={railCollapsed}
        onNavigate={() => setDrawer(false)}
      />
    </>
  );

  return (
    <div className="min-h-dvh bg-base">
      {/* ---------------------------------------------------- mobile bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-base/85 px-5 py-3 backdrop-blur-xl lg:hidden">
        <Link href="/" aria-label="Primer home">
          <Logo size={26} />
        </Link>
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
          <div className="absolute inset-y-0 left-0 flex w-[17rem] flex-col gap-6 overflow-y-auto border-r border-line bg-base p-5">
            <Logo size={26} />
            {nav(false)}
          </div>
        </div>
      )}

      <div className="lg:flex">
        {/* ------------------------------------------------- desktop rail */}
        <aside
          className={cn(
            "sticky top-0 hidden h-dvh shrink-0 flex-col gap-7 overflow-y-auto overflow-x-hidden border-r border-line py-6 transition-[width] duration-200 lg:flex",
            collapsed ? "w-[4.75rem] px-3" : "w-[16rem] px-5",
          )}
        >
          <div
            className={cn(
              "flex items-center",
              collapsed ? "justify-center" : "justify-between px-2",
            )}
          >
            {!collapsed && (
              <Link href="/" aria-label="Primer home">
                <Logo size={28} />
              </Link>
            )}
            <button
              type="button"
              onClick={toggleRail}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              className="grid h-8 w-8 place-items-center rounded-lg text-ink-45 transition-colors hover:bg-grey-tint hover:text-ink"
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
                <path
                  d="M9.5 4v16"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                {/* The chevron points the way the panel will move. */}
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

          <Link
            href="/learning"
            title={collapsed ? "Open the child view" : undefined}
            className={cn(
              "mt-auto rounded-xl bg-indigo-tint text-[0.875rem] font-medium text-indigo transition-colors hover:bg-indigo hover:text-white",
              collapsed ? "grid h-11 place-items-center" : "px-4 py-3",
            )}
          >
            {collapsed ? <span aria-hidden>&rarr;</span> : "Open the child view →"}
            {collapsed && <span className="sr-only">Open the child view</span>}
          </Link>
        </aside>

        <div className="min-w-0 flex-1">
          {showChildSwitcher && (
            <ChildSwitcher childId={childId} path={path} />
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------- nav */

function NavGroup({
  title,
  items,
  isActive,
  childId,
  collapsed,
  onNavigate,
}: {
  title: string;
  items: Item[];
  isActive: (href: string) => boolean;
  childId: string;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  return (
    <div>
      {collapsed ? (
        // The heading still exists for screen readers when the rail is narrow;
        // only the visible text goes, not the structure.
        <p className="sr-only">{title}</p>
      ) : (
        <p className="eyebrow mb-2 px-2 text-ink-45">{title}</p>
      )}
      <nav aria-label={title}>
        <ul className="space-y-0.5">
          {items.map((n) => {
            const active = isActive(n.href);
            const Icon = PARENT_ICONS[n.icon];
            // Account pages are not per-child, so they don't carry the param.
            const href = CHILD_NAV.some((c) => c.href === n.href)
              ? `${n.href}?child=${childId}`
              : n.href;
            return (
              <li key={n.href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  // A native tooltip when the label is hidden. Not elegant, but
                  // an icon rail with no way to check what an icon means is a
                  // memory test, and this one is free and works everywhere.
                  title={collapsed ? n.label : undefined}
                  className={cn(
                    "flex items-center rounded-xl py-2.5 text-[0.9375rem] font-medium transition-colors",
                    collapsed ? "justify-center px-0" : "gap-3 px-3",
                    active
                      ? "bg-ink text-white"
                      : "text-ink-70 hover:bg-grey-tint hover:text-ink",
                  )}
                >
                  <Icon size={18} />
                  <span className={collapsed ? "sr-only" : undefined}>
                    {n.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

/* -------------------------------------------------------- child switcher */

function ChildSwitcher({ childId, path }: { childId: string; path: string }) {
  const params = useSearchParams();

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3 sm:px-8">
      <span className="mr-1 text-[0.8125rem] text-ink-45">Viewing</span>
      {CHILD_LIST.map((c, i) => {
        const on = c.profile.childId === childId;
        // Switches child without leaving the page. It used to hard-link to
        // /parent, so changing child from any sub-page threw away the screen.
        const next = new URLSearchParams(params.toString());
        next.set("child", c.profile.childId);
        return (
          <Link
            key={c.profile.childId}
            href={`${path}?${next.toString()}`}
            aria-current={on ? "true" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-full border py-1 pl-1 pr-3.5 text-[0.8125rem] font-medium transition-all",
              on
                ? "border-ink bg-ink text-white"
                : "border-line bg-surface text-ink-45 hover:border-line-strong hover:text-ink",
            )}
          >
            <span
              className={cn(
                "grid h-6 w-6 place-items-center rounded-full text-[0.6875rem] font-semibold text-white",
                ["bg-indigo", "bg-green", "bg-amber", "bg-rose"][i % 4],
              )}
              aria-hidden
            >
              {c.profile.displayName[0]}
            </span>
            {c.profile.displayName}
          </Link>
        );
      })}
    </div>
  );
}
