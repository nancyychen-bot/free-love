import { db } from './db';
import { users, profiles, lifeBasics, rankedQualities, rankedValues, lifeAnswers, lifeSignals, userState } from './db/schema';
import { hashPassword } from './auth/password';
import { eq } from 'drizzle-orm';

const SEED_EMAIL = 'seed-mara@freelove.internal';

const SEED_PROFILE = {
  displayName: 'Mara',
  age: 34,
  gender: 'woman',
  orientation: 'straight',
  seeking: ['men'],
  locationName: 'Williamsburg',
  photos: [
    { theme: 'me in my element', url: 'https://images.unsplash.com/photo-1518611540400-6b85a0704342?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5NDY1fDB8MXxyYW5kb218fHx8fHx8fHwxNzg3NDEzMzAyfA&ixlib=rb-4.1.0&q=80&w=1080' },
    { theme: 'my living space', url: 'https://images.unsplash.com/photo-1653928069878-32e246258e8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5NDY1fDB8MXxyYW5kb218fHx8fHx8fHwxNzg3NDEzMzEyfA&ixlib=rb-4.1.0&q=80&w=1080' },
    { theme: 'something I love doing', url: 'https://images.unsplash.com/photo-1597689530931-a8edd8a31808?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5NDY1fDB8MXxyYW5kb218fHx8fHx8fHwxNzg3NDEzMzAyfA&ixlib=rb-4.1.0&q=80&w=1080' },
    { theme: 'my bookshelf', url: 'https://images.unsplash.com/photo-1653928069868-1cbadeb4c1ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5NDY1fDB8MXxyYW5kb218fHx8fHx8fHwxNzg3NDEzMzEyfA&ixlib=rb-4.1.0&q=80&w=1080' },
    { theme: 'my favorite place', url: 'https://images.unsplash.com/photo-1612693624009-6855ad808f61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMDM5NDY1fDB8MXxyYW5kb218fHx8fHx8fHwxNzg3NDEzMzAyfA&ixlib=rb-4.1.0&q=80&w=1080' },
  ],
  qualities: ['warmth', 'humor', 'depth', 'curiosity'],
  values: ['growth', 'honesty', 'freedom', 'creativity', 'family'],
  lifeAnswers: [
    { prompt: 'what a really good day looks like for me', answer: 'Coffee on the fire escape before the city wakes up. A long walk with no destination. Cooking something new with whatever is in the fridge. A book I cannot put down. Falling asleep mid-sentence because the day was full enough.', displayOrder: 1 },
    { prompt: 'something that changed how I see things', answer: 'My father repaired clocks his whole life and never once got bored of it. I used to think that was small. Now I think it is the most radical thing a person can do — to find the thing and stay with it.', displayOrder: 2 },
    { prompt: 'what I care about most right now', answer: 'Building a life that is genuinely mine, not a reaction to what I thought I was supposed to want. Learning to cook well. Reading more fiction. Being the kind of friend who actually shows up.', displayOrder: 3 },
  ],
  dealbreakers: [
    { question: 'marriage', answer: 'i want to get married', isDealbreaker: false },
    { question: 'monogamy', answer: 'monogamous', isDealbreaker: true },
    { question: 'kids_have', answer: 'no', isDealbreaker: false },
    { question: 'kids_want', answer: 'yes', isDealbreaker: false },
    { question: 'religion', answer: 'spiritual but not religious', isDealbreaker: false },
    { question: 'politics', answer: 'progressive', isDealbreaker: false },
    { question: 'drinking', answer: 'i drink socially', isDealbreaker: false },
    { question: 'smoking', answer: "i don't smoke", isDealbreaker: true },
    { question: 'drugs', answer: 'cannabis', isDealbreaker: false },
    { question: 'lifestyle', answer: 'somewhere in between', isDealbreaker: false },
  ],
};

export async function ensureSeedProfile(): Promise<string> {
  // Check if seed user exists
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, SEED_EMAIL))
    .limit(1);

  if (existing.length > 0) return existing[0].id;

  // Create seed user
  const passwordHash = await hashPassword('seed-internal-only');
  const [user] = await db.insert(users).values({
    email: SEED_EMAIL,
    passwordHash,
    isAdmin: false,
    onboardingComplete: true,
    onboardingStep: 10,
  }).returning({ id: users.id });

  await db.insert(userState).values({
    userId: user.id,
    status: 'active',
    lastActiveAt: new Date(),
  });

  // Create profile
  const [profile] = await db.insert(profiles).values({
    userId: user.id,
    displayName: SEED_PROFILE.displayName,
    age: SEED_PROFILE.age,
    gender: SEED_PROFILE.gender,
    orientation: SEED_PROFILE.orientation,
    seeking: SEED_PROFILE.seeking,
    locationName: SEED_PROFILE.locationName,
  }).returning({ id: profiles.id });

  // Qualities
  await db.insert(rankedQualities).values(
    SEED_PROFILE.qualities.map((q, i) => ({
      profileId: profile.id,
      quality: q,
      rank: i + 1,
    }))
  );

  // Values
  await db.insert(rankedValues).values(
    SEED_PROFILE.values.map((v, i) => ({
      profileId: profile.id,
      value: v,
      rank: i + 1,
    }))
  );

  // Life answers
  await db.insert(lifeAnswers).values(
    SEED_PROFILE.lifeAnswers.map(a => ({
      profileId: profile.id,
      ...a,
    }))
  );

  // Dealbreakers
  await db.insert(lifeBasics).values(
    SEED_PROFILE.dealbreakers.map(d => ({
      profileId: profile.id,
      ...d,
    }))
  );

  // Photos
  await db.insert(lifeSignals).values(
    SEED_PROFILE.photos.map(p => ({
      profileId: profile.id,
      type: p.theme,
      photoUrl: p.url,
      caption: p.theme,
    }))
  );

  return user.id;
}
