# Free Love — Growth Strategy (v2)

*How a non-profit dating app actually finds its users.*

The hardest problem in dating products is **cold-start liquidity**. Ethical, beautiful, ethically-funded apps die all the time because they couldn't get to local density. This document is our explicit answer to that risk — separate from the Manifesto (ethics) and the Design (product), because growth is its own discipline.

The honest premise: **we will not out-spend Tinder, Hinge, or Bumble.** We will out-position them. Growth has to come from values-aligned community, not paid acquisition.

---

## Changes from v1

- **§2: Strategic position rewritten.** Hook lines updated from "three matches a day" to threshold-based curation and matchmaking price anchor. Proof layer adds billing pause.
- **§3: Cold-start phases updated.** Phase 0 explicitly free. Phase 1 paid from day one (willingness to pay is the viability signal). Match cadence replaced with threshold-based surfacing. Added honest pool disclosure at signup. Added pre-registered viability threshold with segmented conversion metric.
- **§5: Narrative updated.** One-liner and three-sentence pitch rewritten for threshold-based matching and billing pause.
- **§7: Metrics expanded.** Added match-frequency distribution, 30-day introduction coverage, drought-pause billing months, and segmented trial conversion.
- **§8: Unit economics rebuilt as sensitivity model.** Replaced single point estimate with two-axis grid (verification cost x user lifetime). Added verified provider pricing (Aug 2026). Flagged drought-pause revenue haircut, re-verification question, and structural tension between short lifetimes and amortized costs. Price no longer locked at $5.
- **§9: Two new risks added.** Unequal match distribution (emergent tiering) and drought-pause revenue impact.

---

## 1. Who we're for — the ICP

**The first user we're building for:**

- **Age:** late 20s to mid 40s, with the center around 35.
- **Geography:** dense urban — places where mainstream dating apps are most exhausting because the option-overload is highest. NYC is the leading candidate for v1.
- **State of mind:** *fatigued* by Tinder / Hinge / Bumble. Has paid for premium tiers. Has been ghosted, gaslit, or treated as disposable. Suspects the whole industry is broken.
- **Looking for:** something real — a partner, not a pastime. Probably some hybrid of seriously dating and quietly cynical about whether tech can help.
- **Values-aligned:** cares about ethics, privacy, design, and isn't allergic to spending $5/month on a thing that won't burn them.

**They are not:**
- 21-year-olds looking for fun (this app would frustrate them).
- People who don't want to be vetted or invest 15 minutes upfront.
- People deeply committed to the "deck-of-faces" model — we won't serve them.

**Sharper one-line ICP:** *A 33-year-old in NYC, Brooklyn, or DC who is paying $30+/month across three apps, feels worse using them than they did a year ago, and would pay $5 for something that promised one thing: this is for adults looking for something real.*

---

## 2. The strategic position

There is a specific structural position no incumbent can occupy: **non-profit + safety-first + curated/considered**.

We do not lead with "non-profit" in marketing — that's a *trust receipt*, not a hook. We lead with what people actually feel:

- *"An ethical, non-profit dating app that introduces you to someone only when there's an actual reason to. $5 a month. No swiping, no deck, no filler."*
- *"Matchmakers charge $5,000 for three introductions. We think curation that careful shouldn't cost more than a coffee."*
- *"The dating app that wants to lose you as a user."*

The hook is **curation + relief from the casino**. The proof is **non-profit, open source, verified humans, billing that pauses when we give you nothing**.

---

## 3. The cold-start strategy: density before scale

A dating product is worthless without local density. **We start tiny on purpose.**

### Phase 0 — Friends-of-friends (target: ~100 users, free)

- Personal recruiting from Justin and Nancy's networks in NYC.
- Each early user explicitly invited because they fit ICP — not opportunistically.
- Closed beta. Friction-by-design: invite link only. **No charge** — this phase exists to prove the engine, not test willingness to pay.
- **Matches surfaced only when someone clears the compatibility floor.** With ~100 users the floor will be crossed less often — that's honest, and a few genuine introductions per week still beats the swipe casino.
- Goal: prove the matching engine, validate onboarding length, find bugs, collect real feedback. No growth, just signal.

### Phase 1 — One city, dense (target: ~1,000 users, paid)

- **NYC only.** Public launch but geo-locked.
- Recruit through values-aligned communities (see §4).
- **Everyone from Phase 1 onward pays after the 7-day trial.** Willingness to pay is the viability signal; a free product proves nothing.
- **Matches surfaced when they clear the floor, capped at three per day.** Some users will get zero on many days — that is a correct output and the UI says so (see DESIGN-v3 §6).
- Track: time-to-first-match, time-to-first-meeting, NPS, exits/100, **match distribution (not just averages)**.
- **Honest pool disclosure at signup.** Tell people the pool size in their filters before they enter a card. Charging is defensible; charging while implying density we don't have is not.

#### Pre-registered viability threshold (write down before Phase 1 opens)

- **Trial → paid conversion that counts as viable:** ____%
- **Measured over:** first 90 days of Phase 1.
- **Segmented by:** users who received ≥1 introduction during trial vs. users who received zero. These are different products and must never be averaged together.
- **What we do if we miss it:** fix the engine / fix recruiting / kill. Name which, now.

The risk of charging early isn't that people won't pay. It's that a low conversion number is uninterpretable — you won't know whether it means "the product doesn't work" or "the pool was thin in month one." Deciding the threshold after seeing the number guarantees you rationalize whichever answer you prefer.

### Phase 2 — Selective city expansion (target: ~10,000 users)

- Open one new city at a time. Likely candidates: Brooklyn-specific tier, then SF, LA, DC, Boston, Chicago.
- Each new city has a soft launch within its own density (city radius matching, not "open to anyone").
- We refuse to open a city until ICP density is provable.

### Phase 3 — Open expansion

- Only after the core product, safety operations, and unit economics are battle-tested.
- Likely earliest: 18 months post-launch.

---

## 4. Channels — where we recruit

We are not buying ads. We are showing up in the places where ICP already gathers.

### Reddit — the primary channel

Communities where ICP self-identifies:

- **r/Tinder, r/Hinge, r/Bumble** — natural complaint zones. Engage authentically with the *frustration*, not the product. Founder posts about why we built Free Love. AMA-style.
- **r/datingoverthirty** — direct ICP match. Highest priority sub.
- **r/AskWomen, r/AskMenOver30** — values discussions, not promotion. Be useful first.
- **r/selfhosted, r/privacy, r/opensource** — the technical-ethical crowd who'd love this on principle and bring loud word-of-mouth.
- **r/AskNYC, r/Brooklyn** — geographic.

**Rule:** never astroturf. Founders post under their real names. Free Love is mentioned only when relevant. Goal is to build a reputation as the people who get it, not the people pushing a thing.

### Twitter / X

- Founder voices, not a brand account.
- Quote-tweet the dating-app industrial complex when it deserves it. Public posture: "here's what we're doing differently."
- Long-form threads on the philosophy. The market research is genuinely interesting content — release it publicly.

### Substack / Medium / longform

- "The Manifesto" published as an essay. Public, free, sharable.
- "The Market Research" published as an essay (lightly edited). Substantive, credentialing, picked up by anyone writing about dating.
- Founder essays on specific design decisions: *"Why we don't have a swipe deck."* *"Why we charge $5/month."* *"Who decides the matching algorithm."*

### Press — selective, late

- Hold press for after the closed beta proves outcomes (real exits).
- Target outlets: The Verge, NYT Styles, NY Mag, The Cut, 404 Media, Platformer, Defector.
- The story is *"Two friends built a non-profit dating app that only introduces you when there's a real reason to — and pauses your subscription when it can't."* Reporters will want to write this.

### Direct community — the highest-leverage channel

The single most defensible source of long-term growth: **people who found their partner here, telling people they know.**

- Every exit is potentially a word-of-mouth event.
- Optional (always optional) "share your story" with offboarding — used in marketing only with explicit permission.
- A small "I found my person here" referral mechanism (no rewards — just a one-click "send to a friend who needs this" with a personal note).

### Partnerships — low priority, high care

- Therapists / matchmakers / dating coaches who already work with ICP. Possible referral relationships — never paid, never exclusive. They mention us because they think we help.
- Specific values-aligned communities (queer-focused orgs, intentional living communities, etc.) — if we choose to focus on one demographic first, partnership-based entry beats anything else.

---

## 5. The narrative — what we say

### One-liner
*"An ethical, non-profit dating app that introduces you to someone only when there's an actual reason to. $5 a month. No swiping, no deck, no filler."*

### Three-sentence pitch
*"Free Love is a non-profit dating app built on one inversion: we succeed when you leave us, because you found your person. No swipe deck, no paid visibility, no surveillance — just curated introductions when someone actually clears your bar, real conversations, and a platform that wants you off it. $5 a month, same for everyone, at-cost — and if we don't introduce you to anyone, we don't charge you."*

### Founding story
- Two friends, tired of dating apps. Saw the FTC settlement, saw the math (98% of Match's revenue from users), realized the conflict of interest was structural.
- Decided to build the version they wished existed.
- Not a startup. Not raising. Open source from day one.

### What we don't say
- "Disrupt dating." (Trite.)
- "Find love faster." (We don't optimize for speed.)
- "AI-powered matching." (We use AI minimally and we're proud of that.)
- Anything that sounds like a tech bro pitch.

---

## 6. The seeding asymmetry — recruit women first

A truth nobody likes to write down: **for hetero dating products, density of women determines survival.**

We design every recruitment effort around women-first density:

- Phase 0 / Phase 1 recruiting prioritizes women in ICP.
- The safety messaging is the front door for women specifically.
- Once women's density is plausible, men will follow.
- Inverted launch (men first) has killed countless products. We refuse.

For queer / WSW / WSM / non-binary cohorts, the same logic applies dimension-by-dimension: density of the seeking-cohort matters more than total signups.

---

## 7. What we measure (and what we don't)

**Track:**
- Successful exits per month (north star)
- **% of active users who received ≥1 introduction in the last 30 days** (distribution health)
- Match-frequency distribution (bottom decile vs. median — alert when bottom decile <20% of median)
- Time to first match
- Time to first meeting (in person)
- Match → meeting conversion %
- Conversations that lead to meetings %
- 30-day retention (only as a *minimum* — high retention is failure for us)
- Safety reports filed + resolved
- Trial → paid conversion % (**segmented by**: received ≥1 intro during trial vs. received zero)
- Billing months paused (drought) as % of total active-user-months
- Cost per acquisition (organic only)

**Don't track as goals:**
- Total users (vanity)
- DAU/MAU (anti-goal)
- Time in app (anti-goal)
- Match counts per user (more matches ≠ better)

---

## 8. Unit economics — sensitivity model

(Previous version used a single point estimate of ~$3.00/user/month with $0.30 for verification. That figure was low and the model was decorative. This version requires real numbers before locking the subscription price.)

**Per-user monthly cost components:**
- Hosting + DB: ~$0.10
- Identity verification: see sensitivity grid below
- LLM API (match explanations, moderation): ~$0.50
- Human moderation: ~$1.00 **(this is still a guess — get real numbers from someone who has run T&S at a consumer social product)**
- Support + ops: ~$0.50
- Buffer + non-profit overhead: ~$0.60
- **Drought-pause revenue haircut:** estimate what fraction of active-user-months will be non-billing under the automatic billing pause (see DESIGN-v3 §11). Unmodeled and could be significant in Phase 1 when density is lowest.

**Verification pricing (Aug 2026, verified):**

| Provider | Per verification | Platform fee | Notes |
|---|---|---|---|
| Didit | ~$0.03 | — | Cheapest published; from Didit's own comparison marketing — get a direct quote |
| Veriff Essential | $0.80 | $49/mo | Tier for unregulated industries — likely best fit |
| Stripe Identity | ~$1.50 | none | Document + selfie. Simplest if subscriptions run on Stripe |
| Sumsub | ~$1.35–1.50 | ~$149/mo min | |
| Persona | ~$1.50 commonly; $2–5 by config | from $250/mo | Has a startup program worth asking about |

**Market direction:** verification pricing is rising, not falling — deepfake-driven fraud is increasing demand and vendor cost. Model an annual increase.

**The structural tension:** verification is a one-time cost amortized over user lifetime. Our north star is *short* lifetimes. At Stripe's ~$1.50 and a 6-month lifetime, that's ~$0.25/month. At 2-month lifetime, $0.75/month. **The better this product works, the worse the per-month unit economics get.**

**Sensitivity grid — find the subscription price that survives the worst plausible cell:**

| Verification cost | 2-mo lifetime | 4-mo lifetime | 6-mo lifetime | 12-mo lifetime |
|---|---|---|---|---|
| $0.30 | ~$2.85/mo | ~$2.78/mo | ~$2.75/mo | ~$2.73/mo |
| $0.80 | ~$3.10/mo | ~$2.90/mo | ~$2.83/mo | ~$2.77/mo |
| $1.50 | ~$3.45/mo | ~$3.08/mo | ~$2.95/mo | ~$2.83/mo |

*(Each cell = fixed costs $2.70 + amortized verification. Does not include drought-pause haircut or re-verification cost for returning users.)*

**Re-verification:** do returning users re-verify? If verification data is discarded per DESIGN-v3 §8's verify-then-minimize policy, the answer is yes — every returning user is a fresh charge. Decide and document.

**Do not lock the subscription price until:**
1. Real moderation numbers replace the $1.00 guess
2. Drought-pause revenue haircut is estimated
3. Re-verification policy is decided
4. At least one provider is quoted directly

If the honest number is $8, charge $8 and publish the math — that's more on-brand than a cheap price we quietly can't sustain.

**The critical sensitivity remains moderation cost.** It is the dominant variable, and a guess on the largest cost line makes the whole model decorative.

---

## 9. Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| Cold-start fails (no local density) | Existential | Single-city launch, dense ICP recruiting, refuse to expand prematurely. |
| Women's density too low | Existential for hetero matching | Women-first recruiting, safety-first messaging. |
| Unequal match distribution (emergent tiering) | High | Quality threshold means some users get frequent intros and some get droughts for weeks. Instrument distribution from day one. Transparent floor-relaxation offered, never silently applied. Publish "% of active users who received ≥1 intro in last 30 days." |
| Drought-pause revenue impact | Medium | Automatic billing pause during droughts (21 days with zero intros) could cut revenue significantly in early phases when density is low. Model the haircut before locking price. |
| Moderation cost > subscription revenue | High | Tight ICP (engaged adults less likely to misbehave), aggressive zero-tolerance, automated triage with human review only on edge cases. |
| Press cycle without product readiness | Medium | Hold press until exits are real. |
| Founder bandwidth | Medium | Two founders is thin. Identify community contributors early. Open source helps. |
| Identity verification breach | High | Minimize stored PII. Verify-then-discard model. Pick provider with strong security record. |
| Competitor copies the model | Low | They structurally can't (Match's revenue model precludes it). Smaller players might — but we have first-mover credibility. |

---

## 10. Open questions

- **Which specific NYC sub-community do we recruit through first?** (Brooklyn creatives? Manhattan finance? Tech? A specific neighborhood?)
- **Do we launch hetero-only, queer-only, or mixed?** Density math vs. inclusivity tension.
- **Referral mechanic — is the no-incentive model strong enough?** Or do we need something modest (e.g., one month free credit) without crossing into pay-for-growth?
- **When do we publish the financial dashboard?** Day 1 (radical transparency) or once we have one quarter of data?
- **What's the founder-story content cadence?** Weekly newsletter? Monthly essay? Twitter daily?
- **Press strategy — pitch ourselves or wait to be found?** Probably mix; needs prioritization.

---

*This document evolves. Growth strategy should be revisited every quarter — what's working, what's not, what we'd kill.*
