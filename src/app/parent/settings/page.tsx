import type { Metadata } from "next";
import { CHILD_LIST, getChild } from "@/lib/mock";
import { ParentShell } from "@/components/parent/ParentShell";
import { SettingsPanels } from "@/components/parent/SettingsPanels";

export const metadata: Metadata = {
  title: "Settings",
  // Nothing under /parent is indexed (see robots.ts), but the title is what a
  // parent sees in a tab they left open, so it still has to say where they are.
  robots: { index: false, follow: false },
};

/**
 * PARENT SETTINGS.
 *
 * ParentShell has linked here since it was written, and until now the link
 * 404'd. Everything on this page is a control a parent was promised during
 * onboarding: the hours, the daily cap, the PIN, and what happens to data.
 *
 * Grouped by the question being answered rather than by which part of the
 * system implements it. "When can they use it" and "how long for" belong on
 * screen together even if they are two different fields.
 */
export default async function ParentSettings({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const { child: param } = await searchParams;
  const child = getChild(param ?? "nell") ?? CHILD_LIST[0];

  return (
    <ParentShell childId={child.profile.childId}>
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-12">
        <header className="mb-8">
          <h1 className="text-[1.75rem] font-semibold tracking-[-0.03em] text-ink">
            Settings for {child.profile.displayName}
          </h1>
          <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-70">
            Changes take effect the next time {child.profile.displayName} opens
            the Primer. Anything set here applies to this child only.
          </p>
        </header>

        <SettingsPanels
          childName={child.profile.displayName}
          ageYears={child.profile.contextual.ageYears}
        />
      </main>
    </ParentShell>
  );
}
