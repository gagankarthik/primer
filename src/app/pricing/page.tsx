import type { Metadata } from "next";
import { SiteChrome } from "@/components/marketing/Chrome";
import { PricingTable } from "@/components/marketing/PricingTable";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { Reveal } from "@/components/ui/primitives";
import { Squiggle, Spark } from "@/components/brand/Doodles";
import { PRICING_FAQ } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free to start. $15 a month for one child, $29 for up to four. A Socratic AI tutor for ages 5 to 11. No card for the trial, cancel any time.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pricing | Primer",
    description:
      "Free to start. $15 a month for one child. A tutor for ages 5 to 11 that asks instead of tells.",
    url: "/pricing",
    type: "website",
  },
};

/**
 * FAQPage structured data, generated from the same array the page renders.
 * Google only shows a rich result when the marked-up answers match the visible
 * ones, so sharing one source removes the main way that breaks.
 */
function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PRICING_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export default function Pricing() {
  return (
    <SiteChrome>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />

      <section className="relative overflow-hidden pb-14 pt-6 sm:pt-10">
        <Squiggle className="absolute left-[8%] top-[38%] hidden lg:block" size={68} />
        <Spark
          className="absolute right-[10%] top-[30%] hidden lg:block"
          color="var(--color-rose)"
          size={24}
        />

        <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
          <Reveal>
            <h1 className="text-[clamp(2.25rem,5.5vw,3.75rem)] font-bold leading-[1.06] tracking-[-0.035em] text-balance">
              Less than one hour with a tutor.
            </h1>
            <p className="mx-auto mt-6 max-w-md text-[1.0625rem] leading-[1.6] text-ink-70">
              A human tutor runs about $50 an hour and sees your child once a
              week. The Primer is there every evening.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <Reveal>
          <PricingTable />
        </Reveal>
        <Reveal>
          <p className="mt-8 text-center text-xs text-ink-45">
            Prices in USD. Schools and home education co-ops:{" "}
            <a
              href="mailto:hello@theprimer.app"
              className="text-indigo hover:underline"
            >
              hello@theprimer.app
            </a>
          </p>
        </Reveal>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:px-8 sm:py-24">
          <Reveal>
            <h2 className="mb-10 text-[clamp(1.75rem,3.6vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.03em]">
              Questions parents ask
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <FaqAccordion items={PRICING_FAQ} />
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-10 text-[0.9375rem] text-ink-45">
              Something not answered here?{" "}
              <a
                href="mailto:hello@theprimer.app"
                className="font-medium text-indigo hover:underline"
              >
                Ask us directly
              </a>
              . A person replies, usually the same day.
            </p>
          </Reveal>
        </div>
      </section>

    </SiteChrome>
  );
}
