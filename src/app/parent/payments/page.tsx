import type { Metadata } from "next";
import Link from "next/link";
import { CHILD_LIST } from "@/lib/mock";
import { ParentShell } from "@/components/parent/ParentShell";
import { PageHead, Panel, Row } from "@/components/parent/Layout";

export const metadata: Metadata = {
  title: "Payments",
  robots: { index: false, follow: false },
};

/**
 * BILLING.
 *
 * Written to be boring and complete. The two things people actually come to a
 * billing page for are "what am I paying and when next" and "how do I stop",
 * so both are above the fold and neither is hidden behind a support email.
 *
 * Card details are never entered or displayed here beyond the last four digits;
 * the change-card flow hands off to the payment provider's own form.
 */

const INVOICES = [
  { id: "INV-2026-08", date: "1 August 2026", amount: "$15.00", plan: "Family, monthly" },
  { id: "INV-2026-07", date: "1 July 2026", amount: "$15.00", plan: "Family, monthly" },
  { id: "INV-2026-06", date: "1 June 2026", amount: "$15.00", plan: "Family, monthly" },
  { id: "INV-2026-05", date: "1 May 2026", amount: "$0.00", plan: "Free trial" },
];

export default function Payments() {
  return (
    <ParentShell
      childId={CHILD_LIST[0].profile.childId}
      showChildSwitcher={false}
    >
      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-12">
        <PageHead
          title="Payments"
          blurb="What you are on, when it renews, and every receipt. No contract, and cancelling takes one click on this page."
        />

        <div className="space-y-6">
          <Panel>
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="eyebrow mb-2 text-indigo">current plan</p>
                <p className="text-2xl font-semibold tracking-[-0.02em] text-ink">
                  Family
                </p>
                <p className="mt-1.5 text-[0.9375rem] text-ink-70">
                  $15 a month, one child, unlimited sessions. Renews 1 September
                  2026.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/pricing"
                  className="rounded-lg bg-ink px-4 py-2.5 text-[0.875rem] font-medium text-white hover:bg-ink/88"
                >
                  Change plan
                </Link>
                <button
                  type="button"
                  className="rounded-lg border border-line-strong bg-base px-4 py-2.5 text-[0.875rem] font-medium text-ink shadow-tight hover:border-ink/25"
                >
                  Cancel
                </button>
              </div>
            </div>

            <p className="mt-6 rounded-xl bg-indigo-tint px-4 py-3 text-[0.875rem] leading-relaxed text-ink-70">
              You have {CHILD_LIST.length} learners set up and Family covers one.{" "}
              <Link
                href="/pricing"
                className="font-medium text-indigo underline underline-offset-4"
              >
                Household
              </Link>{" "}
              is $29 and covers up to four.
            </p>
          </Panel>

          <Panel
            title="How you pay"
            blurb="Card details are handled by our payment provider and never reach our servers. We only ever see the last four digits."
          >
            <Row label="Visa ending 4242" hint="Expires 09/2029.">
              <button
                type="button"
                className="rounded-lg border border-line-strong bg-base px-4 py-2 text-[0.875rem] font-medium text-ink shadow-tight hover:border-ink/25"
              >
                Update card
              </button>
            </Row>
            <Row
              label="Billing email"
              hint="Receipts go here. sarah@example.com"
            >
              <button
                type="button"
                className="rounded-lg border border-line-strong bg-base px-4 py-2 text-[0.875rem] font-medium text-ink shadow-tight hover:border-ink/25"
              >
                Change
              </button>
            </Row>
          </Panel>

          <Panel title="Receipts">
            <ul className="divide-y divide-line">
              {INVOICES.map((inv) => (
                <li
                  key={inv.id}
                  className="flex flex-wrap items-center justify-between gap-4 py-3.5 first:pt-0"
                >
                  <div className="min-w-0">
                    <p className="text-[0.9375rem] font-medium text-ink">
                      {inv.date}
                    </p>
                    <p className="mt-0.5 text-[0.8125rem] text-ink-45">
                      {inv.plan} · {inv.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className="figure-num text-[0.9375rem] font-medium text-ink">
                      {inv.amount}
                    </span>
                    <button
                      type="button"
                      className="text-[0.875rem] font-medium text-indigo underline underline-offset-4 hover:text-indigo-hi"
                    >
                      PDF
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title="If you cancel"
            blurb="You keep access until the end of the period you have already paid for. After that the account drops to the free tier rather than closing: 20 minutes a day, one child, and every transcript and badge stays where it is. Nothing is deleted unless you ask for it."
          >
            <Link
              href="/contact"
              className="text-[0.875rem] font-medium text-indigo underline underline-offset-4 hover:text-indigo-hi"
            >
              Talk to a person about billing
            </Link>
          </Panel>
        </div>
      </main>
    </ParentShell>
  );
}
