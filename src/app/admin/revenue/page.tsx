import { WorkPage, Card, Metric, Rows } from "@/components/app/Page";
import { PLATFORM, ACCOUNTS, PAYOUTS } from "@/lib/platform";

export const metadata = { title: "Revenue" };

/**
 * REVENUE.
 *
 * Deliberately unglamorous, and deliberately paired with the one number that
 * should override it. If median help rung climbs, revenue is a lagging measure
 * of a product that has already stopped working, so it is on this page too
 * rather than only on the overview.
 *
 * No cohort curves, no LTV model, no projected ARR. Those are decisions to
 * make in a spreadsheet with assumptions written down, not numbers to glance
 * at on a dashboard and repeat in a meeting as though they were measured.
 */
export default function Revenue() {
  const paying = ACCOUNTS.filter(
    (a) => a.plan === "Family" || a.plan === "Household",
  );
  const free = ACCOUNTS.filter((a) => a.plan === "Free");
  const mrrDelta = PLATFORM.mrr - PLATFORM.mrrLastMonth;
  const arpu = PLATFORM.mrr / Math.max(1, PLATFORM.households);

  return (
    <WorkPage
      title="Revenue"
      blurb="What comes in, what goes out to creators, and the one number that matters more than either."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          value={`$${PLATFORM.mrr.toLocaleString("en-GB")}`}
          label="Monthly recurring"
          hint="net of refunds"
          tone="indigo"
          delta={{
            text: `▲ $${mrrDelta.toLocaleString("en-GB")}`,
            good: mrrDelta >= 0,
          }}
        />
        <Metric
          value={`$${arpu.toFixed(2)}`}
          label="Per household"
          hint="including everyone on the free tier"
        />
        <Metric
          value={PLATFORM.households.toLocaleString("en-GB")}
          label="Households"
          hint={`${paying.length} of ${ACCOUNTS.filter((a) => a.role === "parent").length} sampled are paying`}
        />
        <Metric
          value={PLATFORM.medianHelpRung.toFixed(1)}
          label="Median help rung"
          hint="Here because if this climbs, none of the above is durable."
          tone={PLATFORM.medianHelpRung <= 2.5 ? "green" : "amber"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          title="Creator payouts"
          blurb={`Paid per completed session at $${PAYOUTS.ratePerSession.toFixed(2)}, not per install and not per minute. Paying per minute would pay creators to waste a child's evening.`}
        >
          <Rows>
            {PAYOUTS.history.map((h) => (
              <li
                key={h.month}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5"
              >
                <span className="min-w-0">
                  <span className="block text-[0.9375rem] font-medium text-ink">
                    {h.month}
                  </span>
                  <span className="figure-num block text-[0.8125rem] text-ink-45">
                    {h.sessions.toLocaleString("en-GB")} sessions
                  </span>
                </span>
                <span className="figure-num text-[0.9375rem] font-semibold text-ink">
                  ${h.amount.toFixed(2)}
                </span>
              </li>
            ))}
          </Rows>
        </Card>

        <Card
          title="The free tier"
          blurb="It stays free, and it is not a trial that expires. This costs us money and is on the page so nobody quietly proposes removing it."
        >
          <ul className="space-y-3 text-[0.9375rem] leading-relaxed text-ink-70">
            <li>
              <span className="font-medium text-ink">
                {free.length} of the sampled accounts
              </span>{" "}
              are on it, using 20 minutes a day with one child.
            </li>
            <li>
              Cancelling a paid plan drops an account here rather than closing
              it. Every transcript and badge stays where it is.
            </li>
            <li>
              A family that cannot pay is the family this product was built for.
              Churn to free is not churn.
            </li>
          </ul>
        </Card>
      </div>
    </WorkPage>
  );
}
