/**
 * Pricing FAQ.
 *
 * Questions a parent of a 5 to 11 year old actually asks before paying, in the
 * order they ask them. Not feature trivia, and not the questions we wish they
 * asked.
 *
 * Two of these answers are deliberately unhelpful to the sale: the one about
 * the first week being hard, and the one about homework. Both set an
 * expectation that decides whether someone is still subscribed in month three,
 * and a refund in week two costs more than a signup that never happened.
 *
 * Shared between the pricing page and its FAQPage structured data, so the
 * rich result can never drift from what the page says.
 */
export const PRICING_FAQ: { q: string; a: string }[] = [
  {
    q: "Why isn't it free like Khan Academy?",
    a: "Khan is a library. The same lessons for everyone, funded by donors. This is a tutor: it holds a conversation with your child and remembers it for years, and every minute of that costs real money to run. So the free tier is limited by time rather than crippled by features. You get the actual product, just less of it each day.",
  },
  {
    q: "My child is 5 and can't read yet. Will this work?",
    a: "Yes, and that age is what it was built for. Under about 8, the Primer reads every question out loud and your child answers by talking. There is nothing to read before they can start and nothing to type. Letter sounds and blending are two of the nine modules, so learning to read is part of what it teaches rather than a prerequisite.",
  },
  {
    q: "Will it just do their homework?",
    a: "No, and it will say so if asked outright. That is the entire point of the product. If your child needs an answer for a deadline tonight, this is the wrong tool, and we would rather tell you here than take your money and disappoint you next week.",
  },
  {
    q: "What if my child hates it at first?",
    a: "Some do, usually in the first week, because being asked questions instead of handed answers is genuinely more work. Give it ten sessions. By the tenth it tends to look nothing like the first. If it still hasn't clicked, tell us and we will refund the month without asking why.",
  },
  {
    q: "How much screen time does this add?",
    a: "Less than you would expect. A session runs four to six minutes and most children do one or two. You set both the daily cap and the hours it will open at all, and outside those hours it simply won't start. There is also a screen free mode where the whole session is voice only.",
  },
  {
    q: "What happens to what my child says?",
    a: "Speech becomes text on the way through and the audio is deleted immediately. No voiceprint is stored anywhere. Nothing your child says is used to train a model, by us or by anyone we buy from, and that is contractual rather than a setting. You can export or delete everything from your dashboard at any time.",
  },
  {
    q: "Can I see what they talked about?",
    a: "Yes. Every session is in your dashboard in full, alongside a weekly summary written in plain English and a chart showing how much help each session took. If anything worrying comes up, the Primer stops the lesson and flags it to you the same minute.",
  },
  {
    q: "Can I cancel?",
    a: "Any time, from the dashboard, in two clicks. You keep access until the period you already paid for runs out, and we do not ask why or show you a retention offer on the way out.",
  },
];
