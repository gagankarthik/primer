import { WorkPage, Card } from "@/components/app/Page";
import { AdminSettingsPanels } from "@/components/app/AdminSettingsPanels";

export const metadata = { title: "Settings" };

/**
 * PLATFORM SETTINGS.
 *
 * Short on purpose. Most of what an admin console usually exposes here is
 * either a thing that should never be switchable or a thing that belongs to a
 * parent, not to us.
 *
 * The two locked rows at the bottom are the important part of this page. They
 * are rendered as settings so that anyone who comes looking for the toggle
 * finds the reason it does not exist, rather than concluding it was an
 * oversight and building one.
 */
export default function AdminSettings() {
  return (
    <WorkPage
      title="Settings"
      blurb="What the platform does by default. Anything that belongs to a family is set by the family, not here."
    >
      <div className="max-w-3xl space-y-6">
        <AdminSettingsPanels />

        <Card
          tone="danger"
          title="Not switchable, and why"
          blurb="These are rendered here so that whoever comes looking for the toggle finds the reason instead of assuming we forgot."
        >
          <ul className="space-y-4">
            {[
              {
                t: "Voice retention",
                b: "There is no setting because there is nothing to retain. Audio is transcribed and destroyed in the same request, and no voiceprint is ever created. Adding a switch would mean building the storage first.",
              },
              {
                t: "Training on session data",
                b: "Nothing a child says trains a model. This is a contract term with every household, not a configuration value, so it cannot be changed by anyone with access to this page.",
              },
              {
                t: "Sign in as a user",
                b: "Every admin tool grows this feature, and it is how support staff end up reading a six-year-old's transcripts. Debugging a household is done with the household, on a call.",
              },
            ].map((r) => (
              <li key={r.t}>
                <p className="text-[0.9375rem] font-semibold text-ink">{r.t}</p>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-70">
                  {r.b}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </WorkPage>
  );
}
