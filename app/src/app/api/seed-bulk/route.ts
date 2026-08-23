import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  users,
  profiles,
  lifeBasics,
  rankedQualities,
  rankedValues,
  lifeAnswers,
  lifeSignals,
  userState,
} from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth/password';
import { like, sql } from 'drizzle-orm';

// ---------------------------------------------------------------------------
// Photo arrays
// ---------------------------------------------------------------------------

const WOMEN_PHOTOS = [
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=400',
  'https://images.unsplash.com/photo-1543949806-2c9935e6aa78?w=400',
  'https://images.unsplash.com/photo-1589729132389-8f0e0b55b91e?w=400',
  'https://images.unsplash.com/photo-1604072366595-e75dc92d6bdc?w=400',
  'https://images.unsplash.com/photo-1607569708758-0270aa4651bd?w=400',
  'https://images.unsplash.com/photo-1609436132311-e4b0c9370469?w=400',
  'https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?w=400',
  'https://images.unsplash.com/photo-1667053508464-eb11b394df83?w=400',
  'https://images.unsplash.com/photo-1633355130553-2d90ad3507d3?w=400',
  'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=400',
  'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400',
  'https://images.unsplash.com/photo-1532171875345-9712d9d4f65a?w=400',
  'https://images.unsplash.com/photo-1760552069633-c05f246a5d8c?w=400',
  'https://images.unsplash.com/photo-1644718847160-52a922094f69?w=400',
  'https://images.unsplash.com/photo-1609371497456-3a55a205d5eb?w=400',
  'https://images.unsplash.com/photo-1604874156629-5c6c3b3bded7?w=400',
  'https://images.unsplash.com/photo-1701728667207-54b43dbdab97?w=400',
  'https://images.unsplash.com/photo-1593937799405-f5da790f5b04?w=400',
  'https://images.unsplash.com/photo-1631521835033-612c70a7b794?w=400',
  'https://images.unsplash.com/photo-1624421102236-21991227042f?w=400',
  'https://images.unsplash.com/photo-1705830337569-47a1a24b0ad2?w=400',
  'https://images.unsplash.com/photo-1594300084190-0c5b8d73a2e8?w=400',
  'https://images.unsplash.com/photo-1705829000895-734e6c2f6c15?w=400',
  'https://images.unsplash.com/photo-1706824261799-55343861e08e?w=400',
  'https://images.unsplash.com/photo-1749700332246-b4fedd192b11?w=400',
  'https://images.unsplash.com/photo-1697517874153-0384d16722fd?w=400',
  'https://images.unsplash.com/photo-1623567533471-2c789007ce34?w=400',
  'https://images.unsplash.com/photo-1603678074485-51208e6f3a67?w=400',
];

const MEN_PHOTOS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  'https://images.unsplash.com/photo-1590086782792-42dd2350140d?w=400',
  'https://images.unsplash.com/photo-1587397845856-e6cf49176c70?w=400',
  'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=400',
  'https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=400',
  'https://images.unsplash.com/photo-1509460913899-515f1df34fea?w=400',
  'https://images.unsplash.com/photo-1600603406200-5b2a104684ac?w=400',
  'https://images.unsplash.com/photo-1565884280295-98eb83e41c65?w=400',
  'https://images.unsplash.com/photo-1514929781313-76fcbb2136b6?w=400',
  'https://images.unsplash.com/photo-1677543167033-af3c688aa4df?w=400',
  'https://images.unsplash.com/photo-1531750026848-8ada78f641c2?w=400',
  'https://images.unsplash.com/photo-1642736468842-c6bdcfbbcd28?w=400',
  'https://images.unsplash.com/photo-1558730234-d8b2281b0d00?w=400',
  'https://images.unsplash.com/photo-1610903866883-c280999dcc0e?w=400',
  'https://images.unsplash.com/photo-1518725522904-4b3939358342?w=400',
  'https://images.unsplash.com/photo-1762753674498-73ec49feafc4?w=400',
  'https://images.unsplash.com/photo-1614010966237-74489a16848b?w=400',
  'https://images.unsplash.com/photo-1740102074295-c13fae3e4f8a?w=400',
  'https://images.unsplash.com/photo-1661859425965-0dc4dd6fb907?w=400',
  'https://images.unsplash.com/photo-1618616153864-f1251396e07a?w=400',
  'https://images.unsplash.com/photo-1578254090783-31fa81462b73?w=400',
  'https://images.unsplash.com/photo-1624395213043-fa2e123b2656?w=400',
  'https://images.unsplash.com/photo-1624395213232-ea2bcd36b865?w=400',
  'https://images.unsplash.com/photo-1624395213081-608f51284ddd?w=400',
  'https://images.unsplash.com/photo-1623531879509-e4944f7e34ff?w=400',
  'https://images.unsplash.com/photo-1649354680299-ed0d7c3cb786?w=400',
  'https://images.unsplash.com/photo-1679255838612-063fbb055250?w=400',
  'https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?w=400',
];

// ---------------------------------------------------------------------------
// Name lists
// ---------------------------------------------------------------------------

const WOMEN_NAMES = ['Emma', 'Sophia', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Ella', 'Scarlett', 'Grace', 'Lily', 'Chloe', 'Penelope', 'Layla', 'Riley', 'Zoey', 'Nora', 'Luna', 'Savannah', 'Brooklyn', 'Leah', 'Zoe', 'Stella', 'Hazel', 'Ellie', 'Paisley', 'Audrey', 'Skylar', 'Violet', 'Claire', 'Bella', 'Aurora', 'Lucy', 'Anna', 'Samantha', 'Caroline', 'Genesis', 'Aaliyah', 'Kennedy', 'Madelyn', 'Allison', 'Maya', 'Sarah', 'Alyssa', 'Ariana', 'Elena', 'Gabriella', 'Naomi'];

const MEN_NAMES = ['Liam', 'Noah', 'Oliver', 'James', 'Elijah', 'William', 'Henry', 'Lucas', 'Benjamin', 'Theodore', 'Jack', 'Levi', 'Alexander', 'Mason', 'Ethan', 'Daniel', 'Jacob', 'Logan', 'Jackson', 'Sebastian', 'Mateo', 'Owen', 'Samuel', 'Ryan', 'Nathan', 'Adrian', 'Leo', 'Miles', 'Eli', 'Caleb', 'Landon', 'Isaac', 'Luke', 'Jayden', 'Gabriel', 'Julian', 'Brooks', 'Wesley', 'Ezra', 'Kai', 'Max', 'Finn', 'Cole', 'Dean', 'Marcus', 'Xavier', 'Roman', 'Omar', 'Nico', 'Ravi'];

// ---------------------------------------------------------------------------
// Neighborhoods
// ---------------------------------------------------------------------------

const NEIGHBORHOODS = ['Williamsburg', 'Park Slope', 'East Village', 'Chelsea', 'West Village', 'Bed-Stuy', 'Greenpoint', 'Bushwick', 'Fort Greene', 'Crown Heights', 'Prospect Heights', 'Cobble Hill', 'Brooklyn Heights', 'DUMBO', 'Astoria', 'Long Island City', 'Lower East Side', 'SoHo', 'Tribeca', 'Upper West Side', 'Upper East Side', 'Harlem', 'Murray Hill', 'Gramercy', 'NoHo'];

// ---------------------------------------------------------------------------
// Qualities & values
// ---------------------------------------------------------------------------

const ALL_QUALITIES = ['humor', 'candor', 'curiosity', 'warmth', 'ambition', 'steadiness', 'depth', 'playfulness', 'self-awareness'];
const ALL_VALUES = ['family', 'freedom', 'growth', 'honesty', 'adventure', 'faith', 'security', 'creativity', 'justice', 'intellectual life'];

// ---------------------------------------------------------------------------
// Dealbreaker option pools
// ---------------------------------------------------------------------------

const DL_OPTIONS: Record<string, string[]> = {
  marriage: ['i want to get married', "i'm happy without marriage", 'not sure yet'],
  monogamy: ['monogamous', 'open to open', 'poly'],
  kids_have: ['yes', 'no'],
  kids_want: ['yes', 'no', 'maybe'],
  religion: ['important to me', 'not important', 'spiritual but not religious'],
  politics: ['progressive', 'moderate', 'conservative', 'independent', 'apolitical'],
  drinking: ['i drink', "i don't drink", 'i drink socially'],
  smoking: ['i smoke', "i don't smoke", 'i smoke sometimes'],
  drugs: ["i don't use drugs", 'cannabis', 'psychedelics'],
  lifestyle: ['homebody', 'social', 'somewhere in between'],
};

// ---------------------------------------------------------------------------
// Physical attribute option pools
// ---------------------------------------------------------------------------

const PH_OPTIONS: Record<string, string[]> = {
  height: ['short', 'average', 'tall'],
  body_type: ['slim', 'athletic', 'average', 'curvy', 'plus-size'],
  fitness: ['very active', 'active', 'moderate', 'not very active'],
};

// ---------------------------------------------------------------------------
// Bio templates
// ---------------------------------------------------------------------------

const BIOS = [
  'I work in {field} and spend my free time {hobby}. Looking for someone who can hold a conversation and isn\'t afraid to be themselves.',
  '{field} by day, {hobby} enthusiast by night. I believe the best relationships start with genuine friendship.',
  'Moved to New York for {reason}. Still here because of the people. I cook more than I eat out and I read more than I scroll.',
  'I\'m the kind of person who {trait}. Looking for someone who values depth over surface.',
  'Professionally: {field}. Personally: trying to {goal}. I take my work seriously but not myself.',
];
const FIELDS = ['tech', 'design', 'medicine', 'education', 'finance', 'media', 'law', 'the arts', 'nonprofits', 'research'];
const HOBBIES = ['cooking', 'running', 'reading', 'photography', 'hiking', 'painting', 'yoga', 'climbing', 'writing', 'music'];
const REASONS = ['the food', 'a job', 'grad school', 'a relationship that didn\'t work out', 'the energy', 'adventure'];
const TRAITS = ['remembers the small things', 'asks too many questions', 'shows up early', 'stays curious', 'laughs too loud'];
const GOALS = ['slow down and be present', 'build something meaningful', 'learn to cook properly', 'read fifty books this year', 'find my person'];

// ---------------------------------------------------------------------------
// Life-answer templates
// ---------------------------------------------------------------------------

const ANSWER_TEMPLATES: Record<string, string[]> = {
  'what a really good day looks like for me': ['Coffee, farmers market, cooking something new, falling asleep reading.', 'No alarm. Long walk. Good conversation over dinner. Early to bed.', 'Morning run, afternoon in a museum, evening with friends and wine.'],
  'what I\'m most grateful for': ['My closest friends. They showed up when it mattered.', 'The freedom to build a life I actually want.', 'My health, my family, and the fact that I still get excited about small things.'],
  'what I value most in a friendship': ['Honesty, even when it\'s uncomfortable.', 'Someone who shows up consistently, not just when it\'s convenient.', 'Being able to sit in silence without it being awkward.'],
  'something that changed how I see things': ['Living alone for the first time taught me who I actually am vs. who I was performing.', 'Losing someone close. It reordered everything.', 'Traveling somewhere I didn\'t speak the language.'],
  'what I care about most right now': ['Being more intentional about how I spend my time.', 'Building real relationships, not collecting acquaintances.', 'Getting better at the things I already do instead of chasing new ones.'],
  'what people get wrong about me': ['They think I\'m serious. I\'m actually just paying attention.', 'That I\'m low energy. I just save it for things that matter.', 'That I have it figured out. I definitely do not.'],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function randomAge(): number {
  return 25 + Math.floor(Math.random() * 21); // 25..45
}

function generateBio(): string {
  const template = pick(BIOS);
  return template
    .replace('{field}', pick(FIELDS))
    .replace('{hobby}', pick(HOBBIES))
    .replace('{reason}', pick(REASONS))
    .replace('{trait}', pick(TRAITS))
    .replace('{goal}', pick(GOALS));
}

function pickLifeAnswers(): { prompt: string; answer: string; displayOrder: number }[] {
  const prompts = shuffle(Object.keys(ANSWER_TEMPLATES)).slice(0, 2);
  return prompts.map((prompt, idx) => ({
    prompt,
    answer: pick(ANSWER_TEMPLATES[prompt]),
    displayOrder: idx + 1,
  }));
}

function pickQualities(): { quality: string; rank: number }[] {
  const selfQualities = shuffle(ALL_QUALITIES).slice(0, 4);
  // ~50% chance want differs from self
  const wantQualities = Math.random() < 0.5
    ? selfQualities
    : shuffle(ALL_QUALITIES).slice(0, 4);

  const rows: { quality: string; rank: number }[] = [];
  selfQualities.forEach((q, i) => rows.push({ quality: `self:${q}`, rank: i + 1 }));
  wantQualities.forEach((q, i) => rows.push({ quality: `want:${q}`, rank: i + 1 }));
  return rows;
}

function pickValues(): { value: string; rank: number }[] {
  return shuffle(ALL_VALUES).slice(0, 5).map((v, i) => ({ value: v, rank: i + 1 }));
}

/**
 * Generate dealbreaker rows for one profile.
 * `selectivity` controls how many answers are flagged as dealbreakers:
 *   - 'low'  = 0-1 dealbreakers  (open-minded)
 *   - 'mid'  = 2-4 dealbreakers  (moderate)
 *   - 'high' = 5-7 dealbreakers  (very selective)
 */
function pickDealbreakers(selectivity: 'low' | 'mid' | 'high'): { question: string; answer: string; isDealbreaker: boolean }[] {
  const questions = Object.keys(DL_OPTIONS);
  const answers = questions.map(q => ({
    question: q,
    answer: pick(DL_OPTIONS[q]),
    isDealbreaker: false,
  }));

  // Decide how many to flag
  let maxDB: number;
  switch (selectivity) {
    case 'low': maxDB = Math.floor(Math.random() * 2); break;      // 0-1
    case 'mid': maxDB = 2 + Math.floor(Math.random() * 3); break;  // 2-4
    case 'high': maxDB = 5 + Math.floor(Math.random() * 3); break; // 5-7
  }

  const shuffled = shuffle([...Array(answers.length).keys()]);
  for (let i = 0; i < Math.min(maxDB, answers.length); i++) {
    answers[shuffled[i]].isDealbreaker = true;
  }
  return answers;
}

function pickPhysical(): { question: string; answer: string; isDealbreaker: boolean }[] {
  return Object.keys(PH_OPTIONS).map(q => ({
    question: q,
    answer: pick(PH_OPTIONS[q]),
    isDealbreaker: false,
  }));
}

function selectivity(): 'low' | 'mid' | 'high' {
  const r = Math.random();
  if (r < 0.3) return 'low';   // 30% open
  if (r < 0.7) return 'mid';   // 40% moderate
  return 'high';                // 30% selective
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST() {
  try {
    // 1. Check if bulk seeds already exist
    const [{ count: existingCount }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(like(users.email, 'seed-fake-%@freelove.internal'));

    if (Number(existingCount) >= 100) {
      return NextResponse.json({ ok: true, created: 0, message: 'Bulk seeds already exist' });
    }

    // 2. Hash password once
    const passwordHash = await hashPassword('seed-internal-only');

    let created = 0;

    // 3. Create 100 profiles (indices 1..100; 1-50 women, 51-100 men)
    for (let i = 1; i <= 100; i++) {
      const isWoman = i <= 50;
      const idx = isWoman ? i - 1 : i - 51; // 0-based within gender group
      const padded = String(i).padStart(3, '0');
      const email = `seed-fake-${padded}@freelove.internal`;

      const name = isWoman ? WOMEN_NAMES[idx] : MEN_NAMES[idx];
      const gender = isWoman ? 'woman' : 'man';
      const seeking = isWoman ? ['men'] : ['women'];
      const photoUrl = isWoman
        ? WOMEN_PHOTOS[idx % 30]
        : MEN_PHOTOS[idx % 30];

      // Insert user
      const [user] = await db.insert(users).values({
        email,
        passwordHash,
        isAdmin: false,
        onboardingComplete: true,
        onboardingStep: 10,
      }).returning({ id: users.id });

      // Insert user state
      await db.insert(userState).values({
        userId: user.id,
        status: 'active',
        lastActiveAt: new Date(),
      });

      // Insert profile
      const [profile] = await db.insert(profiles).values({
        userId: user.id,
        displayName: name,
        age: randomAge(),
        gender,
        orientation: 'straight',
        seeking,
        locationName: pick(NEIGHBORHOODS),
      }).returning({ id: profiles.id });

      // Insert photo (life signal)
      await db.insert(lifeSignals).values({
        profileId: profile.id,
        type: 'just me',
        photoUrl,
        caption: 'just me',
      });

      // Insert bio as first life answer
      const bio = generateBio();
      const lifeAnswerRows = pickLifeAnswers();

      await db.insert(lifeAnswers).values([
        { profileId: profile.id, prompt: 'about me', answer: bio, displayOrder: 0 },
        ...lifeAnswerRows.map(a => ({ profileId: profile.id, ...a })),
      ]);

      // Insert qualities (self: and want: prefixed)
      const qualityRows = pickQualities();
      await db.insert(rankedQualities).values(
        qualityRows.map(q => ({ profileId: profile.id, ...q }))
      );

      // Insert values
      const valueRows = pickValues();
      await db.insert(rankedValues).values(
        valueRows.map(v => ({ profileId: profile.id, ...v }))
      );

      // Insert dealbreakers (lifestyle)
      const sel = selectivity();
      const dlRows = pickDealbreakers(sel);
      const phRows = pickPhysical();

      await db.insert(lifeBasics).values([
        ...dlRows.map(d => ({ profileId: profile.id, ...d })),
        ...phRows.map(p => ({ profileId: profile.id, ...p })),
      ]);

      created++;
    }

    return NextResponse.json({ ok: true, created });
  } catch (e) {
    console.error('seed-bulk error:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
