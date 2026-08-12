import { WorkPage, Card } from "@/components/app/Page";
import { ModuleEditor } from "@/components/app/ModuleEditor";
import { BackButton } from "@/components/ui/BackButton";

export const metadata = { title: "New module" };

/**
 * A NEW MODULE.
 *
 * Starts with a worked example already in the editor rather than an empty
 * form. A blank module editor is the hardest screen in this product to start
 * from, because the shape it wants (teach, check, re-teach differently) is not
 * the shape most people write in. Showing one filled-in loop teaches the shape
 * faster than the writing guide does.
 */
export default function NewModule() {
  return (
    <WorkPage
      title="New module"
      blurb="One idea, three or four times over. Four to six minutes end to end."
    >
      <div className="mb-6">
        <BackButton fallbackHref="/studio/courses" label="All modules" />
      </div>

      <Card className="mb-6" title="Start from the loop, not from a blank page">
        <p className="text-[0.9375rem] leading-relaxed text-ink-70">
          There is a worked example below. Edit it rather than deleting it: the
          shape it shows, teach one idea, check it, and re-teach that same idea
          a different way when they get it wrong, is what every module here is,
          and it is the part reviewers send modules back for.
        </p>
      </Card>

      <ModuleEditor />
    </WorkPage>
  );
}
