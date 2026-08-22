import { db } from './db';
import { users, profiles, introductions, conversations, messages, lifeSignals, userState } from './db/schema';
import { hashPassword } from './auth/password';
import { eq, or, and } from 'drizzle-orm';
import { ensureSeedProfile } from './seed-profiles';

const CONVO_SEEDS = [
  {
    email: 'seed-alex@freelove.internal',
    displayName: 'Alex',
    age: 31,
    gender: 'man',
    orientation: 'straight',
    seeking: ['women'],
    locationName: 'Park Slope',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    messages: [
      { from: 'them', text: 'Your answer about what a good day looks like made me laugh. Mine involves a lot more chaos.' },
      { from: 'you', text: 'Chaos how? Like spontaneous plans or actual disorder?' },
      { from: 'them', text: 'Saturday works. There\'s a place on Franklin that does the thing you described almost exactly.' },
    ],
  },
  {
    email: 'seed-daniel@freelove.internal',
    displayName: 'Daniel',
    age: 36,
    gender: 'man',
    orientation: 'straight',
    seeking: ['women'],
    locationName: 'Williamsburg',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    messages: [
      { from: 'them', text: 'I also put growth as my top value. What does that look like for you right now?' },
      { from: 'you', text: 'Honestly, learning to sit with not knowing. You?' },
      { from: 'them', text: 'Trying to read more and scroll less. It\'s harder than it sounds.' },
      { from: 'you', text: 'It really is. What are you reading?' },
    ],
  },
  {
    email: 'seed-sam@freelove.internal',
    displayName: 'Sam',
    age: 29,
    gender: 'man',
    orientation: 'bisexual',
    seeking: ['women', 'men'],
    locationName: 'East Village',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    messages: [
      { from: 'them', text: 'Both of us said clocks, apparently. I want to hear about your father.' },
    ],
  },
];

export async function seedUserData(userId: string, userEmail: string) {
  // 1. Seed Mara + create introduction
  const maraId = await ensureSeedProfile();

  const existingIntro = await db
    .select({ id: introductions.id })
    .from(introductions)
    .where(
      or(
        and(eq(introductions.userAId, userId), eq(introductions.userBId, maraId)),
        and(eq(introductions.userAId, maraId), eq(introductions.userBId, userId))
      )
    )
    .limit(1);

  if (existingIntro.length === 0) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 5);
    await db.insert(introductions).values({
      userAId: userId,
      userBId: maraId,
      score: '0.81',
      floorA: '0.74',
      floorB: '0.74',
      explanation: 'You both ranked warmth and humor highest. Neither of you flagged a dealbreaker the other holds. Her answer about what a good day looks like and yours both describe small, quiet moments over grand gestures.',
      source: 'engine',
      status: 'pending',
      expiresAt,
    });
  }

  // 2. Create conversation seed users + conversations + messages
  for (const seed of CONVO_SEEDS) {
    let [seedUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, seed.email))
      .limit(1);

    if (!seedUser) {
      const hash = await hashPassword('seed-internal-only');
      [seedUser] = await db.insert(users).values({
        email: seed.email,
        passwordHash: hash,
        isAdmin: false,
        onboardingComplete: true,
        onboardingStep: 10,
      }).returning({ id: users.id });

      await db.insert(userState).values({
        userId: seedUser.id,
        status: 'active',
        lastActiveAt: new Date(),
      });

      const [profile] = await db.insert(profiles).values({
        userId: seedUser.id,
        displayName: seed.displayName,
        age: seed.age,
        gender: seed.gender,
        orientation: seed.orientation,
        seeking: seed.seeking,
        locationName: seed.locationName,
      }).returning({ id: profiles.id });

      await db.insert(lifeSignals).values({
        profileId: profile.id,
        type: 'just me',
        photoUrl: seed.photo,
        caption: 'just me',
      });
    }

    const existingConvo = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(
        or(
          and(eq(conversations.userAId, userId), eq(conversations.userBId, seedUser.id)),
          and(eq(conversations.userAId, seedUser.id), eq(conversations.userBId, userId))
        )
      )
      .limit(1);

    if (existingConvo.length === 0) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 5);
      const [intro] = await db.insert(introductions).values({
        userAId: userId,
        userBId: seedUser.id,
        score: '0.78',
        floorA: '0.74',
        floorB: '0.74',
        explanation: 'Seed match for testing.',
        source: 'admin',
        status: 'opened',
        expiresAt,
      }).returning({ id: introductions.id });

      const [convo] = await db.insert(conversations).values({
        introductionId: intro.id,
        userAId: userId,
        userBId: seedUser.id,
        status: 'active',
      }).returning({ id: conversations.id });

      const now = Date.now();
      for (let i = 0; i < seed.messages.length; i++) {
        const msg = seed.messages[i];
        await db.insert(messages).values({
          conversationId: convo.id,
          senderId: msg.from === 'you' ? userId : seedUser.id,
          body: msg.text,
          createdAt: new Date(now - (seed.messages.length - i) * 3600000),
        });
      }
    }
  }
}
