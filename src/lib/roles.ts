/**
 * ROLES
 *
 * Four, and they are not tiers of the same account. A parent is not an admin
 * with fewer buttons, and a creator is not a parent who writes. Each has its
 * own home, its own furniture, and its own idea of what the product is for:
 *
 *   learner   does the work. Sees no money, no ratings, no other households.
 *   parent    holds the account, the billing, the PIN, and the transcripts.
 *   creator   writes modules. Sees how children fare on THEIR modules only,
 *             aggregated, never a named child.
 *   admin     runs the platform. Sees accounts and safety, never a transcript
 *             unless a flag has escalated it.
 *
 * THE RULE THAT MATTERS, and the reason this file exists rather than a boolean
 * on the user record: visibility of a child's work narrows as you go up. An
 * admin has more power than a parent and *less* access to any individual
 * child. Most products get this backwards by treating admin as a superset,
 * which is how a support engineer ends up able to read a six-year-old's
 * sessions because they once needed to debug a billing bug.
 */

export type Role = "learner" | "parent" | "creator" | "admin";

export type RoleSpec = {
  role: Role;
  /** What this person calls themselves. */
  label: string;
  /** Where they land after signing in. */
  home: string;
  /** One line, for the role picker and the docs. */
  does: string;
  /** Stated plainly, because it is the product's central promise. */
  cannot: string;
};

export const ROLES: Record<Role, RoleSpec> = {
  learner: {
    role: "learner",
    label: "Learner",
    home: "/learning",
    does: "Works through modules, earns badges, and sees their own progress.",
    cannot:
      "Cannot change their own hours, cap or blocked modules, and cannot see another household.",
  },
  parent: {
    role: "parent",
    label: "Parent",
    home: "/parent",
    does: "Adds learners, sets the hours and limits, reads every session, and pays.",
    cannot: "Cannot see another family's data, and cannot publish a module.",
  },
  creator: {
    role: "creator",
    label: "Course creator",
    home: "/studio",
    does: "Writes modules, submits them for review, and sees how they perform.",
    cannot:
      "Never sees a named child, a transcript, or anything about a household. Module performance is aggregated only.",
  },
  admin: {
    role: "admin",
    label: "Admin",
    home: "/admin",
    does: "Reviews safety flags and submitted modules, and manages accounts.",
    cannot:
      "Cannot read a child's sessions unless a safety flag has escalated that specific session.",
  },
};

export const ROLE_ORDER: Role[] = ["learner", "parent", "creator", "admin"];
