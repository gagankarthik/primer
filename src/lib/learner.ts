import { CHILD_LIST, type MockChild } from "@/lib/mock";
import { modulesForAge, MODULES, type LearningModule } from "@/lib/modules";
import { rankFor, type BadgeKind } from "@/lib/badges";

/**
 * LEARNER FACTS
 *
 * One place that turns a profile into the numbers the child area shows, so the
 * dashboard, the progress page and the leaderboard cannot disagree about how
 * a child is doing. Every page reading its own subset of the profile and doing
 * its own arithmetic is how a product ends up telling a parent two different
 * things on two screens.
 *
 * Nothing here counts minutes, sessions, or days in a row as an achievement.
 * Those appear as facts on the progress page because a parent asked "how much
 * is she using it", but they never feed a rank, a badge or a position, because
 * the moment they do, the fastest way to climb is to leave the app open.
 */

/** Badges are behavioural. In the built product these come off the session log. */
const EARNED: Record<string, BadgeKind[]> = {
  nell: ["climbed-back", "asked-why", "first-word"],
  harv: ["climbed-back", "asked-why", "own-mistake", "no-help", "long-haul"],
};

export function badgesFor(childId: string): BadgeKind[] {
  return EARNED[childId] ?? [];
}

export type TopicProgress = {
  slug: string;
  label: string;
  mastery: number;
  attempts: number;
  lastSeen: string;
  tender: boolean;
  module?: LearningModule;
};

/** Turns a topic slug into the module that teaches it, where one exists. */
function moduleForTopic(slug: string): LearningModule | undefined {
  const head = slug.split("-")[0];
  return MODULES.find((m) => m.id === slug || m.id.startsWith(head));
}

function labelForTopic(slug: string): string {
  const m = moduleForTopic(slug);
  if (m) return m.kidTitle;
  // Fall back to the slug made readable, rather than showing a slug.
  return slug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export function topicsFor(child: MockChild): TopicProgress[] {
  const tender = child.profile.emotional.tenderTopics;
  return Object.entries(child.profile.cognitive.topics)
    .map(([slug, t]) => ({
      slug,
      label: labelForTopic(slug),
      mastery: t.mastery,
      attempts: t.attempts,
      lastSeen: t.lastSeen,
      tender: tender.includes(slug),
      module: moduleForTopic(slug),
    }))
    .sort((a, b) => b.mastery - a.mastery);
}

export type LearnerFacts = {
  child: MockChild;
  name: string;
  badges: BadgeKind[];
  rank: ReturnType<typeof rankFor>;
  topics: TopicProgress[];
  /** Modules open at this child's age. Not "enrolled": nothing is locked behind completion. */
  open: LearningModule[];
  solid: number;
  needsWork: number;
  minutesThisWeek: number;
  sessionsThisWeek: number;
  /**
   * The leaderboard number. Deliberately not mastery, minutes or sessions:
   * it counts the things that are hard to do and impossible to fake, so the
   * child who finds everything difficult and keeps going can lead it.
   */
  effort: number;
};

export function factsFor(child: MockChild): LearnerFacts {
  const badges = badgesFor(child.profile.childId);
  const topics = topicsFor(child);
  const p = child.profile;

  const minutesThisWeek = child.sessions.reduce((s, x) => s + x.minutes, 0);

  // Comebacks: sessions where the help needed went down before the end. This
  // is the behaviour the whole product is trying to produce.
  const comebacks = child.sessions.filter((s) => {
    const t = s.rungTrace;
    if (t.length < 2) return false;
    return Math.max(...t) > t[t.length - 1];
  }).length;

  return {
    child,
    name: p.displayName,
    badges,
    rank: rankFor(badges.length),
    topics,
    open: modulesForAge(p.contextual.ageYears),
    solid: topics.filter((t) => t.mastery >= 0.7).length,
    needsWork: topics.filter((t) => t.tender || t.mastery < 0.4).length,
    minutesThisWeek,
    sessionsThisWeek: child.sessions.length,
    effort:
      badges.length * 3 +
      comebacks * 2 +
      (p.metacognitive.asksWhy ? 2 : 0) +
      (p.metacognitive.selfCorrects ? 2 : 0),
  };
}

/**
 * THE BOARD
 *
 * A top ten, drawn from this household plus other Primer learners in the same
 * age band. Three constraints on it, and the third is the one doing the work:
 *
 *  1. Peers are first name and initial only. No surnames, no schools, no
 *     avatars, nothing that identifies a child to another child. The board is
 *     a scoreboard, not a directory.
 *  2. Only learners within two years of age appear. A ten-year-old on a
 *     five-year-old's board is not a peer, it is a ceiling.
 *  3. It ranks EFFORT, never attainment. The number is badges (all
 *     behavioural), plus comebacks (sessions where the help needed went down
 *     before the end), plus asking why and self-correcting. Nothing in it
 *     rewards being ahead, being fast, or being on for longer.
 *
 * That third point is what makes a children's leaderboard survivable at all.
 * On an attainment board the child who finds everything hard loses every week
 * for years and learns something permanent from that. On this one they can
 * lead it, because the thing being measured is exactly what they are doing
 * more of than anybody else.
 *
 * BACKEND NOTE: peers are fixtures. When this is real, the query must filter
 * by age band and return first name + initial only, and it must never return
 * a child id that could be used to look anything else up.
 */
type BoardEntry = {
  id: string;
  name: string;
  rankTitle: string;
  rankArt: string;
  rankLevel: number;
  badges: number;
  effort: number;
  isHousehold: boolean;
};

/**
 * Other learners, first name and initial only.
 *
 * Built from a fixed name list and a deterministic score, not randomised: a
 * board that reshuffles on every render would move a child up and down the
 * page while they are looking at it, which is both confusing and dishonest.
 * When this is real the list comes from the API; the shape is what matters
 * here.
 */
const PEER_NAMES = [
  "Amara O.", "Theo B.", "Rosa M.", "Idris K.", "Mei L.",
  "Jonah P.", "Freya S.", "Caleb R.", "Anya D.", "Sol T.",
  "Noor H.", "Elias W.", "Priya N.", "Otto F.", "Zainab A.",
  "Rafi C.", "Isla G.", "Bruno V.", "Hana K.", "Milo J.",
  "Sadie E.", "Kofi B.", "Lena P.", "Arlo M.", "Yara S.",
  "Dev R.", "Nina T.", "Oscar L.", "Talia F.", "Emeka U.",
  "Ruby W.", "Kai N.", "Suri M.", "Felix D.", "Ada O.",
  "Hugo P.", "Leila B.", "Marco S.", "Iris H.", "Nadia K.",
  "Sami A.", "Poppy C.", "Ezra G.", "Lucia V.", "Tomas R.",
  "Bea M.", "Jude E.", "Sana Q.", "Rory F.", "Elin J.",
  "Nico B.", "Halle T.", "Omar Z.", "Wren D.", "Pia L.",
];

const PEERS: { id: string; name: string; age: number; badges: number; effort: number }[] =
  PEER_NAMES.map((name, i) => {
    // Deterministic spread: effort falls away smoothly down the list, ages
    // cycle across the 5 to 8 band, badges follow effort.
    const effort = 24 - Math.floor(i * 0.42);
    return {
      id: `p${i + 1}`,
      name,
      age: 5 + (i % 4),
      badges: Math.max(0, Math.round(effort / 5)),
      effort: Math.max(2, effort),
    };
  });

export function board(childId: string, limit = 10): {
  top: BoardEntry[];
  me: BoardEntry | null;
  myPosition: number;
} {
  const child = CHILD_LIST.find((c) => c.profile.childId === childId);
  const age = child?.profile.contextual.ageYears ?? 7;

  const fromHousehold: BoardEntry[] = CHILD_LIST.map(factsFor).map((f) => ({
    id: f.child.profile.childId,
    name: f.name,
    rankTitle: f.rank.title,
    rankArt: f.rank.art,
    rankLevel: f.rank.level,
    badges: f.badges.length,
    effort: f.effort,
    isHousehold: true,
  }));

  const fromPeers: BoardEntry[] = PEERS
    // Within two years either way. Further than that is not a peer.
    .filter((p) => Math.abs(p.age - age) <= 2)
    .map((p) => {
      const r = rankFor(p.badges);
      return {
        id: p.id,
        name: p.name,
        rankTitle: r.title,
        rankArt: r.art,
        rankLevel: r.level,
        badges: p.badges,
        effort: p.effort,
        isHousehold: false,
      };
    });

  const all = [...fromHousehold, ...fromPeers].sort((a, b) => b.effort - a.effort);
  const myPosition = all.findIndex((e) => e.id === childId) + 1;

  return {
    top: all.slice(0, limit),
    me: all.find((e) => e.id === childId) ?? null,
    myPosition,
  };
}

/** Just the children on this account, for the household strip. */
export function household(): LearnerFacts[] {
  return CHILD_LIST.map(factsFor).sort((a, b) => b.effort - a.effort);
}
