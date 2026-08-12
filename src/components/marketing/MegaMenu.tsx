"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "@/components/brand/Logo";
import { ModuleArt } from "@/components/modules/ModuleArt";
import { IconTile } from "@/components/ui/Icons";
import { MENU_ICONS } from "@/components/ui/MenuIcons";
import { MODULES, GROUPS } from "@/lib/modules";
import { SPRING_UI } from "@/lib/motion";
import { toneBg } from "@/lib/tone";
import { cn } from "@/components/ui/cn";

/**
 * MEGA MENU
 *
 * Nav items are named for what's behind them ("How it works", "Modules", "For
 * parents") rather than umbrella words like "Product" or "Resources",
 * specificity is what makes navigation predictable.
 *
 * Motion follows the fluid-interface rules: the panel scales from its own
 * trigger (anchored origin, so the spatial relationship between button and
 * content is obvious), opens on a critically damped spring, and can be
 * redirected to another panel mid-flight without waiting for the first to
 * finish. Moving between triggers swaps content in place rather than closing
 * and reopening, which is what makes it feel like one surface.
 */

type PanelKey = "how" | "modules" | "parents";

const HOW_LINKS = [
  {
    href: "/features",
    Icon: MENU_ICONS.ladder,
    title: "The scaffold ladder",
    body: "Six rungs between a question and an answer.",
  },
  {
    href: "/features#profile",
    Icon: MENU_ICONS.profile,
    title: "The learner profile",
    body: "Five things we track, and how far to trust each.",
  },
  {
    href: "/features#safety",
    Icon: MENU_ICONS.shield,
    title: "Safety and privacy",
    body: "No voice kept. Nothing trains a model.",
  },
];

const PARENT_LINKS = [
  {
    href: "/parent",
    Icon: MENU_ICONS.trace,
    title: "Your dashboard",
    body: "One sentence a week, with the evidence under it.",
  },
  {
    href: "/parent/settings",
    Icon: MENU_ICONS.hours,
    title: "Hours and limits",
    body: "When they can use it, and how long for.",
  },
  {
    href: "/features#safety",
    Icon: MENU_ICONS.voiceOff,
    title: "What we never keep",
    body: "Audio is transcribed and destroyed on the way through.",
  },
];

export function MegaMenu() {
  const [open, setOpen] = useState<PanelKey | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes, and focus leaving the whole nav closes. Both are required
  // for this to be usable without a mouse.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /** Small grace period so a diagonal cursor path to the panel doesn't close it. */
  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  const trigger = (key: PanelKey, label: string) => (
    <button
      type="button"
      onMouseEnter={() => {
        cancelClose();
        setOpen(key);
      }}
      onFocus={() => setOpen(key)}
      onClick={() => setOpen((o) => (o === key ? null : key))}
      aria-expanded={open === key}
      aria-haspopup="true"
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[0.875rem] font-medium transition-colors",
        open === key ? "bg-grey-tint text-ink" : "text-ink-70 hover:text-ink",
      )}
    >
      {label}
      {/* A drawn chevron, not the "▾" glyph. The character renders at a
          different weight and baseline in every font, so it never quite lines
          up with the label, and it can't inherit the stroke weight the rest
          of the icon set uses. */}
      <motion.svg
        aria-hidden
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        animate={{ rotate: open === key ? 180 : 0 }}
        transition={SPRING_UI}
        className={open === key ? "text-ink" : "text-ink-45"}
      >
        <path
          d="M2.75 4.5L6 7.75L9.25 4.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </button>
  );

  return (
    <header
      ref={navRef}
      onMouseLeave={scheduleClose}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-200",
        scrolled || open
          ? "border-b border-line bg-base/85 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[88rem] items-center justify-between px-5 py-3.5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Primer home" onFocus={() => setOpen(null)}>
          <Logo size={30} />
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Main">
          {trigger("how", "How it works")}
          {trigger("modules", "Modules")}
          {trigger("parents", "For parents")}
          <Link
            href="/pricing"
            onMouseEnter={scheduleClose}
            onFocus={() => setOpen(null)}
            className="rounded-lg px-3.5 py-2 text-[0.875rem] font-medium text-ink-70 transition-colors hover:text-ink"
          >
            Pricing
          </Link>
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <Link
            href="/signin"
            onFocus={() => setOpen(null)}
            className="rounded-lg px-3.5 py-2 text-[0.875rem] font-medium text-ink-70 transition-colors hover:text-ink"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-indigo px-4 py-2 text-[0.875rem] font-semibold text-white shadow-[0_2px_10px_rgba(61,78,232,0.35)] transition-all hover:bg-indigo-hi hover:shadow-[0_4px_16px_rgba(61,78,232,0.45)] active:scale-[0.98]"
          >
            Try it free
          </Link>
        </div>

        <Link
          href="/signup"
          className="rounded-lg bg-ink px-4 py-2 text-[0.8125rem] font-medium text-white md:hidden"
        >
          Start free
        </Link>
      </div>

      {/* ----------------------------------------------------------- panel
          A floating card sized to its content, not a full-bleed bar. A panel
          that spans the viewport to hold three links reads as a website
          template; one that hugs its content reads as a control. */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: -6, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.985 }}
            transition={SPRING_UI}
            onMouseEnter={cancelClose}
            style={{ transformOrigin: "top center" }}
            className="absolute left-1/2 top-full hidden -translate-x-1/2 pt-2 md:block"
          >
            <div className="w-max max-w-[min(92vw,64rem)] overflow-hidden rounded-2xl border border-line bg-base/95 p-3 shadow-pop backdrop-blur-xl">
              {open === "how" && <LinkGrid links={HOW_LINKS} />}
              {open === "parents" && <LinkGrid links={PARENT_LINKS} />}
              {open === "modules" && <ModulesPanel />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* --------------------------------------------------------------------- */

function LinkGrid({
  links,
}: {
  links: { href: string; Icon: Parameters<typeof IconTile>[0]["Icon"]; title: string; body: string }[];
}) {
  return (
    <ul className="grid w-[46rem] gap-1 md:grid-cols-3">
      {links.map((l) => (
        <li key={l.title}>
          <Link
            href={l.href}
            className="flex h-full gap-3.5 rounded-xl p-4 transition-colors hover:bg-grey-tint"
          >
            <IconTile Icon={l.Icon} size={48} />
            <span className="min-w-0">
              <span className="block text-[0.9375rem] font-semibold text-ink">
                {l.title}
              </span>
              <span className="mt-1 block text-[0.875rem] leading-snug text-ink-45">
                {l.body}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ModulesPanel() {
  const groups = ["numbers", "arithmetic", "letters"] as const;

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[1fr_auto]">
      <div className="grid gap-8 sm:grid-cols-3">
        {groups.map((g) => (
          <div key={g}>
            <p className="eyebrow mb-3 text-ink-45">{GROUPS[g].label}</p>
            <ul className="space-y-1">
              {MODULES.filter((m) => m.group === g).map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/modules/${m.id}`}
                    className="block rounded-lg px-3 py-2 text-[0.875rem] text-ink-70 transition-colors hover:bg-grey-tint hover:text-ink"
                  >
                    {m.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Featured module, a menu should show the thing, not just list it. */}
      <Link
        href={`/modules/${MODULES[7].id}`}
        className="group hidden w-64 shrink-0 overflow-hidden rounded-2xl border border-line bg-surface shadow-tight transition-all hover:-translate-y-0.5 hover:shadow-lift lg:block"
      >
        <span className={toneBg(MODULES[7].tone)}>
          <ModuleArt
            art={MODULES[7].art}
            tone={MODULES[7].tone}
            className="h-24 w-full"
          />
        </span>
        <span className="block p-4">
          <span className="eyebrow text-indigo">most loved</span>
          <span className="mt-1.5 block text-[0.9375rem] font-semibold text-ink">
            {MODULES[7].title}
          </span>
          <span className="mt-1 block text-[0.8125rem] leading-snug text-ink-45">
            {MODULES[7].blurb}
          </span>
        </span>
      </Link>
      </div>

      {/* One way into the full catalogue, under the list rather than in it. */}
      <div className="mt-3 border-t border-line pt-3">
        <Link
          href="/modules"
          className="group inline-flex items-center gap-2.5 rounded-xl bg-indigo-tint px-4 py-2.5 text-[0.875rem] font-semibold text-indigo transition-colors hover:bg-indigo hover:text-white"
        >
          See all {MODULES.length} modules
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            &rarr;
          </span>
        </Link>
      </div>
    </div>
  );
}
