import { WorkPage, Card } from "@/components/app/Page";
import { Row } from "@/components/parent/Layout";
import { CREATOR_COURSES } from "@/lib/platform";
import { ROLES } from "@/lib/roles";

export const metadata = { title: "Profile" };

/**
 * CREATOR PROFILE.
 *
 * Short. A creator's byline appears next to their modules in the catalogue, so
 * the name and the one-line bio are public and the rest is not.
 *
 * The access boundary is spelled out at the bottom rather than assumed. A
 * person writing for six-year-olds will reasonably want to know how a
 * particular child got on with their module, and the honest answer is that the
 * product will never tell them.
 */
export default function StudioProfile() {
  const live = CREATOR_COURSES.filter((c) => c.status === "live").length;

  return (
    <WorkPage title="Profile" blurb="Your account, and what it can reach.">
      <div className="max-w-3xl space-y-6">
        <Card
          title="Public"
          blurb="Shown next to your modules in the catalogue, to parents choosing what their child does."
        >
          <Row label="Name" hint="Priya Nadar">
            <button
              type="button"
              className="rounded-lg border border-line-strong bg-base px-4 py-2 text-[0.875rem] font-medium text-ink transition-colors hover:border-ink/25"
            >
              Edit
            </button>
          </Row>
          <Row
            label="One line"
            hint="Primary teacher, fifteen years, mostly Year 2."
          >
            <button
              type="button"
              className="rounded-lg border border-line-strong bg-base px-4 py-2 text-[0.875rem] font-medium text-ink transition-colors hover:border-ink/25"
            >
              Edit
            </button>
          </Row>
          <Row
            label="Modules live"
            hint={`${live} in the catalogue right now.`}
          />
        </Card>

        <Card title="Private">
          <Row label="Email" hint="priya@example.com">
            <button
              type="button"
              className="rounded-lg border border-line-strong bg-base px-4 py-2 text-[0.875rem] font-medium text-ink transition-colors hover:border-ink/25"
            >
              Change
            </button>
          </Row>
          <Row label="Password" hint="Last changed 5 months ago.">
            <button
              type="button"
              className="rounded-lg border border-line-strong bg-base px-4 py-2 text-[0.875rem] font-medium text-ink transition-colors hover:border-ink/25"
            >
              Change
            </button>
          </Row>
          <Row
            label="Payout details"
            hint="Handled by our payment provider. We only see the last four digits."
          >
            <button
              type="button"
              className="rounded-lg border border-line-strong bg-base px-4 py-2 text-[0.875rem] font-medium text-ink transition-colors hover:border-ink/25"
            >
              Update
            </button>
          </Row>
        </Card>

        <Card tone="danger" title="What this account cannot see">
          <p className="text-[0.9375rem] leading-relaxed text-ink-70">
            {ROLES.creator.cannot}
          </p>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-70">
            This is not a permission that could be granted. There is no screen
            in studio that resolves to a person, and the aggregate figures are
            computed before they reach this side of the product. If you need to
            know whether a module works, the numbers on{" "}
            <span className="font-medium text-ink">How they land</span> are the
            honest answer to that question.
          </p>
        </Card>
      </div>
    </WorkPage>
  );
}
