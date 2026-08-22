import { db } from './db';
import { users, profiles, introductions, conversations, messages, lifeSignals, lifeAnswers, rankedQualities, rankedValues, userState } from './db/schema';
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
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    photos: [
      { type: 'just me', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
      { type: 'my neighborhood', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
      { type: 'how I move', url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
    ],
    answers: [
      { prompt: 'about me', answer: 'Product designer who moved to Brooklyn for the food and stayed for the people. I run in Prospect Park most mornings and cook elaborate meals nobody asked for. I think the best conversations happen while walking somewhere.', displayOrder: 0 },
      { prompt: 'what a really good day looks like for me', answer: 'Farmers market, then cooking something ambitious with whatever I found. An afternoon where I lose track of time reading or drawing. Dinner with two or three people I actually like. Asleep by eleven.', displayOrder: 1 },
      { prompt: 'what people get wrong about me', answer: "People assume I'm quiet because I'm reserved. I'm actually just listening. When I have something to say, I say it.", displayOrder: 2 },
    ],
    qualities: ['warmth', 'humor', 'depth', 'candor'],
    values: ['growth', 'creativity', 'honesty', 'family', 'freedom'],
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
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    photos: [
      { type: 'just me', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
      { type: 'my bookshelf', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
      { type: 'something I love doing', url: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
      { type: 'my living space', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
    ],
    answers: [
      { prompt: 'about me', answer: 'Writer, reader, reluctant jogger. I teach creative writing at a community college and genuinely love it. I own too many books and not enough shelves. Looking for someone who wants to build something real.', displayOrder: 0 },
      { prompt: 'something that changed how I see things', answer: "Spending a year in a city where I didn't speak the language. It taught me that most of what I thought was personality was just comfort.", displayOrder: 1 },
      { prompt: 'what I care about most right now', answer: 'Being present instead of productive. I spent my twenties optimizing everything. Now I\'m trying to just be in the room.', displayOrder: 2 },
    ],
    qualities: ['depth', 'candor', 'curiosity', 'warmth'],
    values: ['intellectual life', 'honesty', 'growth', 'freedom', 'creativity'],
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
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    photos: [
      { type: 'just me', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
      { type: 'me in my element', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
      { type: 'my favorite place', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800' },
    ],
    answers: [
      { prompt: 'about me', answer: "Musician and sound engineer. I split my time between a recording studio in Bushwick and every coffee shop in the East Village. I'm told I ask too many questions, which I take as a compliment.", displayOrder: 0 },
      { prompt: "what I'm still figuring out", answer: 'How to want something without gripping it too tightly. Also, how to keep plants alive.', displayOrder: 1 },
      { prompt: 'my most treasured memory', answer: "My grandmother teaching me piano when I was seven. Not the playing — the sitting next to her. She smelled like lavender and didn't care if I got the notes wrong.", displayOrder: 2 },
    ],
    qualities: ['curiosity', 'humor', 'self-awareness', 'warmth'],
    values: ['freedom', 'creativity', 'adventure', 'growth', 'honesty'],
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

      // Photos
      await db.insert(lifeSignals).values(
        seed.photos.map(p => ({
          profileId: profile.id,
          type: p.type,
          photoUrl: p.url,
          caption: p.type,
        }))
      );

      // Life answers (bio + questions)
      await db.insert(lifeAnswers).values(
        seed.answers.map(a => ({
          profileId: profile.id,
          prompt: a.prompt,
          answer: a.answer,
          displayOrder: a.displayOrder,
        }))
      );

      // Ranked qualities
      await db.insert(rankedQualities).values(
        seed.qualities.map((q, i) => ({
          profileId: profile.id,
          quality: q,
          rank: i + 1,
        }))
      );

      // Ranked values
      await db.insert(rankedValues).values(
        seed.values.map((v, i) => ({
          profileId: profile.id,
          value: v,
          rank: i + 1,
        }))
      );
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
