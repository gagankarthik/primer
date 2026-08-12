import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { BackButton } from "@/components/ui/BackButton";
import { DescentTrace } from "@/components/DescentTrace";
import { Stars } from "@/components/modules/ModuleCard";
import { PHOTOS, photoUrl, type PhotoKey } from "@/lib/photos";

/**
 * AUTH SHELL
 *
 * Split layout: form on the left, a full-bleed photograph on the right with two
 * floating cards over it.
 *
 * No Google or Apple buttons. Deliberate: this account holds a child's learning
 * history and the PIN that guards it, and social sign-in hands the recovery
 * path, and a signal about the family, to a third party. It also removes the
 * "which of the four buttons did I use last time?" problem, which is the single
 * most common reason a parent can't get back in six months later.
 *
 * The right panel is hidden below `lg`, where the form should own the screen.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  photo = "blocks",
  note,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  photo?: PhotoKey;
  /** The small print under the form. Differs between signing in and signing up. */
  note?: React.ReactNode;
}) {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      {/* ------------------------------------------------------------ form */}
      <div className="flex flex-col bg-base px-6 py-8 sm:px-10">
        {/*
          A labelled way out, not just a clickable logo. Someone who followed a
          sign-in link from an email has no history to go back to, and a logo
          is not something people read as "leave this page".
        */}
        {/* Back on the leading edge, always. It is where every browser, OS and
            app puts it, and a back control on the trailing edge reads as a
            forward action for the half-second it takes to notice otherwise. */}
        <div className="flex items-center justify-between gap-4">
          <BackButton fallbackHref="/" label="Back to site" />
          <Link href="/" aria-label="Primer home">
            <Logo size={30} />
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-[1.875rem] font-semibold tracking-[-0.03em] text-ink">
            {title}
          </h1>
          <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-45">
            {subtitle}
          </p>

          <div className="mt-8">{children}</div>

          <div className="mt-8 text-[0.875rem] text-ink-45">{footer}</div>
        </div>

        <p className="mx-auto w-full max-w-sm text-[0.75rem] leading-relaxed text-ink-45">
          {note ??
            "Only a parent or guardian can create an account. A child signs in on this page too, with the code from your dashboard, and never with an email address."}
        </p>
      </div>

      {/* ----------------------------------------------------------- photo */}
      <aside className="relative hidden overflow-hidden lg:block">
        <Image
          src={photoUrl(photo, { w: 1200, h: 1400, q: 78 })}
          alt={PHOTOS[photo].alt}
          fill
          sizes="52vw"
          className="object-cover"
          priority
        />
        {/* Scrim so the floating cards stay legible whatever the photo does. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-tr from-ink/70 via-ink/25 to-transparent"
        />

        <div className="relative flex h-full flex-col justify-end gap-5 p-12">
          {/* What they'll actually get, not a marketing line. */}
          <div className="max-w-sm rounded-2xl bg-white/95 p-5 shadow-pop backdrop-blur">
            <p className="eyebrow mb-2.5 text-ink-45">your week</p>
            <p className="text-[0.9375rem] leading-[1.5] text-ink">
              Nell asked to just be told the answer three times this week, all on
              blending sounds.
            </p>
            <div className="mt-4 space-y-2.5 border-t border-line pt-4">
              {[
                { t: "Blending sounds", d: [0, 1, 2, 3, 3, 4, 2, 1] },
                { t: "Adding within 10", d: [0, 1, 2, 2, 1, 0] },
              ].map((r) => (
                <div key={r.t} className="flex items-center justify-between gap-4">
                  <span className="text-[0.8125rem] text-ink-70">{r.t}</span>
                  <DescentTrace
                    trace={r.d as never}
                    width={130}
                    height={34}
                    showFloor={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* One real parent line, low and small. */}
          <div className="max-w-sm rounded-2xl bg-white/95 p-5 shadow-pop backdrop-blur">
            <Stars value={5} size={14} />
            <p className="mt-3 text-[0.9375rem] leading-[1.5] text-ink">
              &ldquo;She argues with it now. Last week she told me it was being
              annoying on purpose.&rdquo;
            </p>
            <p className="mt-3 flex items-center gap-2.5 text-[0.8125rem] text-ink-45">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-indigo text-[0.6875rem] font-semibold text-white">
                S
              </span>
              Sarah &middot; parent of a six-year-old
            </p>
          </div>
        </div>
      </aside>
    </main>
  );
}

/* ---------------------------------------------------------------- fields */

export function Field({
  label,
  id,
  type = "text",
  placeholder,
  autoComplete,
  hint,
  required,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[0.875rem] font-medium text-ink"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-[0.9375rem] text-ink shadow-tight outline-none transition-colors placeholder:text-ink-45/70 focus:border-indigo"
      />
      {hint && <p className="mt-1.5 text-[0.8125rem] text-ink-45">{hint}</p>}
    </div>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="w-full rounded-xl bg-indigo px-5 py-3.5 text-[0.9375rem] font-semibold text-white shadow-[0_4px_16px_rgba(61,78,232,0.32)] transition-all hover:bg-indigo-hi active:scale-[0.99]"
    >
      {children}
    </button>
  );
}
