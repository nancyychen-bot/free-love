# Free Love — Implementation Roadmap

**Date:** August 2026
**Owners:** Justin & Nancy
**Source docs:** MANIFESTO-v3, DESIGN-v3, GROWTH-v2, PRD-v2, DESIGN-BRIEF, design handoff

This document captures the full implementation plan from prototype to production — every subsystem the product needs, organized into build phases. Each phase is designed to be a complete, testable increment.

The first phase (MVP) has its own detailed spec at `docs/MVP-SPEC.md`.

---

## Architecture overview

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js App Router, TypeScript | Mobile-first responsive web. No native app in v1. |
| Backend | Next.js API routes / Server Actions | Co-located with frontend for simplicity. |
| Database | PostgreSQL (Neon, hosted) | Deployed on Vercel's Neon integration. |
| Auth | Email + password (simple) → passwordless later | No third-party OAuth in MVP. |
| LLM | Haiku-class model via API | Qualitative matching + explanations + moderation flagging. |
| Hosting | Vercel | Free tier initially. Kept portable. |
| Payments | Stripe | Subscriptions, drought-pause billing logic. |
| Verification | TBD (Veriff / Stripe Identity / Didit) | Behind an adapter interface — vendor-swappable. |
| License | AGPL | All code public from day one. |

---

## Phase 1: MVP — Working Prototype (8-12 weeks)

**Goal:** A multi-user app where real people sign up, build profiles, receive introductions, and have conversations. Deployed and shareable via URL.

**Detailed spec:** `docs/MVP-SPEC.md`

### What's included
- Email/password signup
- Nine onboarding steps (all writing to DB)
- Simplified matching engine (hard filters + rules-based scoring, no LLM)
- Per-user compatibility floor
- Introduction surfacing (up to 3/day, zero valid)
- Introduction screen with templated "why this match?"
- Pass / open / save actions
- Admin view for manual pairing
- Three-conversation cap with holding space
- Poll-based messaging (3-5s refresh)
- Closure flow (removal question, goodbye notes)
- Thread-level enforcement (nudge + auto-close)
- Drought screen with real pool data and working levers
- Pause mode + 30-day auto-pause with exit prompt
- Exit flow ("did you find someone?")
- Photo upload (face + body + optional)
- Email notifications (new introduction, new message, closure)
- How This Works + Manifesto pages
- Basic instrumentation
- Deployed to Vercel + Neon

### What's deferred
- Identity verification
- LLM qualitative matching
- LLM match explanations (templated instead)
- Billing / subscriptions
- Tiered abuse reporting
- Moderation tooling
- Published finances dashboard
- Cohort density gates / waitlist

---

## Phase 2: Safety & Verification (4-6 weeks)

**Goal:** Every user is verified as real. Abuse reporting and moderation are operational.

**Depends on:** Phase 1 (users exist with profiles)

### Subsystems

#### 2a. Identity verification
- Third-party verification at signup (behind `IdentityVerifier` adapter)
- Quote and select provider (Veriff Essential, Stripe Identity, or Didit)
- Verify-then-minimize: store result + provider reference + derived DOB, discard document images and biometrics
- Failure path: two automatic retries, then manual review queue
- Returning users: decide and implement re-verification policy
- Gate: no unverified user enters the matching pool

#### 2b. Tiered abuse reporting
- Report flow reachable from every conversation surface + removal flow
- Three tiers per DESIGN-v3 §8:
  - Misrepresentation & boundary issues → logged, three strikes → removal
  - Deception & manipulation → human moderator review within 24h
  - Harassment & harm → immediate suspension, default permanent removal
- Cross-tier pattern tracking (multiple low-severity reports escalate)
- Reporter identity never disclosed to reported user
- Appeals flow (default protects reporter)

#### 2c. Moderation tooling
- Admin dashboard for reviewing reports
- LLM-assisted flagging (model flags, human decides — model never issues consequences)
- Resolution time tracking (targets: harassment <4h, deception <24h)
- Blocking: immediate, silent, permanent, bidirectional exclusion from matching

#### 2d. The pledge (upgrade)
- Pledge version tracking — re-prompt on material revision
- Signature timestamp stored

---

## Phase 3: Matching Intelligence (4-6 weeks)

**Goal:** The matching engine uses LLM qualitative scoring and generates real explanations. Distribution is instrumented and managed.

**Depends on:** Phase 1 (matching engine exists), Phase 2 (verified users)

### Subsystems

#### 3a. LLM qualitative scoring
- Small (Haiku-class) model reads both users' life-question answers
- Outputs meaning-overlap score + short rationale
- Per-pair inputs only — never aggregate data, never the corpus
- Combined with rules-based score via published formula
- Photos never enter any model

#### 3b. Match explanations
- Same LLM generates plain-language "why this match?" for both people
- Draws on real compatibility without exposing private rankings
- Must read as "the machine showing its work" — never as advertising copy
- Replace templated explanations from MVP

#### 3c. Personality inference
- Short question set inferring Big Five position (added to onboarding)
- Stored as five continuous dimensions + confidence value
- Matched against what people describe wanting
- Never displayed as a personality type

#### 3d. Distribution instrumentation & safeguards
- Log introductions-per-user as distribution (p10/p50/p90), not average
- Alert when bottom decile receives <20% of median
- Floor-relaxation policy: after N days with zero matches, system offers (never silently applies) relaxation of soft factors only
- Publish "% of active users who received ≥1 introduction in last 30 days"

#### 3e. Floor calibration
- Tooling for tuning the compatibility floor
- Score distribution analysis across surfaced vs. non-surfaced candidates
- Requires fixture data and human judgment on synthetic pairs

---

## Phase 4: Billing & Subscriptions (3-4 weeks)

**Goal:** Users pay after a 7-day trial. Billing pauses automatically during droughts.

**Depends on:** Phase 1 (users exist), Phase 3 (matching quality is real enough to charge for)

### Subsystems

#### 4a. Subscription lifecycle
- Stripe integration for flat-rate subscription
- 7-day free trial
- Same price for everyone — no tiers, no boosts, no premium
- Price TBD (do not lock until unit economics are modeled with real data)

#### 4b. Billing state machine
- Full enum: `waitlisted` / `trialing` / `active` / `paused_drought` / `paused_user` / `paused_inactive` / `cancelled`
- Only `active` bills
- All pause states fully reversible, no data loss

#### 4c. Drought pause
- Billing pauses automatically after 21 consecutive days with zero introductions
- Resumes the day an introduction is surfaced
- System-initiated, no user action, no ticket, pro-rated, no clawback
- User notified when it happens and why

#### 4d. Published finances
- Quarterly financial dashboard (public)
- Where every dollar goes
- Surplus tracking and donation allocation

#### 4e. Honest pool disclosure
- Show pool size in user's filters at signup before payment
- Charging while implying density we don't have is the failure mode to avoid

---

## Phase 5: Cohort Management & Waitlist (2-3 weeks)

**Goal:** Mixed launch (all orientations) with density gates that prevent admitting users into empty pools.

**Depends on:** Phase 1 (users), Phase 4 (billing — waitlisted users must never be charged)

### Subsystems

#### 5a. Cohort model
- Each user assigned `cohort_key` from identity + seeking selections
- Each cohort has `min_viable_pool` (configurable, default 25 — placeholder)
- Cohort opens when it clears threshold on both sides of the seeking relationship

#### 5b. Waitlist
- Signups from below-threshold cohorts enter waitlist, not the product
- Honest messaging: "We're not open to your cohort yet — there are N people here who'd be looking for you, and we need more before we can introduce you to anyone."
- Waitlisted users never charged, never enter trial
- Email notification when cohort opens

#### 5c. Changing identity/seeking
- Re-evaluates cohort gate
- Handles edge cases (mid-conversation cohort change, etc.)

---

## Phase 6: Governance & Transparency (2-3 weeks)

**Goal:** The product's transparency promises are real — matching code is readable, changes go through RFC, the data inventory is live.

**Depends on:** Phases 1-5 (the systems being made transparent must exist first)

### Subsystems

#### 6a. Data transparency page
- Plain-language inventory of exactly what's stored and why
- Linked to user's match profile
- Full portable data export on request
- Deletion policy: removes personal data, retains anonymized aggregates + safety records

#### 6b. Public RFC process
- Process for proposing changes to matching algorithm
- Community visibility into what changed and why

#### 6c. Advisory board
- Named on the site: relationship researcher, T&S expert, women's safety advocate
- Review and sign off on matching logic and moderation policy before public launch

---

## Phase 7: Growth & Launch Preparation (ongoing)

**Goal:** Ready for Phase 1 launch per GROWTH-v2 — ~100 friends-of-friends in NYC.

**Depends on:** Phases 1-6 (the product must be safe and honest before real users)

### Subsystems

#### 7a. Pre-registered viability threshold
- Fill in the blanks from GROWTH-v2 §3 before Phase 1 opens
- Trial → paid conversion target, measurement window, segmentation, action-if-missed

#### 7b. Seeding
- Women-first recruiting per GROWTH-v2 §6
- Personal invitations from Justin and Nancy's networks
- Invite-only access control

#### 7c. Instrumentation dashboard
- North star: successful exits per month
- Introduction coverage and distribution
- Funnel metrics (introduction → open → conversation → meeting → exit)
- Trial → paid conversion (segmented by intros received)
- Drought pause as % of active-user-months

#### 7d. Content
- Founder essays, manifesto published as standalone essay
- Market research published (lightly edited)
- Reddit presence in ICP communities (per GROWTH-v2 §4)

---

## Open decisions (blocking specific phases)

| Decision | Blocks | Current status |
|---|---|---|
| Compatibility question set (actual copy) | Phase 1 onboarding | Placeholder qualities/values in prototype |
| Life signals taxonomy | Phase 1 onboarding | Undefined |
| Verification provider | Phase 2 | Quote Veriff, Stripe Identity, Didit, Persona |
| Subscription price | Phase 4 | TBD — do not lock until economics modeled |
| `min_viable_pool` per cohort | Phase 5 | 25 is placeholder |
| Floor-relaxation timing | Phase 3 | 14 days is placeholder |
| Match explanation prompt | Phase 3 | Templated in MVP |
| First city | Phase 7 | NYC leading |
| Donation recipients for surplus | Phase 4 | Undefined |
| Re-verification policy for returning users | Phase 2 | Undecided |
| Name — is it "Free Love"? | Phase 7 | Not locked |

---

## Corrections to propagate (from PRD-v2 §22)

These were identified in the PRD and should be fixed when touching the relevant doc:

| Doc | Issue |
|---|---|
| DESIGN-v3 §11, GROWTH-v2 §8 | Didit listed at ~$0.03; actual is $0.30 |
| DESIGN-v3 §8 | Verification shortlist includes Jumio (enterprise-only, out of scope) |
| DESIGN-v3 §3 | Says "top 5 each" for qualities + values; should be 4 qualities / 5 values |
| DESIGN-v3 §11 | `billing_state` enum missing auto-pause and waitlist states |
| GROWTH-v2 §10 | "Hetero-only, queer-only, or mixed?" still listed as open — decision is made (mixed, day one) |
| GROWTH-v2 §2, §5 | Hook lines hardcode "$5/month" while §8 says don't lock the price |

---

*This roadmap evolves. Revisit after each phase ships.*
