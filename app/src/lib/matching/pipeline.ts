import { db } from '@/lib/db';
import { users, profiles, introductions, lifeBasics, rankedQualities, rankedValues, lifeAnswers, userState, blockedPairs } from '@/lib/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { scoreCompatibility, passesHardFilters, generateExplanation, type ProfileData } from './score';
import { MATCHING_CONFIG } from '@/lib/matching-config';

export async function runMatchingPipeline(): Promise<number> {
  const allUsers = await db.select({ id: users.id }).from(users).where(eq(users.onboardingComplete, true));
  const activeStates = await db.select({ userId: userState.userId }).from(userState).where(eq(userState.status, 'active'));
  const activeIds = new Set(activeStates.map(s => s.userId));
  const eligible = allUsers.filter(u => activeIds.has(u.id)).map(u => u.id);

  // Filter out conversation seed users (keep seed-fake-* for testing)
  const allEmails = await db.select({ id: users.id, email: users.email }).from(users);
  const convoSeedIds = new Set(
    allEmails
      .filter(u => u.email.includes('@freelove.internal') && !u.email.startsWith('seed-fake-'))
      .map(u => u.id)
  );
  const matchableUsers = eligible.filter(id => !convoSeedIds.has(id));

  // Load all profiles
  const profileCache: Map<string, ProfileData> = new Map();
  for (const uid of matchableUsers) {
    const data = await loadProfileData(uid);
    if (data) profileCache.set(uid, data);
  }

  // Batch load existing introductions and blocked pairs (avoid N² DB queries)
  const allIntros = await db.select({ userAId: introductions.userAId, userBId: introductions.userBId }).from(introductions);
  const introSet = new Set(allIntros.map(i => `${i.userAId}:${i.userBId}`).concat(allIntros.map(i => `${i.userBId}:${i.userAId}`)));

  const allBlocked = await db.select({ blockerId: blockedPairs.blockerId, blockedId: blockedPairs.blockedId }).from(blockedPairs);
  const blockedSet = new Set(allBlocked.map(b => `${b.blockerId}:${b.blockedId}`).concat(allBlocked.map(b => `${b.blockedId}:${b.blockerId}`)));

  const results: { userAId: string; userBId: string; score: number; explanation: string }[] = [];
  const allScores: number[] = [];
  let hardFilterPasses = 0;
  let hardFilterFails = 0;
  const userIds = Array.from(profileCache.keys());

  for (let i = 0; i < userIds.length; i++) {
    for (let j = i + 1; j < userIds.length; j++) {
      const a = profileCache.get(userIds[i])!;
      const b = profileCache.get(userIds[j])!;

      // Skip existing introductions (in-memory lookup)
      if (introSet.has(`${a.userId}:${b.userId}`)) continue;

      // Skip blocked (in-memory lookup)
      if (blockedSet.has(`${a.userId}:${b.userId}`)) continue;

      const passes = passesHardFilters(a, b);
      if (!passes) { hardFilterFails++; continue; }
      hardFilterPasses++;

      const score = scoreCompatibility(a, b);
      allScores.push(score);
      if (score >= MATCHING_CONFIG.COMPATIBILITY_FLOOR) {
        results.push({ userAId: a.userId, userBId: b.userId, score, explanation: generateExplanation(a, b, score) });
      }
    }
  }

  // Create introductions (capped per user per day)
  const count: Record<string, number> = {};
  let created = 0;
  for (const r of results.sort((a, b) => b.score - a.score)) {
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

  const avgScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
  const maxScore = allScores.length > 0 ? Math.max(...allScores) : 0;
  const minScore = allScores.length > 0 ? Math.min(...allScores) : 0;
  const aboveFloor = allScores.filter(s => s >= MATCHING_CONFIG.COMPATIBILITY_FLOOR).length;

  console.log(`Matching: ${matchableUsers.length} users, ${userIds.length} with profiles, ${hardFilterPasses} passed hard filters, ${hardFilterFails} failed. Scores: min=${minScore.toFixed(3)}, avg=${avgScore.toFixed(3)}, max=${maxScore.toFixed(3)}, above floor=${aboveFloor}. Created ${created} introductions.`);

  return { created, debug: { users: matchableUsers.length, profiles: userIds.length, hardFilterPasses, hardFilterFails, scores: { min: minScore, avg: avgScore, max: maxScore, aboveFloor }, floor: MATCHING_CONFIG.COMPATIBILITY_FLOOR } } as any;
}

async function loadProfileData(userId: string): Promise<ProfileData | null> {
  const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  if (!profile) return null;
  const q = await db.select().from(rankedQualities).where(eq(rankedQualities.profileId, profile.id));
  const v = await db.select().from(rankedValues).where(eq(rankedValues.profileId, profile.id));
  const a = await db.select().from(lifeAnswers).where(eq(lifeAnswers.profileId, profile.id));
  const b = await db.select().from(lifeBasics).where(eq(lifeBasics.profileId, profile.id));

  const dlQuestions = ['marriage','monogamy','kids_have','kids_want','religion','politics','drinking','smoking','drugs','lifestyle','sexuality'];
  const phQuestions = ['height','my_height','body_type','hair_color','ethnicity','fitness','age_preference','height_preference','body_type_preference','hair_color_preference','ethnicity_preference','fitness_preference'];

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
