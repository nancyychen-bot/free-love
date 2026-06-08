# Free Love — Design Document (v2)

*How we build the thing described in the [Manifesto](MANIFESTO-v2.md).*

Every design decision here should trace back to a principle in the Manifesto. If it doesn't, question it.

---

## Changes from v1

- **New §1: Brand position.** *Ethical dating app designed for something real.* Ethical = non-profit + safe for women + designed for depth. Matchmaking is the method, not the brand.
- **New §4: Full onboarding flow (~15 minutes).** Identity verification, a single safety-inclusive pledge, identity & seeking (gender / orientation / who you're looking for), life basics with explicit dealbreaker flagging, ranked qualities and values (private), light OCEAN personality inference, three life-question answers, two required photos (face + body), optional life signals.
- **New §5: "What others see."** Explicit public-vs-private profile model. Rankings and personality are private matching inputs. Public profile = photos + life-question answers + optional signals.
- **Matching philosophy made concrete.** Three matches per day. Rules-based scoring for structured data; small LLM for qualitative meaning of life-question answers; LLM also generates plain-language match explanations. Hard filter on sexuality and location; **no age filter** (we match on values, not generations).
- **New §7: Match → Meeting.** Active meeting prompts, optional voice/video call, first-date suggestions from shared profile content, safety nudges, post-date pulse.
- **New §8: Safety & verification expanded.** Identity verification at signup. Tiered abuse reporting (misrepresentation → manipulation → harassment) with scaled responses. Safety > privacy stated as the principle conflict resolution.
- **New §9: Governance.** Short-term founders, pre-launch advisory board (relationship researcher, trust & safety expert, women's safety advocate), public RFC process for matching changes, long-term non-profit board.
- **New core mechanics for v1:** three-conversation cap with holding space, closure notifications, inactivity enforcement (3-day nudge, 5-day lockout), pause mode, simplified removal flow ("why do you think you're not compatible?" with re-prompt for non-answers, reason never shown, optional goodbye note).
- **The Exit flow defined.** Asks if they found someone (for our north-star metric). No upsell, no donation prompt — the subscription is the whole funding model.
- **Sustainability model defined.** Flat-rate subscription (~$5/mo, TBD) after a 7-day free trial. Same price for everyone. Published finances. **Any surplus is donated** to relationship health, women's safety, and LGBTQ orgs.
- **Tech approach updated.** Rules-based matching engine independent of UI. Small (Haiku-class) LLM only for qualitative matching, explanations, and moderation flagging — never on raw aggregate data.
- **Removed "physical attraction"** from ranked qualities — we can't assess it fairly, so we don't pretend to.

---

## 1. Brand position

**Free Love is an ethical dating app designed for people who are looking for something real.**

"Ethical" carries three commitments:

1. **Non-profit.** We're not optimized to keep you single. We charge what it costs to run safely, no more. Any surplus is donated, not retained.
2. **Safe — especially for women.** Verified humans only. Zero tolerance on abuse. Safety built in, not bolted on.
3. **Designed for depth and real outcomes.** A few curated matches. Substance over swiping. Mechanics that reward presence over volume.

Matchmaking is the *methodology* — not the brand. The brand is ethics in service of love.

---

## 2. Design principles → product mechanics

| Principle | Mechanic |
|---|---|
| Optimize for exits | "We found each other" flow. Asks only if they found someone — for our north-star metric. No upsell. |
| No pay-to-win | Single flat-rate subscription. No tiers, boosts, super-likes, paid visibility. Surplus is donated. |
| No surveillance | Minimal data. Open & editable match profile (you see what we know). No third-party trackers. |
| No secret ranking | No desirability score. Matching is open source and explainable per match. |
| No addictive loops | Three matches per day. No deck. No variable-reward animations. |
| The whole person | Profiles built around life — photos, voice, signals. Photos present, never the only thing. |
| Accountability | Three-conversation cap with holding space. Closure notifications. Inactivity lockout. |
| Safety as a product | Identity verification at signup. Tiered abuse response. Safety > privacy when they conflict. |
| Open source as trust | Public repo, readable matching code, public RFC process, "why this match?" explanations. |

---

## 3. The matching philosophy

We match on *stated compatibility* and *demonstrated values* — transparently. Structured data is matched with rules. Language is matched with a language model. Both are explainable.

### Inputs

- **Identity & seeking** — your gender, sexual orientation, who you're looking for. Foundational.
- **Location radius.**
- **Life basics** — concrete questions (kids, smoking, religion, lifestyle). Each answer can be marked as a personal dealbreaker.
- **Ranked qualities & values (top 5 each)** — private matching input, not shown on your profile.
- **Personality dimensions** — inferred from a small set of questions, matched against what people say they're looking for. Private.
- **Three life-question answers** — public, in your own words.
- **Optional life signals** — songs, spaces, bookshelves, places you love.

### How matching works

1. **Hard filters** — sexuality compatibility, location radius, and each user's individual dealbreakers.
2. **Rules-based scoring on structured data** — weighted overlap on rankings, values, personality dimensions, and life-basics overlap. Pure functions, fully testable. Each user's weights are visible.
3. **LLM scoring on qualitative data** — a small (Haiku-class) model reads life-question answers and assesses meaning overlap between two people. Outputs a score *and* a short rationale. This is where we beat other apps: we read what people actually wrote.
4. **Combined score → top three matches per day** — surfaced with care.
5. **Plain-language explanation** — same LLM converts the full rules + qualitative output into a readable "here's why we surfaced you two."

### Where AI is used — and where it isn't

| Task | Method |
|---|---|
| Structured matching (rankings, demographics, life basics) | Rules-based, no LLM |
| Qualitative matching (life-question answers) | Small LLM, read in summary form, scored + rationale |
| Match explanations | Same LLM, generates plain-language summary |
| Moderation flagging | Small LLM, flags for human review |
| Photos | Never processed by LLM |
| Removal "challenge" question | Templated, not LLM-generated |

AI is used where it adds clear value — understanding language — and avoided where structured rules are more honest and auditable.

### Explainability

For every match, the system must answer *"Why these two?"* in plain language. If we can't explain it, we don't ship it.

---

## 4. Onboarding — your profile, built in 15 minutes

**It takes about 15 minutes.** Front-loaded effort instead of hours of swiping. Autosaves. Come back whenever.

**Public vs. private is explicit.** Each step tells you whether your answer is visible to matches or used only as a matching input. Rankings, personality, and dealbreaker flags are *private*. Photos, life-question answers, and life signals are *public*.

### 1. Identity verification *(private)*

Third-party verification before anyone enters the platform. No unverified humans.

### 2. The pledge *(internal)*

A single explicit pledge — one signature. Includes safety directly:

> *I am who I say I am, and my profile accurately represents who I am. I will engage with respect and honesty. I will not harass, coerce, or send unsolicited explicit content. When I'm done with a conversation, I'll say so — not vanish. I'll report unsafe behavior and trust it will be taken seriously. I understand violations end my account, permanently.*

### 3. Identity & seeking *(private — used for filtering)*

- Your gender identity.
- Your sexual orientation.
- The gender(s) of the people you want to be matched with.
- Your location.

### 4. Life basics — the dealbreaker questions *(answers private; dealbreaker flag private)*

We ask the actual questions whose answers could be dealbreakers. For each, you answer — and optionally flag as a hard line.

- Do you want kids?
- Do you smoke?
- Do you drink?
- Religious practice and importance.
- Politics, broadly.
- Lifestyle / pace.
- (Others TBD — kept tight.)

Marking something as a dealbreaker means we *will not match you* across that line. Without a flag, it's a soft factor.

### 5. Ranked qualities *(private matching input)*

Pick and rank your **top 4 qualities** from a curated set: intelligence, humor, ambition, kindness, creativity, emotional intelligence, stability, adventurousness.

Rankings can be edited but never *flattened*. You can swap, reorder, replace. You cannot say "all four are equal." The forced choice is the whole point.

### 6. Ranked values *(private matching input)*

Pick and rank your **top 5 values** from a curated set: open-mindedness, discipline, loyalty, independence, spirituality, family orientation, intellectual curiosity, generosity, authenticity.

Same rules — editable, not flattenable.

### 7. Light personality questions *(private — inferred profile)*

A small set of questions designed to infer where you sit on the Big Five (OCEAN) dimensions — no 100-question quiz. We match the inference against what people say they're looking for in their life-question answers.

### 8. Three life-question answers *(public)*

Easy to answer, deeply revealing:

1. **"The kind of people I'm drawn to."**
2. **"What a good life looks like to me."**
3. **"Something I've learned about myself recently."**

These appear on your public profile *and* are read by the LLM for matching.

### 9. Photos — two required *(public)*

- **One face photo.** Clear, recent.
- **One full-body photo.**

Plus optional additional photos. We require these two so people aren't matched on a face alone or a body alone — both are honest signals.

### 10. Life signals *(public, optional)*

A song, a photo of your space, your bookshelf, what you're cooking, a place you love. Add what you want now, more anytime.

### Output: your match profile

A document that captures everything — private and public — used for matching.

- **Open** — you can read it anytime. No secret model of you.
- **Editable** — change rankings, rewrite answers, swap signals.
- **Constrained** — rankings reorderable but never flattenable.
- **Evolves with consent** — when the system learns from your behavior, it surfaces the inferred change to you before applying. You confirm or reject.

---

## 5. What others see — your public profile

When you're surfaced as a match, this is what the other person sees:

- Your two required photos (face + body), plus any optional photos.
- Your three life-question answers.
- Your optional life signals.
- The plain-language **"why this match?"** explanation — generated for both people, drawing on the underlying compatibility without exposing your rankings.

What others do *not* see:
- Your ranked qualities or values.
- Your personality profile.
- Which life basics you flagged as dealbreakers (they only know it because they passed the filter).
- Your private notes or AI-inferred preferences.

The "why this match?" explanation is the bridge — it can say *"you both rank intellectual curiosity highly"* without revealing each person's full ranking.

---

## 6. Core feature set (v1)

### Introductions — three per day

Each match comes with a plain-language "why this match?" explanation, the public profile, and the option to open a conversation, pass, or save for tomorrow. No deck, no swiping.

### Conversations — three at a time, with holding space

- Maximum three open conversations at any moment.
- Remove someone and they get a closure notification.
- **Holding space:** matched with someone whose slots are full? Your intro queues. They're notified, review your profile, decide whether to make room.

### Messaging

Clean and private. Optional opening-question suggestions (help, not ghostwriting). No read receipts as pressure. No anxiety-inducing typing indicators.

### The removal flow

One question: **"Why do you think you're not compatible?"** A non-answer ("not feeling it") re-prompts. If your reason is a safety concern, the flow routes to safety reporting first (see §8).

The other person never sees your reason. They're offered the option to send a final goodbye note in their own words.

### Accountability mechanics

- **Three-conversation cap** (structural).
- **Closure notifications** (no ghosting).
- **Inactivity enforcement** — 3-day nudge, 5-day lockout.
- **Pause mode** — for travel, illness, stepping back. Pauses cleanly, no penalty.

### The Exit

When someone deletes or pauses, the system asks: *did you find someone?*

- **If yes** — celebrate it. Optionally capture the story (with permission). Graceful offboard. No ask, no upsell.
- **If no** — let them go without friction. Come back anytime.

### Data transparency

Exactly what we store and why, viewable any time. Plain language. Links to your match profile.

### Explicitly NOT in v1

Infinite swipe deck · boosts/super-likes · "see who liked you" paywall · read receipts as pressure · desirability scores · streaks/gamification · ads · third-party trackers · premium tiers · age filters.

---

## 7. Match → meeting

The conversation is a *bridge*, not a destination.

- **Active meeting prompts.** After ~7-10 substantive messages (or 5 days), the app asks both people independently: *"Ready to plan something?"* If both say yes, it surfaces suggestions.
- **Optional voice/video call.** Facilitates a 10-15 minute call before meeting in person — no phone-number exchange needed.
- **First-date suggestions.** From shared profile content. Low-cost, public, fits both.
- **Safety nudges.** Public space by default. Share your plans with a friend reminder. Optional check-in: *"Are you safe?"*
- **Post-date pulse.** Lightweight, optional: *"How did it go?"* If both positive → encourage continuing. If one disconnects → removal flow. If safety concern → escalation.

---

## 8. Safety & verification

Safety is a launch requirement, not a roadmap milestone.

### Identity verification

- Third-party at signup. Provider TBD (Persona, Stripe Identity, Jumio).
- Verify, then minimize what's kept.
- **Safety > privacy** when they conflict.

### Tiered abuse reporting

When you report someone, you select the category and (for serious cases) write a short explanation. Response scales:

| Tier | Example | Response |
|---|---|---|
| **Misrepresentation & boundary issues** | Inaccurate profile, pushing pace before someone's ready | Logged. Three strikes across reporters → removal. |
| **Deception & manipulation** | Material lies (married, fundamental misrepresentation), manipulative patterns | Human moderator review within 24h. Short explanation required. |
| **Harassment & harm** | Threats, unsolicited explicit content, coercion, stalking | Immediate suspension pending review. Short explanation required. Default: permanent removal. |

Categories and example sets to be expanded in a separate safety policy document. Patterns across categories are tracked — multiple low-severity reports against the same person escalate. Appeals exist; the default protects the reporter.

### Moderation

Human review for non-trivial cases. LLM-assisted flagging for scale. Moderation is the largest cost line and the subscription must sustainably cover it.

---

## 9. Governance — who decides

**Short-term:** founders (Justin & Nancy).

**Pre-launch:** assemble a public advisory board, named on the site:
- A relationship researcher.
- A trust & safety expert.
- A women's safety advocate.
- (Optional) An open-source community representative.

Advisors review and sign off on matching logic and moderation policy before launch.

**Live:** public RFC process for any change to the matching algorithm.

**Long-term:** registered non-profit with a real board.

**Headline:** *founders decide, advisors check, community sees.*

---

## 10. Technical approach

- **Framework:** Next.js (App Router).
- **Language:** TypeScript end to end.
- **DB:** PostgreSQL (Neon or self-hosted).
- **Auth:** email + passwordless or privacy-respecting provider.
- **Identity verification:** third-party API.
- **Matching engine:**
  - Rules-based scoring for structured data (rankings, demographics, life basics, personality dimensions). Pure functions, fully testable.
  - Small (Haiku-class) LLM for qualitative scoring of life-question answers — operating on per-pair summaries, never on aggregate user data.
  - Combined into a single explainable score.
- **LLM also used for:** match explanations, moderation flagging.
- **Match profile:** structured data + Markdown rendering. User-readable, user-editable.
- **Hosting:** Vercel for convenience, kept portable.
- **License:** AGPL.

**Architectural rules:**
- Matching engine is auditable end to end — anyone reading it should understand how a match was scored.
- The match profile is queryable, readable, and editable by its owner at all times.
- No LLM ever sees raw aggregate data — only per-match summaries.

---

## 11. Sustainability — at-cost subscription

We charge what it costs to run a safe, ad-free, human-moderated platform. Same price for everyone.

- **7-day free trial.**
- **Flat-rate subscription after trial.** Target around $5/month. Exact TBD.
- **What it covers:** hosting, DB, identity verification, LLM API, moderation (largest line), domain, support.
- **Published finances.** Quarterly. Where every dollar goes.
- **Any surplus is donated.** To organizations working on relationship health, women's safety, and LGBTQ support. We do not retain profit.
- **No exit donations, no upsells.** The subscription is the whole funding model.

Closer to Patreon-for-platform than Tinder. We're charging at-cost because we refuse to monetize anything else.

---

## 12. Open questions

- **Name** — is it *Free Love*? Lock before identity work.
- **Legal entity** — fiscal sponsor first, registered non-profit later.
- **Identity verification provider.**
- **The compatibility question set** — the actual content of ranked qualities, values, personality questions, dealbreaker questions, life questions. **The most important creative work in the whole project.**
- **Life signals taxonomy** — what curated set users can choose from?
- **Life basics list** — exactly which questions become dealbreaker-eligible? (Kids, smoking, religion, politics seem clear. What about lifestyle, finance, location-rootedness?)
- **First city / community** — ICP is 30s, dating-app-fatigued, big city. NYC leading.
- **Exact subscription price** — model against per-user costs.
- **Age treatment** — is *no filter* the right stance, or do we want a "see ±10 years" default that users can change? Currently no filter. Worth revisiting after early matches reveal whether values-only matching produces life-stage mismatches.
- **Match explanation prompt** — the one AI surface users see; it has to be good.
- **Donation recipients for surplus** — pick the partner orgs ahead of time, not reactively.

---

## 13. Roadmap

1. **Lock the foundation** — name, license, the compatibility question set, life signals taxonomy, first city, donation recipients.
2. **Assemble advisory board.**
3. **Safety & verification first** — identity flow, tiered abuse reporting, moderation tooling.
4. **Matching engine** — rules engine + LLM qualitative scoring, transparent and tested.
5. **Onboarding flow** — the 15-minute experience.
6. **Match explanations** — the LLM layer that converts scoring into language.
7. **Thin vertical slice** — profile → three daily intros → "why this match?" → conversation (3-cap) → match-to-meeting → closure flow.
8. **Exit flow + metrics.**
9. **Quiet beta** — NYC, dating-app-tired, 30s.

---

*Every line of this should serve the [Manifesto](MANIFESTO-v2.md). When in doubt, re-read it.*
