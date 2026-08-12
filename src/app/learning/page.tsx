import Link from "next/link";
import { CHILD_LIST } from "@/lib/mock";
import { modulesForAge } from "@/lib/modules";
import { LogoMark } from "@/components/brand/Logo";
import { ModuleArt } from "@/components/modules/ModuleArt";

/**
 * CHILD AREA, the door.
 *
 * One job: get the right child into their session in a single tap. No search,
 * no menus, no settings. The research on 5–7s is blunt, complex navigation is
 * where they give up, before any learning happens, so every control that
 * isn't "start" has been removed from this screen.
 *
 * The parent entrance is small, low-contrast, and at the top right, where a
 * child won't hit it by accident reaching for their own name.
 */

const AVATAR_TONE = ["bg-indigo", "bg-green", "bg-amber", "bg-rose"];

export default function ChildPicker() {
  return (
    <main className="min-h-dvh bg-base">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link href="/" aria-label="Primer home">
          <LogoMark size={30} />
        </Link>
        <Link
          href="/parent"
          className="rounded-lg px-3 py-2 text-[0.8125rem] font-medium text-ink-45 transition-colors hover:bg-grey-tint hover:text-ink"
        >
          Parent view
        </Link>
      </header>

      <div className="mx-auto max-w-3xl px-6 pb-20 pt-6">
        <h1 className="text-[2.25rem] font-semibold tracking-[-0.03em] text-ink sm:text-[2.75rem]">
          Who&rsquo;s here?
        </h1>

        <ul className="mt-10 space-y-4">
          {CHILD_LIST.map((c, i) => {
            const next = modulesForAge(c.profile.contextual.ageYears)[0];
            return (
              <li key={c.profile.childId}>
                <Link
                  href={`/learning/${c.profile.childId}`}
                  className="group flex items-center gap-5 rounded-3xl border border-line bg-surface p-5 shadow-tight transition-all hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift"
                >
                  <span
                    className={`grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-3xl font-semibold text-white ${AVATAR_TONE[i % 4]}`}
                    aria-hidden
                  >
                    {c.profile.displayName[0]}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-2xl font-semibold tracking-[-0.02em] text-ink">
                      {c.profile.displayName}
                    </span>
                    {next && (
                      <span className="mt-1 block text-[0.9375rem] text-ink-45">
                        Next up, {next.kidTitle}
                      </span>
                    )}
                  </span>

                  {next && (
                    <span className="hidden h-16 w-28 shrink-0 overflow-hidden rounded-xl bg-grey-tint sm:block">
                      <ModuleArt
                        art={next.art}
                        tone={next.tone}
                        className="h-full w-full"
                      />
                    </span>
                  )}

                  <span
                    aria-hidden
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-white transition-transform group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
