# Free Love — Design Document

*How we build the thing described in the [Manifesto](MANIFESTO.md).*

This is a living document. Every design decision here should trace back to a principle in the Manifesto. If it doesn't, question it.

---

## 1. Design principles → product mechanics

Each Manifesto principle implies concrete product mechanics. This table is the bridge between ethics and features.

| Principle | Mechanic |
|---|---|
| Optimize for exits | A real "we found each other" flow that closes accounts gracefully and (optionally) asks why it worked. This is our core analytics + our marketing. |
| No pay-to-win | One flat optional membership/donation tier. No boosts, no super-likes, no paid visibility. Same experience for payers and non-payers. |
| No surveillance | Minimal data model. Clear data inventory page. No third-party trackers. Self-hostable. |
| No secret ranking | No desirability score. Matching is rule + compatibility based, open source, and *explainable per match*. |
| No addictive loops | No infinite deck. A small, finite set of considered introductions per cycle. No variable-reward animations. |
| Substance first | Written prompts and values surfaced before or beside photos. Photos can be progressively revealed. |
| Accountability | Conversation check-ins, kind-closure flows, light reputation that rewards good behavior (never a public score). |
| Open source as trust | Public repo, readable matching code, "why this match?" explanations available to users. |

---

## 2. The matching philosophy

This is the core differentiator, so it gets its own section.

**The incumbents match on faces and proximity, then secretly re-rank by desirability.** We match on *stated compatibility* and *demonstrated values*, transparently.

### Inputs we care about
- **Values & life questions** — long-form and structured answers about how someone wants to live, love, fight, rest, parent, grow. (OkCupid's old match-% intuition, before it was bought and hollowed out.)
- **Dealbreakers, explicitly** — things that are non-negotiable, weighted heavily and respected absolutely.
- **Written voice** — prompt answers in someone's own words. This is where modern language models earn their place: understanding *meaning*, not matching keywords.
- **Reciprocity & effort** — who actually shows up and engages kindly, surfaced gently as a positive signal.

### How matching works (v1 sketch — to be refined)
1. **Hard filters** — dealbreakers and basic logistics (location radius, age range, what each person is looking for). Non-negotiable.
2. **Compatibility scoring** — weighted overlap on values/life questions, where *each user* controls which questions matter to them. Transparent and inspectable.
3. **Optional LLM depth pass** — on written answers, surface genuine shared ground and tension, and generate a human-readable "why you two were surfaced." Always explainable, never a black box, never fabricating chemistry.
4. **Finite, considered introductions** — a small batch per cycle, not an endless deck.

### Explainability requirement
For every match we surface, the system must be able to answer: *"Why these two?"* in plain language the users can read. If we can't explain it, we don't ship it.

---

## 3. Core feature set (v1)

Deliberately small. Everything here serves a principle; nothing here exists to drive engagement.

- **Profiles** — values/life questions, written prompts, dealbreakers, progressively-revealed photos.
- **Introductions** — a finite, considered batch of mutually-surfaced people per cycle, each with a "why this match?" explanation.
- **Messaging** — clean, private, with optional opening-question suggestions (help, not ghostwriting).
- **Accountability mechanics** — gentle check-ins, kind-closure flow, light positive-only reputation.
- **The Exit** — a real "we found each other" flow that gracefully offboards, optionally captures the story, and feeds our north-star metric.
- **Data transparency page** — exactly what we store and why, viewable any time.

### Explicitly NOT in v1 (and mostly never)
Infinite swipe deck · boosts/super-likes · "see who liked you" paywall · read receipts as pressure · desirability scores · streaks/gamification · ad SDK · third-party trackers.

---

## 4. Technical approach

You and Nancy can code, so here's a concrete, opinionated starting stack. All of it is open-source-friendly and self-hostable, which matters for the trust promise.

- **Framework:** Next.js (App Router) — one codebase for web + API, deploys anywhere, easy for contributors.
- **Language:** TypeScript end to end.
- **DB:** PostgreSQL (via an open provider — Neon, Supabase, or self-hosted). Relational fits the compatibility/matching model well.
- **Auth:** email + passwordless or a privacy-respecting provider; minimal PII.
- **Matching:** start as a transparent service module (pure functions, fully testable) so the logic is readable and auditable. LLM depth pass is an *optional, isolated* step behind a clean interface — swappable, and the app works without it.
- **Hosting:** deployable to Vercel for convenience, but kept portable/self-hostable on principle.
- **License:** an OSI-approved open source license (likely AGPL, to keep derivatives open — TBD, see §6).

**Architectural rule:** the matching engine must be a pure, well-tested module independent of the UI and the AI layer. It's the heart of the product and the thing people will audit — it should read like a book.

---

## 5. Non-profit & sustainability

- **Costs to cover:** hosting, database, domain, email, moderation/safety, and any LLM API usage.
- **Funding:** transparent optional flat-rate membership or donations. Published finances. Never advantage-for-sale.
- **Structure:** TBD — fiscal sponsorship vs. a registered non-profit vs. a simple open collective. (See roadmap.)

---

## 6. Open questions to resolve

These are real decisions, several of them yours and Nancy's, not technical defaults:

- **Name** — is it *Free Love*? Lock it before we build identity.
- **License** — AGPL (forces openness) vs. MIT (maximizes adoption)? This is a values call.
- **Legal entity** — non-profit vs. fiscal sponsor vs. open collective.
- **Safety & moderation** — the hardest unglamorous problem in any dating product. Needs a real plan before launch (verification, reporting, harassment handling, blocklists).
- **The compatibility question set** — what do we actually ask people? This is product design *and* relationship philosophy. Arguably the most important creative work in the whole project.
- **Geography for v1** — a single city/community to start dense, or open? Dense beats broad for a dating product.

---

## 7. Roadmap (rough)

1. **Lock the foundation** — name, license, the compatibility question set, data model. (Mostly design, little code.)
2. **Matching engine first** — build the transparent, tested matching module in isolation, with fixture data. Prove the core idea works before any UI.
3. **Thin vertical slice** — profile creation → introductions → "why this match?" → message. The smallest thing that feels like Free Love.
4. **Safety layer** — verification, reporting, moderation. Non-negotiable before real users.
5. **The Exit flow + metrics** — make sure we can measure and celebrate success from day one.
6. **Quiet beta** — a small, dense community (maybe literally our friends). Learn, refine, keep it honest against the Manifesto.

---

*Every line of this should serve the [Manifesto](MANIFESTO.md). When in doubt, re-read it.*
