import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/marketing/ContactForm";
import { Reveal } from "@/components/ui/primitives";
import { IconTile } from "@/components/ui/Icons";
import { MENU_ICONS } from "@/components/ui/MenuIcons";

export const metadata: Metadata = {
  title: "Talk to us",
  description:
    "Questions about the Primer, a problem with your account, or something your child said that worried you. A real person answers within one working day.",
  alternates: { canonical: "/contact" },
};

/**
 * CONTACT
 *
 * Ordered by urgency rather than by what is convenient for us. The safety route
 * is first and is not a form: a parent whose child said something worrying
 * should not be choosing a subject from a dropdown. Everything else can wait
 * for a form.
 *
 * The form does not post anywhere yet. It validates and reports its own state
 * so the UI is complete and reviewable, and the submit handler is the single
 * place the backend gets wired in later.
 */

const ROUTES = [
  {
    Icon: MENU_ICONS.shield,
    title: "Something your child said",
    body: "If a session raised something you're worried about, write to us directly and a person will read it the same day.",
    action: { href: "mailto:safeguarding@theprimer.app", label: "safeguarding@theprimer.app" },
  },
  {
    Icon: MENU_ICONS.hours,
    title: "Billing and accounts",
    body: "Plan changes, refunds, or closing an account and deleting what we hold.",
    action: { href: "mailto:accounts@theprimer.app", label: "accounts@theprimer.app" },
  },
  {
    Icon: MENU_ICONS.profile,
    title: "Schools and groups",
    body: "More than four children, or a class. Tell us the number and the ages and we'll come back with something sensible.",
    action: { href: "mailto:schools@theprimer.app", label: "schools@theprimer.app" },
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-8 sm:px-8 sm:pt-12">
        <Reveal>
          <p className="eyebrow mb-4 text-indigo">contact</p>
          <h1 className="max-w-2xl text-[clamp(2.25rem,5vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-balance">
            A person answers, within one working day.
          </h1>
          <p className="mt-5 max-w-xl text-[1.0625rem] leading-[1.65] text-ink-70">
            Not a ticket number and not a bot. If you would rather not use the
            form, the addresses below go to the same place.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <Reveal>
              <ul className="space-y-4">
                {ROUTES.map((r) => (
                  <li
                    key={r.title}
                    className="flex gap-4 rounded-2xl border border-line bg-surface p-5 shadow-tight"
                  >
                    <IconTile Icon={r.Icon} size={48} />
                    <div className="min-w-0">
                      <h2 className="text-[1.0625rem] font-semibold text-ink">
                        {r.title}
                      </h2>
                      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-70">
                        {r.body}
                      </p>
                      <a
                        href={r.action.href}
                        className="mt-2.5 inline-block break-all text-[0.875rem] font-medium text-indigo underline underline-offset-4 hover:text-indigo-hi"
                      >
                        {r.action.label}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-6 rounded-2xl bg-indigo-tint p-5">
                <p className="text-[0.9375rem] leading-relaxed text-ink-70">
                  Looking for how the tutoring actually works, or what we keep
                  and for how long? That is written up on{" "}
                  <Link
                    href="/features"
                    className="font-medium text-indigo underline underline-offset-4"
                  >
                    how it works
                  </Link>{" "}
                  rather than kept behind a support queue.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="order-1 lg:order-2">
            <Reveal delay={0.04}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
