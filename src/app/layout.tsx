import type { Metadata, Viewport } from "next";
import { Inter_Tight, Atkinson_Hyperlegible, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/*
  Inter Tight for display and UI: crisp and tight at large sizes.

  Atkinson Hyperlegible for everything the CHILD reads. Drawn by the Braille
  Institute to maximise character disambiguation, so the I/l/1 and a/o/e pairs
  are deliberately distinct. When a six-year-old is sounding out a word that is
  a functional requirement rather than a stylistic one, and it keeps the product
  from looking like every other Inter-only interface.

  IBM Plex Mono for figures and labels, with tabular numerals so session data
  lines up in columns.

  All three are self-hosted by next/font at build time. No render-blocking
  request to a font CDN, and no third party learning who reads this site.
*/
const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

/**
 * Set NEXT_PUBLIC_SITE_URL to the real origin before launch. metadataBase is
 * what turns the relative canonical and Open Graph URLs on every page into
 * absolute ones. Without it Next warns at build and social cards resolve
 * against localhost.
 */
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theprimer.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    // Each page sets a short title; this appends the brand.
    default: "Primer | An AI tutor for ages 5 to 11 that asks instead of tells",
    template: "%s | Primer",
  },
  description:
    "A Socratic AI tutor for children aged 5 to 11. It never hands over the answer. It asks the next question your child can actually answer, and shows you how much help each session took.",
  applicationName: "Primer",
  keywords: [
    "AI tutor for kids",
    "Socratic tutoring",
    "reading help for 5 year olds",
    "maths tutor for children",
    "phonics and blending",
    "times tables practice",
    "homework help alternative",
    "parental controls learning app",
  ],
  authors: [{ name: "Primer" }],
  creator: "Primer",
  publisher: "Primer",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Primer",
    url: "/",
    title: "An AI tutor for ages 5 to 11 that asks instead of tells",
    description:
      "It never hands over the answer. It asks the next question your child can actually answer, and shows you how much help it took.",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "An AI tutor for ages 5 to 11 that asks instead of tells",
    description:
      "It never hands over the answer. It asks the next question your child can actually answer.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: "#FBFCFD",
  // Children on tablets pinch to zoom constantly. Never disable it.
  maximumScale: 5,
};

/** Organisation, site and product structured data, applied sitewide. */
function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE}/#organization`,
        name: "Primer",
        url: SITE,
        logo: `${SITE}/icon.svg`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: "Primer",
        publisher: { "@id": `${SITE}/#organization` },
        inLanguage: "en-GB",
      },
      {
        "@type": "SoftwareApplication",
        name: "Primer",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web, iOS, Android",
        audience: {
          "@type": "PeopleAudience",
          suggestedMinAge: 5,
          suggestedMaxAge: 11,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "Free tier, 20 minutes a day for one child",
        },
      },
    ],
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
        />
      </head>
      <body
        className={`${interTight.variable} ${atkinson.variable} ${plexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
