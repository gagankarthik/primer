import { CubeLoader } from "@/components/ui/CubeLoader";

/**
 * Loading a session.
 *
 * Deliberately not a skeleton: the play screen is a single big question and one
 * button, so a skeleton of it would just be two grey blobs. A child waiting for
 * their turn to start needs something that is obviously *working*, and the
 * label is written for them rather than for an adult.
 */
export default function PlayLoading() {
  return (
    <main className="grid min-h-dvh place-items-center bg-indigo-tint">
      <div className="pt-24">
        <CubeLoader label="Getting your question ready" />
      </div>
    </main>
  );
}
