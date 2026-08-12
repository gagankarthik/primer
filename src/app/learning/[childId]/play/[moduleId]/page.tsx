import { notFound } from "next/navigation";
import { getChild } from "@/lib/mock";
import { moduleById } from "@/lib/modules";
import { CourseFlow } from "@/components/child/CourseFlow";

/**
 * PLAY.
 *
 * This used to render PlaySession, a scripted conversation the child stepped
 * through. That demonstrated the Socratic voice but it was a rehearsal: the
 * child tapped "next" and watched an exchange happen to somebody else.
 *
 * CourseFlow makes them do the work. Same voice, same ladder, but the child
 * answers and the module responds to what they chose, which is the difference
 * between a demo of the idea and the idea.
 */
export default async function Play({
  params,
}: {
  params: Promise<{ childId: string; moduleId: string }>;
}) {
  const { childId, moduleId } = await params;
  const child = getChild(childId);
  const module = moduleById(moduleId);
  if (!child || !module) notFound();

  return <CourseFlow module={module} childId={childId} />;
}
