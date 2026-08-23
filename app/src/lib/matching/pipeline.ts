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

  // Filter out seed users
  const seedEmails = await db.select({ id: users.id, email: users.email }).from(users);
  const seedIds = new Set(seedEmails.filter(u => u.email.includes('@freelove.internal')).map(u => u.id));
  const realUsers = eligible.filter(id => !seedIds.has(id));

  // Load all profiles
  const profileCache: Map<string, ProfileData> = new Map();
  for (const uid of realUsers) {
    const data = await loadProfileData(uid);
    if (data) profileCache.set(uid, data);
  }

  const results: { userAId: string; userBId: string; score: number; explanation: string }[] = [];
  const userIds = Array.from(profileCache.keys());

  for (let i = 0; i < userIds.length; i++) {
    for (let j = i + 1; j < userIds.length; j++) {
      const a = profileCache.get(userIds[i])!;
      const b = profileCache.get(userIds[j])!;

      // Skip existing introductions
      const existing = await db.select({ id: introductions.id }).from(introductions)
        .where(or(
          and(eq(introductions.userAId, a.userId), eq(introductions.userBId, b.userId)),
          and(eq(introductions.userAId, b.userId), eq(introductions.userBId, a.userId))
        )).limit(1);
      if (existing.length > 0) continue;

      // Skip blocked
      const blocked = await db.select({ blockerId: blockedPairs.blockerId }).from(blockedPairs)
        .where(or(
          and(eq(blockedPairs.blockerId, a.userId), eq(blockedPairs.blockedId, b.userId)),
          and(eq(blockedPairs.blockerId, b.userId), eq(blockedPairs.blockedId, a.userId))
        )).limit(1);
      if (blocked.length > 0) continue;

      if (!passesHardFilters(a, b)) continue;

      const score = scoreCompatibility(a, b);
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

  return created;
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
