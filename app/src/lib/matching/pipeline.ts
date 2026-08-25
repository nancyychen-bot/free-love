import { db } from '@/lib/db';
import { users, profiles, introductions, lifeBasics, rankedQualities, rankedValues, lifeAnswers, userState, blockedPairs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { scoreDeterministic, passesHardFilters, generateExplanation, type ProfileData } from './score';
import { scoreLifeAnswersWithLLM } from './llm-scoring';
import { MATCHING_CONFIG } from '@/lib/matching-config';

/**
 * Three-pass matching funnel:
 *
 * PASS 1: Hard filters (free, deterministic)
 *   Dealbreakers, orientation, physical dealbreakers.
 *   Eliminates ~95% of pairs.
 *
 * PASS 2: Deterministic scoring (free)
 *   Values, qualities, lifestyle, physical.
 *   Only pairs above the deterministic floor survive.
 *
 * PASS 3: LLM analysis (expensive — only runs on survivors)
 *   Scores life answer meaning overlap.
 *   Generates the explanation text.
 *   Can adjust the final score up or down.
 */
export async function runMatchingPipeline() {
  // ── Load all eligible users ──────────────────────────
  const allUsers = await db.select({ id: users.id }).from(users).where(eq(users.onboardingComplete, true));
  const activeStates = await db.select({ userId: userState.userId }).from(userState).where(eq(userState.status, 'active'));
  const activeIds = new Set(activeStates.map(s => s.userId));
  const eligible = allUsers.filter(u => activeIds.has(u.id)).map(u => u.id);

  // Filter out conversation seed users (keep seed-fake-* for testing)
  const allEmails = await db.select({ id: users.id, email: users.email }).from(users);
  const convoSeedIds = new Set(
    allEmails.filter(u => u.email.includes('@freelove.internal') && !u.email.startsWith('seed-fake-')).map(u => u.id)
  );
  const matchableUsers = eligible.filter(id => !convoSeedIds.has(id));

  // Load all profiles into memory
  const profileCache: Map<string, ProfileData> = new Map();
  for (const uid of matchableUsers) {
    const data = await loadProfileData(uid);
    if (data) profileCache.set(uid, data);
  }

  // Batch load existing introductions and blocked pairs
  const allIntros = await db.select({ userAId: introductions.userAId, userBId: introductions.userBId }).from(introductions);
  const introSet = new Set(allIntros.flatMap(i => [`${i.userAId}:${i.userBId}`, `${i.userBId}:${i.userAId}`]));

  const allBlocked = await db.select({ blockerId: blockedPairs.blockerId, blockedId: blockedPairs.blockedId }).from(blockedPairs);
  const blockedSet = new Set(allBlocked.flatMap(b => [`${b.blockerId}:${b.blockedId}`, `${b.blockedId}:${b.blockerId}`]));

  // ── PASS 1: Hard filters ─────────────────────────────
  const userIds = Array.from(profileCache.keys());
  const candidates: { a: ProfileData; b: ProfileData }[] = [];
  let hardFilterFails = 0;

  for (let i = 0; i < userIds.length; i++) {
    for (let j = i + 1; j < userIds.length; j++) {
      const a = profileCache.get(userIds[i])!;
      const b = profileCache.get(userIds[j])!;

      if (introSet.has(`${a.userId}:${b.userId}`)) continue;
      if (blockedSet.has(`${a.userId}:${b.userId}`)) continue;

      if (!passesHardFilters(a, b)) { hardFilterFails++; continue; }
      candidates.push({ a, b });
    }
  }

  // ── PASS 2: Deterministic scoring ─────────────────────
  // Score WITHOUT life answers — values, qualities, lifestyle, physical only
  const deterministicResults: { a: ProfileData; b: ProfileData; deterministicScore: number }[] = [];
  const allDeterministicScores: number[] = [];

  for (const { a, b } of candidates) {
    const score = scoreDeterministic(a, b);
    allDeterministicScores.push(score);
    if (score >= MATCHING_CONFIG.COMPATIBILITY_FLOOR) {
      deterministicResults.push({ a, b, deterministicScore: score });
    }
  }

  // ── PASS 3: LLM analysis (only on survivors) ─────────
  // This is where the expensive work happens — only for pairs that already cleared the bar
  const finalResults: { userAId: string; userBId: string; score: number; explanation: string }[] = [];

  for (const { a, b, deterministicScore } of deterministicResults) {
    // LLM scores life answer overlap (0-1) and generates explanation
    const llmResult = await scoreLifeAnswersWithLLM(a, b);

    // Final score = deterministic components + LLM life answer component
    const finalScore = deterministicScore + (llmResult.score * MATCHING_CONFIG.WEIGHTS.LIFE_ANSWERS);

    const explanation = llmResult.explanation || generateExplanation(a, b, finalScore);
    finalResults.push({ userAId: a.userId, userBId: b.userId, score: finalScore, explanation });
  }

  // ── Create introductions ──────────────────────────────
  const count: Record<string, number> = {};
  let created = 0;

  for (const r of finalResults.sort((a, b) => b.score - a.score)) {
    if ((count[r.userAId] || 0) >= MATCHING_CONFIG.MAX_INTRODUCTIONS_PER_DAY) continue;
    if ((count[r.userBId] || 0) >= MATCHING_CONFIG.MAX_INTRODUCTIONS_PER_DAY) continue;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + MATCHING_CONFIG.INTRODUCTION_TTL_DAYS);

    await db.insert(introductions).values({
      userAId: r.userAId, userBId: r.userBId,
      score: String(r.score), floorA: String(MATCHING_CONFIG.COMPATIBILITY_FLOOR), floorB: String(MATCHING_CONFIG.COMPATIBILITY_FLOOR),
      explanation: r.explanation, source: 'engine', status: 'pending', expiresAt,
    });

    count[r.userAId] = (count[r.userAId] || 0) + 1;
    count[r.userBId] = (count[r.userBId] || 0) + 1;
    created++;
  }

  // ── Debug output ──────────────────────────────────────
  const avgScore = allDeterministicScores.length > 0 ? allDeterministicScores.reduce((a, b) => a + b, 0) / allDeterministicScores.length : 0;
  const maxScore = allDeterministicScores.length > 0 ? Math.max(...allDeterministicScores) : 0;
  const minScore = allDeterministicScores.length > 0 ? Math.min(...allDeterministicScores) : 0;
  const aboveFloor = deterministicResults.length;

  console.log(`Matching: ${matchableUsers.length} users, ${userIds.length} profiles, ${candidates.length} passed hard filters (${hardFilterFails} failed). Deterministic scores: min=${minScore.toFixed(3)}, avg=${avgScore.toFixed(3)}, max=${maxScore.toFixed(3)}. ${aboveFloor} above floor → ${aboveFloor} sent to LLM → ${created} introductions created.`);

  return {
    created,
    debug: {
      users: matchableUsers.length,
      profiles: userIds.length,
      hardFilterPasses: candidates.length,
      hardFilterFails,
      deterministicScores: { min: minScore, avg: avgScore, max: maxScore },
      aboveFloor,
      llmCalls: aboveFloor,
      floor: MATCHING_CONFIG.COMPATIBILITY_FLOOR,
    },
  };
}

async function loadProfileData(userId: string): Promise<ProfileData | null> {
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  if (!profile) return null;

  const q = await db.select().from(rankedQualities).where(eq(rankedQualities.profileId, profile.id));
  const v = await db.select().from(rankedValues).where(eq(rankedValues.profileId, profile.id));
  const a = await db.select().from(lifeAnswers).where(eq(lifeAnswers.profileId, profile.id));
  const b = await db.select().from(lifeBasics).where(eq(lifeBasics.profileId, profile.id));

  const dlQuestions = ['marriage', 'monogamy', 'kids_have', 'kids_want', 'religion', 'politics', 'drinking', 'smoking', 'drugs', 'lifestyle', 'sexuality'];
  const phQuestions = ['height', 'my_height', 'body_type', 'hair_color', 'ethnicity', 'fitness', 'age_preference', 'height_preference', 'body_type_preference', 'hair_color_preference', 'ethnicity_preference', 'fitness_preference'];

  return {
    userId,
    profile: { gender: profile.gender, orientation: profile.orientation, seeking: profile.seeking, radiusMiles: profile.radiusMiles, locationName: profile.locationName },
    qualities: q.map(x => ({ quality: x.quality, rank: x.rank })),
    values: v.map(x => ({ value: x.value, rank: x.rank })),
    lifeAnswers: a.map(x => ({ prompt: x.prompt, answer: x.answer })),
    dealbreakers: b.filter(x => dlQuestions.includes(x.question)).map(x => ({ question: x.question, answer: x.answer, isDealbreaker: x.isDealbreaker })),
    physical: b.filter(x => phQuestions.includes(x.question)).map(x => ({ question: x.question, answer: x.answer, isDealbreaker: x.isDealbreaker })),
  };
}
