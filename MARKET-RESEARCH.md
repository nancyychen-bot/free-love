# Free Love — Market Research & White Space

*Deep, fact-checked research pass. 22 sources fetched, 104 claims extracted, top 25 adversarially verified (3-vote, need 2/3 to kill) → 25 confirmed, 0 refuted → synthesized to 10 findings. Most findings rest on primary sources: Pew Research 2023, the FTC complaint, Match Group's SEC 10-K, a peer-reviewed scoping review.*

*Date of research: June 2026. See caveats at the end — some data (Pew) is from mid-2022; prices change frequently.*

---

## The headline

**The white space is structural, not feature-level.** You cannot out-feature Match Group. But you can occupy a position they *structurally cannot* — because their business model forbids it. Everything below is in service of that one insight.

---

## 1. The incumbent conflict of interest is real, documented, and now legally contested

This is no longer just our Manifesto's argument — it's in regulatory and court records.

- **~98% of Match Group's revenue comes directly from users** (subscriptions + à la carte purchases). Their FY2024 10-K: $3.42B of $3.48B total = 98.2% direct; only ~1.7% is advertising. Their business depends on *retaining* paying users, not producing successful exits. *(Confidence: high. Sources: Match SEC 10-K; CBS; Groundwork Collaborative.)*

- **A Feb 14, 2024 federal class action** (N.D. California, six plaintiffs) alleges Tinder and Hinge are deliberately gamified with dopamine-manipulating mechanics to addict users into a "perpetual pay-to-play loop" — directly contradicting Hinge's "designed to be deleted" marketing. The complaint's core line: *"Platform users are in search of off-app relationships, while Match is in the business of retaining subscribers."* (Allegations, not adjudicated; plaintiffs were ordered to arbitrate — but the framing stands.) *(Confidence: high.)*

- **The FTC formally sanctioned Match.** The 2019 complaint alleged 25–30% of daily new members were scammers (2013–2018), and that Match used *fraud-flagged accounts to lure non-subscribers into paying* — ~500,000 subscriptions bought within 24h of an ad tied to a fraudulent message. **Match settled for $14M in August 2025**, also covering deceptive ads, hard-to-cancel subscriptions, and account lockouts during billing disputes. *(Confidence: high. Sources: FTC complaint; Senate JEC letter; Fortune.)*

- **Prices have exploded.** Tinder Plus +150% ($9.99→$24.99), Bumble basic +200% since 2016 ($9.99→$29.99); subscribing to all three top apps can exceed **$2,100/year**. Mechanics like Hinge's "Rose Jail" gate the highest-interest profiles behind paid Roses. *(Confidence: high.)*

**Implication for Free Love:** our central claim is independently verified. The non-profit, exit-optimized model isn't just ethical posturing — it's the one competitive position the incumbents are legally and financially unable to copy. Lead with it.

---

## 2. User dissatisfaction is high, quantified, and unresolved

From Pew Research (Feb 2023, nationally representative survey of 6,034 US adults):

- **46% of US online daters report negative experiences.** Women are more negative than men, and women's negative share is **up 7 points since 2019** — it's getting worse, not better. *(Confidence: high.)*
- **35% have paid** — skewed to higher income (45% upper vs 28% lower), confirming pay-to-win is a class barrier to access. *(Confidence: high.)*

**Implication:** the dissatisfaction is large, durable, and disproportionately hits the people incumbents serve worst. There is genuine demand for an alternative.

---

## 3. Trust & safety is the single largest concrete unmet need

This is the clearest, most quantified opening — and it maps directly to Manifesto principle #3.

- **~52% of users encountered a suspected scammer** (63% among men under 50).
- Companies are rated **2:1 negatively on removing fake accounts** (40% "bad job" vs 20% "good job").
- **48% of all users experienced at least one unwanted behavior.** For **women under 50**: 56% unsolicited explicit images, 43% unwanted continued contact, **11% threats of physical harm**.
- **LGB users** face more of every category (56% vs 34% straight on unwanted sexual content).
- A peer-reviewed scoping review (125 qualitative studies, 2025) characterizes heterosexual women's experience as a *"hostile online environment where harassment, deception, and risks of violence are constant concerns."*

*(All confidence: high. Sources: Pew 2023; Behavioral Sciences scoping review.)*

**Implication for Free Love:** **make safety a first-class product, not a settings page.** This is where user pain is highest, incumbents perform worst, and a trust-first non-profit has the most credibility. Strong candidate for our defining differentiator. Note the cost flip-side (see §6).

---

## 4. Underserved segments (directional)

- **Older daters:** 38% of Tinder's base is 35+, and 50+ usage is rising fast, yet the segment is understudied and the experience is built for the young. Dedicated incumbents exist (SilverSingles, OurTime), so this is an *experience-quality* gap, not an absence.
- **Queer women / women-seeking-women:** dramatically under-researched (4 studies vs 31 on men-seeking-men) and described as "overlooked."

*(Confidence: medium — these extrapolate from academic research volume to market opportunity. Treat as directional, not market sizing. Both verified 2-1.)*

**Implication:** a dense beachhead community (per DESIGN.md §6) could plausibly be a values-aligned, safety-sensitive segment — queer women and/or an intentions-first community are credible candidates. Decide deliberately.

---

## 5. The non-profit / anti-exploitative model is *proven buildable* (two live precedents)

We are not the first, and that's good news — the model works in production:

- **Alovoa** — fully open-source (**AGPLv3**), donation-funded (BuyMeACoffee, Ko-fi, Liberapay, Open Collective, Bitcoin), with an *explicit* no-ads / no-data-selling / **no-paid-features** stance (no pay-to-superlike, pay-to-swipe, pay-to-view, pay-to-chat). Live on F-Droid and Google Play. **This is essentially Free Love's funding/licensing model, already validated as feasible.** *(Confidence: high.)*

- **Revel** — non-profit, research-driven app from two University of Michigan professors ("for science, not profit"), built explicitly to counter swipe-fatigue and choice overload. **Shows only ~5 profiles/day**, grounded in choice-overload research. This validates our "finite, considered introductions" mechanic (DESIGN.md §2–3). *(Confidence: high.)*

**Implication:** two of our core design bets — donation funding + AGPL (Alovoa) and anti-engagement finite introductions (Revel) — already exist and work. We should study both closely, and our differentiation must go *beyond* them (see §7).

---

## 6. The honest risks — what neither precedent has proven

The research is candid about the unsolved problems. **These are the things most likely to kill Free Love**, and no source could show they've been solved at scale:

1. **Cold-start / liquidity.** Alovoa and Revel prove the model is *buildable*, but there's no evidence either reached critical mass or strong match outcomes. A dating product is worthless without local density. *This is the central unproven risk.*
2. **Moderation cost at scale.** Safety is our biggest *opportunity* (§3) and simultaneously the **most expensive thing to do well**. No source quantified a sustainable moderation cost floor for a donation-funded non-profit. The opportunity and the cost are the same coin.
3. **Long-term funding floor.** Donations prove feasibility (Alovoa), not sustainability at large scale with real moderation overhead.

**Implication:** our roadmap must treat cold-start and moderation cost as first-order design constraints, not afterthoughts. A dense single-community launch (DESIGN.md §6) is the right answer to cold-start. Safety scope must be matched to what donations can sustainably fund.

---

## 7. White-space synthesis — what Free Love can credibly own

Combining all findings, the defensible position is the intersection of three things incumbents can't or won't do:

1. **Exit-optimized + non-profit** — the structural position they're legally/financially barred from (§1). *Our foundation.*
2. **Safety-first as the product, not a feature** — the largest unmet need, where incumbents score 2:1 negative (§3). *Our wedge.*
3. **Anti-engagement, finite, transparent matching** — validated by Revel, demanded by burnout data (§2, §5). *Our experience.*

Plus two model choices already de-risked by precedent: **AGPL + donation funding** (Alovoa) and **finite daily introductions** (Revel).

The move beyond the precedents: **combine Alovoa's ethical model + Revel's anti-engagement design + a genuinely safety-first experience for a specific dense community** — none of the three existing efforts does all of this at once.

---

## Prioritized recommendations for Free Love

1. **Lead the entire brand on the structural argument.** "We're a non-profit, so we win when you leave." It's now backed by the FTC settlement and Match's own filings — cite them. This is marketing *and* truth.
2. **Make trust & safety the defining feature**, scoped to what donations can sustain. Verification, harassment handling, and fake-account removal should be visibly better than incumbents from day one. This is the biggest, best-evidenced opening.
3. **Adopt the validated model:** AGPL + transparent donation funding (follow Alovoa), and finite daily introductions (follow Revel). Don't reinvent what's already proven.
4. **Solve cold-start by going dense, not broad.** Launch in one tight, values-aligned community. Candidates: queer women / WSW (under-served, safety-sensitive) or an intentions-first local community. Pick deliberately.
5. **Budget moderation as a core cost from day one** — it's the make-or-break expense, not a line item to defer.
6. **Differentiate beyond the precedents** by combining ethical model + anti-engagement + safety-first for that one community — the unoccupied intersection.

---

## Open questions (worth a second research round)

The first pass surfaced four gaps it couldn't close:

1. **How do non-profit/open-source dating apps actually beat cold-start at scale?** No user-count/retention data on Alovoa or Revel was found.
2. **What's the realistic sustainable funding floor for moderation at scale** under a donation model?
3. **What's the real magnitude/trajectory of Gen Z leaving apps and Match Group's decline?** The brief asked; no verified figure was found this round.
4. **Post-mortems of *failed* ethical/slow/community-run apps** — which died, and of what (cold-start, funding, or moderation)? We have success cases but no failure autopsies to learn from.

---

## Sources (highest quality first)

**Primary:**
- Pew Research Center, *The Experiences of U.S. Online Daters* (Feb 2, 2023) — pewresearch.org
- FTC v. Match Group, complaint (2019) — ftc.gov; Senate JEC (Hassan/Blackburn) letter — jec.senate.gov
- Match Group FY2024 10-K — sec.gov
- *Behavioral Sciences* scoping review of 125 qualitative studies (Feb 2025) — pmc.ncbi.nlm.nih.gov
- Alovoa source & model — github.com/Alovoa/alovoa
- U-M LSA Magazine, *A Dating App for Science, Not for Profit* (Revel, Spring 2025) — lsa.umich.edu

**Secondary / advocacy / press:**
- Groundwork Collaborative, *Swipe Right to Pay* (Feb 2026)
- CBS News, Fortune (FTC settlement, Aug 2025; gamification lawsuit)
- Newsweek (Gen Z dating-app decline)

*Caveat on source mix: the user-need and demographic findings are top-tier primary. The "profit vs. successful matches" framing leans partly on a litigation complaint and advocacy reporting — the underlying facts (98% figure, FTC settlement, prices) are primary-verified, but the causal narrative is an allegation Match disputes, not an adjudicated finding.*
