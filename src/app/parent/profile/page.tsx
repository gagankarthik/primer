import type { Metadata } from "next";
import { CHILD_LIST } from "@/lib/mock";
import { ParentShell } from "@/components/parent/ParentShell";
import { PageHead, Panel, Row } from "@/components/parent/Layout";
import { ProfileForm } from "@/components/parent/ProfileForm";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

/**
 * THE PARENT'S OWN ACCOUNT.
 *
 * Distinct from Settings, which is about a child. This is about the adult: who
 * they are, how they sign in, and what we send them. Keeping the two apart
 * means neither page needs a "whose settings am I changing?" disclaimer.
 */
export default function ParentProfile() {
  return (
    <ParentShell childId={CHILD_LIST[0].profile.childId} showChildSwitcher={false}>
      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-12">
        <PageHead
          title="Your profile"
          blurb="Your account, not your children's. Sign-in details, how we reach you, and what we send."
        />

        <div className="space-y-6">
          <ProfileForm />

          <Panel
            title="Signing in"
            blurb="One password, and it is the only thing standing between a stranger and your children's transcripts. There is no sign-in with Google or Apple here, deliberately."
          >
            <Row label="Password" hint="Last changed 4 months ago.">
              <button
                type="button"
                className="rounded-lg border border-line-strong bg-base px-4 py-2 text-[0.875rem] font-medium text-ink shadow-tight hover:border-ink/25"
              >
                Change password
              </button>
            </Row>
            <Row
              label="Two-factor authentication"
              hint="Not set up. A code from an app, in addition to your password."
            >
              <button
                type="button"
                className="rounded-lg bg-ink px-4 py-2 text-[0.875rem] font-medium text-white hover:bg-ink/88"
              >
                Turn on
              </button>
            </Row>
            <Row
              label="Signed-in devices"
              hint="This browser, and an iPad last used yesterday."
            >
              <button
                type="button"
                className="rounded-lg border border-line-strong bg-base px-4 py-2 text-[0.875rem] font-medium text-ink shadow-tight hover:border-ink/25"
              >
                Sign out everywhere
              </button>
            </Row>
          </Panel>

          <Panel
            tone="warn"
            title="Closing your account"
            blurb="Closing removes every child on the account, their transcripts, and their profiles. There is no recovery window and no archived copy."
          >
            <button
              type="button"
              className="rounded-lg border border-rose/40 bg-base px-4 py-2 text-[0.875rem] font-medium text-rose shadow-tight hover:bg-rose/5"
            >
              Close my account
            </button>
          </Panel>
        </div>
      </main>
    </ParentShell>
  );
}
