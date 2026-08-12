import { WorkPage, Card, Metric, Rows } from "@/components/app/Page";
import { Row } from "@/components/parent/Layout";
import { PAYOUTS } from "@/lib/platform";

export const metadata = { title: "Payouts" };

/**
 * PAYOUTS.
 *
 * Paid per completed session, and the reason is on the page rather than in a
 * contract nobody reads. Per minute would pay a creator to pad a module and
 * waste a child's evening; per install would pay for a good title and nothing
 * after it. Per completed session is the only unit that pays for the thing the
 * product is trying to cause.
 */
export default function Payouts() {
  const delta = PAYOUTS.thisMonth - PAYOUTS.lastMonth;

  return (
    <WorkPage
      title="Payouts"
      blurb="What you have earned, how it is worked out, and when it arrives."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          value={`$${PAYOUTS.thisMonth.toFixed(2)}`}
          label="This month, so far"
          tone="indigo"
          delta={{ text: `▲ $${delta.toFixed(2)}`, good: delta >= 0 }}
        />
        <Metric
          value={PAYOUTS.sessionsThisMonth.toLocaleString("en-GB")}
          label="Completed sessions"
          hint="a session is one child, one module, start to finish"
        />
        <Metric
          value={`$${PAYOUTS.ratePerSession.toFixed(2)}`}
          label="Per session"
          hint="flat, across every module"
        />
        <Metric
          value={`$${PAYOUTS.lifetime.toLocaleString("en-GB")}`}
          label="Lifetime"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card title="Paid out">
          <Rows>
            {PAYOUTS.history.map((h) => (
              <li
                key={h.month}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5"
              >
                <span className="min-w-0">
                  <span className="block text-[0.9375rem] font-medium text-ink">
                    {h.month}
                  </span>
                  <span className="figure-num block text-[0.8125rem] text-ink-45">
                    {h.sessions.toLocaleString("en-GB")} sessions
                  </span>
                </span>
                <span className="flex items-center gap-4">
                  <span className="text-[0.8125rem] text-green">{h.status}</span>
                  <span className="figure-num text-[1rem] font-semibold text-ink">
                    ${h.amount.toFixed(2)}
                  </span>
                </span>
              </li>
            ))}
          </Rows>
        </Card>

        <div className="space-y-4">
          <Card title="How it is worked out">
            <Row
              label="Unit"
              hint="A completed session. Not a start, not a minute, not an install."
            />
            <Row label="Rate" hint="Flat across every module and every age." />
            <Row
              label="Next payout"
              hint={`${PAYOUTS.nextPayoutOn}, for everything up to 31 August.`}
            />
          </Card>

          <Card title="Why not per minute">
            <p className="text-[0.9375rem] leading-relaxed text-ink-70">
              Paying per minute pays you to pad. Paying per install pays for a
              good title and nothing after it. Paying per completed session pays
              for a child finishing something, which is the only outcome this
              product is trying to cause.
            </p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-70">
              It also means a shorter, better module earns more than a longer
              one, because more children reach the end of it.
            </p>
          </Card>
        </div>
      </div>
    </WorkPage>
  );
}
