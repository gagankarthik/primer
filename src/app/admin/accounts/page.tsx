import { WorkPage, Card, Metric, Pill, Rows } from "@/components/app/Page";
import { ACCOUNTS, type AccountRow } from "@/lib/platform";
import { ROLES } from "@/lib/roles";
import { cn } from "@/components/ui/cn";

export const metadata = { title: "Accounts" };

/**
 * ACCOUNTS.
 *
 * Every adult on the platform, in one list. Children are not here and never
 * will be: a learner is not an account, they are a profile inside a parent's
 * account, and the moment a child becomes a searchable row in an admin tool is
 * the moment somebody can look one up.
 *
 * The only two actions are suspend and resend invite. There is deliberately no
 * "sign in as this user", which is the feature every admin tool grows and the
 * one that quietly hands support staff a parent's transcripts.
 */
export default function Accounts() {
  const parents = ACCOUNTS.filter((a) => a.role === "parent");
  const creators = ACCOUNTS.filter((a) => a.role === "creator");
  const learners = parents.reduce((n, p) => n + p.learners, 0);

  return (
    <WorkPage
      title="Accounts"
      blurb="The adults. Children are profiles inside a parent's account, not accounts, so they are not listed or searchable here."
      action={
        <button
          type="button"
          className="rounded-xl bg-ink px-4 py-2.5 text-[0.875rem] font-semibold text-white transition-colors hover:bg-ink/88"
        >
          Invite a creator
        </button>
      }
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric value={parents.length} label="Parents" />
        <Metric value={learners} label="Learners" hint="inside those accounts" />
        <Metric value={creators.length} label="Creators" tone="indigo" />
        <Metric
          value={ACCOUNTS.filter((a) => a.status === "suspended").length}
          label="Suspended"
          tone="rose"
        />
      </div>

      <Card className="mb-6">
        <Rows>
          {ACCOUNTS.map((a) => (
            <AccountItem key={a.id} a={a} />
          ))}
        </Rows>
      </Card>

      <Card
        title="What each role can reach"
        blurb="Access narrows as authority rises. An admin has more power than a parent and less access to any individual child."
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {Object.values(ROLES).map((r) => (
            <li
              key={r.role}
              className="rounded-2xl border border-line bg-base p-4"
            >
              <p className="text-[0.9375rem] font-semibold text-ink">{r.label}</p>
              <p className="mt-1 text-[0.875rem] leading-snug text-ink-70">
                {r.does}
              </p>
              <p className="mt-2 border-t border-line pt-2 text-[0.875rem] leading-snug text-rose">
                {r.cannot}
              </p>
            </li>
          ))}
        </ul>
      </Card>
    </WorkPage>
  );
}

function AccountItem({ a }: { a: AccountRow }) {
  const role = {
    parent: { tone: "indigo" as const, label: "Parent" },
    creator: { tone: "green" as const, label: "Creator" },
    admin: { tone: "rose" as const, label: "Admin" },
  }[a.role];

  return (
    <li
      className={cn("px-4 py-4 sm:px-5", a.status === "suspended" && "opacity-60")}
    >
      <div className="flex flex-wrap items-center gap-4">
        <span
          aria-hidden
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-grey-tint text-[0.875rem] font-semibold text-ink-45"
        >
          {a.name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[0.9375rem] font-semibold text-ink">{a.name}</p>
            <Pill tone={role.tone}>{role.label}</Pill>
            {a.status === "suspended" && <Pill tone="rose">Suspended</Pill>}
            {a.status === "invited" && <Pill tone="amber">Invite sent</Pill>}
          </div>
          <p className="truncate text-[0.8125rem] text-ink-45">{a.email}</p>
        </div>

        <div className="hidden text-right sm:block">
          <p className="text-[0.875rem] text-ink">{a.plan}</p>
          <p className="text-[0.75rem] text-ink-45">
            {a.role === "parent"
              ? `${a.learners} learner${a.learners === 1 ? "" : "s"}`
              : `joined ${new Date(a.joined).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          {a.status === "invited" ? (
            <button
              type="button"
              className="rounded-lg border border-line-strong bg-base px-3.5 py-2 text-[0.875rem] font-medium text-ink transition-colors hover:border-ink/25"
            >
              Resend
            </button>
          ) : (
            <button
              type="button"
              className={cn(
                "rounded-lg border px-3.5 py-2 text-[0.875rem] font-medium transition-colors",
                a.status === "suspended"
                  ? "border-line-strong bg-base text-ink hover:border-ink/25"
                  : "border-rose/40 bg-base text-rose hover:bg-rose/5",
              )}
            >
              {a.status === "suspended" ? "Restore" : "Suspend"}
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
