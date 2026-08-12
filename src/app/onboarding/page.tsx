import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const metadata: Metadata = {
  title: "Set up your child",
  description:
    "Add a child, set the rules, and hand it over. Takes about two minutes.",
};

export default function Onboarding() {
  return <OnboardingFlow />;
}
