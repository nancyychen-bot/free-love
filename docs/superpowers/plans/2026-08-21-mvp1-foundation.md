# MVP-1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the database, auth, and protected routing so a real user can sign up, log in, and see the app shell. Deploy to Vercel + Neon from day one.

**Architecture:** Next.js 16 App Router with Drizzle ORM on Neon PostgreSQL. Auth is simple email/password with bcrypt hashing and secure httpOnly session cookies. The existing prototype screens (10 routes with mock data) get wrapped in auth-protected routing via Next.js 16's `proxy.ts` (the replacement for middleware.js). Server Actions handle mutations.

**Tech Stack:** Next.js 16, TypeScript, Drizzle ORM, Neon PostgreSQL, bcrypt, jose (JWT for session tokens)

**Codebase:** `/Users/nancychen/Library/Mobile Documents/com~apple~CloudDocs/Apps Created/free-love/app`

**Key Next.js 16 note:** `middleware.js` is **deprecated** and renamed to `proxy.ts`. The export is `export function proxy(request)` not `export function middleware(request)`.

---

## File structure

```
src/
├── lib/
│   ├── db/
│   │   ├── index.ts              — Drizzle client + Neon connection
│   │   ├── schema.ts             — All table definitions
│   │   └── migrate.ts            — Migration runner script
│   ├── auth/
│   │   ├── session.ts            — JWT create/verify/refresh, cookie helpers
│   │   ├── password.ts           — Hash + verify with bcrypt
│   │   └── get-user.ts           — Server-side "who am I?" helper
│   └── mock-data.ts              — (existing, kept for now)
├── app/
│   ├── layout.tsx                — (modify: wrap with auth context)
│   ├── globals.css               — (existing, unchanged)
│   ├── page.tsx                  — (existing sign-in, modify: redirect if logged in)
│   ├── signup/
│   │   └── page.tsx              — New signup form
│   ├── login/
│   │   └── page.tsx              — New login form
│   ├── api/
│   │   └── auth/
│   │       ├── signup/route.ts   — POST: create user
│   │       ├── login/route.ts    — POST: verify + set cookie
│   │       └── logout/route.ts   — POST: clear cookie
│   ├── (app)/                    — Route group for authenticated screens
│   │   ├── layout.tsx            — Auth check, redirect if not logged in
│   │   ├── introduction/page.tsx — (move existing)
│   │   ├── drought/page.tsx      — (move existing)
│   │   ├── billing-paused/page.tsx
│   │   ├── conversations/page.tsx
│   │   ├── how-this-works/page.tsx
│   │   ├── manifesto/page.tsx
│   │   └── onboarding/
│   │       ├── dealbreaker/page.tsx
│   │       └── ranking/page.tsx
│   ├── components/               — (existing, unchanged)
│   └── admin/                    — (placeholder for MVP-3)
├── proxy.ts                      — Auth redirect logic (NOT middleware.ts)
drizzle.config.ts                 — Drizzle Kit config
.env.local                        — DATABASE_URL, SESSION_SECRET
```

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Drizzle ORM, Neon driver, auth deps**

```bash
cd "/Users/nancychen/Library/Mobile Documents/com~apple~CloudDocs/Apps Created/free-love/app"
npm install drizzle-orm @neondatabase/serverless bcryptjs jose
npm install -D drizzle-kit @types/bcryptjs
```

- [ ] **Step 2: Verify installation**

Run: `npm ls drizzle-orm @neondatabase/serverless bcryptjs jose`
Expected: All four packages listed without errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add drizzle, neon, bcrypt, jose dependencies"
```

---

### Task 2: Database schema with Drizzle

**Files:**
- Create: `src/lib/db/schema.ts`
- Create: `src/lib/db/index.ts`
- Create: `drizzle.config.ts`
- Create: `.env.local` (not committed)
- Create: `.env.example`

- [ ] **Step 1: Create `.env.example` with required variables**

```bash
# .env.example
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
SESSION_SECRET=at-least-32-characters-of-randomness-here
```

- [ ] **Step 2: Create `.env.local` with your actual Neon connection string**

Get the connection string from Neon console (https://console.neon.tech). Create a new project called "free-love" if one doesn't exist.

```bash
# .env.local — DO NOT COMMIT
DATABASE_URL=postgresql://...your-neon-connection-string...?sslmode=require
SESSION_SECRET=replace-with-output-of-openssl-rand-base64-32
```

Generate the secret: `openssl rand -base64 32`

- [ ] **Step 3: Create the Drizzle config**

Create `drizzle.config.ts`:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 4: Create the full database schema**

Create `src/lib/db/schema.ts`:

```typescript
import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  decimal,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

// ── Core tables ──────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  onboardingComplete: boolean("onboarding_complete").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).unique().notNull(),
  displayName: text("display_name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  orientation: text("orientation").notNull(),
  seeking: text("seeking").array().notNull(),
  locationLat: decimal("location_lat"),
  locationLng: decimal("location_lng"),
  locationName: text("location_name"),
  radiusMiles: integer("radius_miles").default(15).notNull(),
  facePhotoUrl: text("face_photo_url"),
  bodyPhotoUrl: text("body_photo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const lifeBasics = pgTable("life_basics", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id").references(() => profiles.id).notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  isDealbreaker: boolean("is_dealbreaker").default(false).notNull(),
});

export const rankedQualities = pgTable(
  "ranked_qualities",
  {
    profileId: uuid("profile_id").references(() => profiles.id).notNull(),
    quality: text("quality").notNull(),
    rank: integer("rank").notNull(),
  },
  (table) => [primaryKey({ columns: [table.profileId, table.quality] })]
);

export const rankedValues = pgTable(
  "ranked_values",
  {
    profileId: uuid("profile_id").references(() => profiles.id).notNull(),
    value: text("value").notNull(),
    rank: integer("rank").notNull(),
  },
  (table) => [primaryKey({ columns: [table.profileId, table.value] })]
);

export const lifeAnswers = pgTable("life_answers", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id").references(() => profiles.id).notNull(),
  prompt: text("prompt").notNull(),
  answer: text("answer").notNull(),
  displayOrder: integer("display_order"),
});

export const lifeSignals = pgTable("life_signals", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id").references(() => profiles.id).notNull(),
  type: text("type"),
  photoUrl: text("photo_url"),
  caption: text("caption"),
});

// ── Matching & introductions ─────────────────────────────

export const introductions = pgTable("introductions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userAId: uuid("user_a_id").references(() => users.id).notNull(),
  userBId: uuid("user_b_id").references(() => users.id).notNull(),
  score: decimal("score").notNull(),
  floorA: decimal("floor_a").notNull(),
  floorB: decimal("floor_b").notNull(),
  explanation: text("explanation").notNull(),
  source: text("source").default("engine").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const introductionActions = pgTable("introduction_actions", {
  id: uuid("id").defaultRandom().primaryKey(),
  introductionId: uuid("introduction_id").references(() => introductions.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Conversations ────────────────────────────────────────

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  introductionId: uuid("introduction_id").references(() => introductions.id).notNull(),
  userAId: uuid("user_a_id").references(() => users.id).notNull(),
  userBId: uuid("user_b_id").references(() => users.id).notNull(),
  status: text("status").default("active").notNull(),
  closedBy: uuid("closed_by").references(() => users.id),
  closureReason: text("closure_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  closedAt: timestamp("closed_at", { withTimezone: true }),
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id").references(() => conversations.id).notNull(),
  senderId: uuid("sender_id").references(() => users.id).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const goodbyeNotes = pgTable("goodbye_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id").references(() => conversations.id).notNull(),
  senderId: uuid("sender_id").references(() => users.id).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── User state ───────────────────────────────────────────

export const userState = pgTable("user_state", {
  userId: uuid("user_id").references(() => users.id).primaryKey(),
  status: text("status").default("active").notNull(),
  pausedAt: timestamp("paused_at", { withTimezone: true }),
  lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
});

export const exits = pgTable("exits", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  foundSomeone: boolean("found_someone"),
  story: text("story"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const blockedPairs = pgTable(
  "blocked_pairs",
  {
    blockerId: uuid("blocker_id").references(() => users.id).notNull(),
    blockedId: uuid("blocked_id").references(() => users.id).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.blockerId, table.blockedId] })]
);
```

- [ ] **Step 5: Create the database client**

Create `src/lib/db/index.ts`:

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

- [ ] **Step 6: Generate and push the migration**

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

Expected: Migration files created in `./drizzle/` and tables created in Neon.

- [ ] **Step 7: Verify tables exist**

```bash
npx drizzle-kit studio
```

Open the URL it prints. You should see all tables: users, profiles, life_basics, ranked_qualities, ranked_values, life_answers, life_signals, introductions, introduction_actions, conversations, messages, goodbye_notes, user_state, exits, blocked_pairs.

- [ ] **Step 8: Commit**

```bash
git add src/lib/db/ drizzle.config.ts drizzle/ .env.example
git commit -m "feat: add database schema with Drizzle ORM + Neon"
```

---

### Task 3: Auth — password hashing and session management

**Files:**
- Create: `src/lib/auth/password.ts`
- Create: `src/lib/auth/session.ts`
- Create: `src/lib/auth/get-user.ts`

- [ ] **Step 1: Create password helpers**

Create `src/lib/auth/password.ts`:

```typescript
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

- [ ] **Step 2: Create session helpers (JWT + httpOnly cookie)**

Create `src/lib/auth/session.ts`:

```typescript
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET!);
const COOKIE_NAME = "fl_session";
const EXPIRES_IN = 60 * 60 * 24 * 30; // 30 days in seconds

export async function createSession(userId: string): Promise<void> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${EXPIRES_IN}s`)
    .setIssuedAt()
    .sign(SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: EXPIRES_IN,
  });
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return (payload.userId as string) ?? null;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
```

- [ ] **Step 3: Create get-user helper**

Create `src/lib/auth/get-user.ts`:

```typescript
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getSessionUserId } from "./session";

export type AuthUser = {
  id: string;
  email: string;
  isAdmin: boolean;
  onboardingComplete: boolean;
};

export async function getUser(): Promise<AuthUser | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      isAdmin: users.isAdmin,
      onboardingComplete: users.onboardingComplete,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return rows[0] ?? null;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth/
git commit -m "feat: add auth helpers — password hashing, JWT sessions, get-user"
```

---

### Task 4: Auth API routes — signup, login, logout

**Files:**
- Create: `src/app/api/auth/signup/route.ts`
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/logout/route.ts`

- [ ] **Step 1: Create signup route**

Create `src/app/api/auth/signup/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, userState } from "@/lib/db/schema";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({
      email: email.toLowerCase().trim(),
      passwordHash,
    })
    .returning({ id: users.id });

  await db.insert(userState).values({
    userId: user.id,
    status: "active",
    lastActiveAt: new Date(),
  });

  await createSession(user.id);

  return NextResponse.json({ ok: true }, { status: 201 });
}
```

- [ ] **Step 2: Create login route**

Create `src/app/api/auth/login/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const [user] = await db
    .select({
      id: users.id,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  await createSession(user.id);

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Create logout route**

Create `src/app/api/auth/logout/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

export async function POST() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: Successful build with no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/auth/
git commit -m "feat: add auth API routes — signup, login, logout"
```

---

### Task 5: Signup and login pages

**Files:**
- Create: `src/app/signup/page.tsx`
- Create: `src/app/login/page.tsx`
- Modify: `src/app/page.tsx` — update sign-in buttons to link to real routes

- [ ] **Step 1: Create the signup page**

Create `src/app/signup/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StatusBar from '@/app/components/StatusBar';
import Wordmark from '@/app/components/Wordmark';

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push('/onboarding/dealbreaker');
  }

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <div style={{ flex: 1, padding: '0 24px' }}>
        <div style={{ paddingTop: 40 }}>
          <Wordmark size={21} />
        </div>

        <p
          style={{
            marginTop: 30,
            fontFamily: 'var(--font-system)',
            fontSize: 14,
            letterSpacing: '0.14em',
            textTransform: 'uppercase' as const,
            color: 'var(--ink-true)',
          }}
        >
          create your account
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-system)',
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase' as const,
              color: 'var(--gray-quiet)',
              marginBottom: 8,
            }}
          >
            email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 13,
              border: '1px solid var(--rule)',
              background: 'var(--paper)',
              fontFamily: 'var(--font-system)',
              fontSize: 13.5,
              color: 'var(--ink-true)',
              outline: 'none',
            }}
          />

          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-system)',
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase' as const,
              color: 'var(--gray-quiet)',
              marginTop: 20,
              marginBottom: 8,
            }}
          >
            password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            style={{
              width: '100%',
              padding: 13,
              border: '1px solid var(--rule)',
              background: 'var(--paper)',
              fontFamily: 'var(--font-system)',
              fontSize: 13.5,
              color: 'var(--ink-true)',
              outline: 'none',
            }}
          />

          {error && (
            <p
              style={{
                marginTop: 14,
                fontFamily: 'var(--font-system)',
                fontSize: 12,
                color: '#8B0000',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'block',
              width: '100%',
              padding: 15,
              marginTop: 28,
              background: 'var(--ink-true)',
              color: 'var(--paper)',
              fontFamily: 'var(--font-system)',
              fontSize: 13.5,
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'creating account...' : 'create account'}
          </button>
        </form>

        <p
          style={{
            marginTop: 20,
            fontFamily: 'var(--font-system)',
            fontSize: 12,
            color: 'var(--gray-quiet)',
            textAlign: 'center',
          }}
        >
          already have an account?{' '}
          <Link
            href="/login"
            style={{ color: 'var(--ink-true)', textDecoration: 'underline' }}
          >
            log in
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the login page**

Create `src/app/login/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StatusBar from '@/app/components/StatusBar';
import Wordmark from '@/app/components/Wordmark';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push('/introduction');
  }

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <div style={{ flex: 1, padding: '0 24px' }}>
        <div style={{ paddingTop: 40 }}>
          <Wordmark size={21} />
        </div>

        <p
          style={{
            marginTop: 30,
            fontFamily: 'var(--font-system)',
            fontSize: 14,
            letterSpacing: '0.14em',
            textTransform: 'uppercase' as const,
            color: 'var(--ink-true)',
          }}
        >
          log in
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-system)',
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase' as const,
              color: 'var(--gray-quiet)',
              marginBottom: 8,
            }}
          >
            email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 13,
              border: '1px solid var(--rule)',
              background: 'var(--paper)',
              fontFamily: 'var(--font-system)',
              fontSize: 13.5,
              color: 'var(--ink-true)',
              outline: 'none',
            }}
          />

          <label
            style={{
              display: 'block',
              fontFamily: 'var(--font-system)',
              fontSize: 10,
              letterSpacing: '0.16em',
              textTransform: 'uppercase' as const,
              color: 'var(--gray-quiet)',
              marginTop: 20,
              marginBottom: 8,
            }}
          >
            password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 13,
              border: '1px solid var(--rule)',
              background: 'var(--paper)',
              fontFamily: 'var(--font-system)',
              fontSize: 13.5,
              color: 'var(--ink-true)',
              outline: 'none',
            }}
          />

          {error && (
            <p
              style={{
                marginTop: 14,
                fontFamily: 'var(--font-system)',
                fontSize: 12,
                color: '#8B0000',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'block',
              width: '100%',
              padding: 15,
              marginTop: 28,
              background: 'var(--ink-true)',
              color: 'var(--paper)',
              fontFamily: 'var(--font-system)',
              fontSize: 13.5,
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'logging in...' : 'log in'}
          </button>
        </form>

        <p
          style={{
            marginTop: 20,
            fontFamily: 'var(--font-system)',
            fontSize: 12,
            color: 'var(--gray-quiet)',
            textAlign: 'center',
          }}
        >
          need an account?{' '}
          <Link
            href="/signup"
            style={{ color: 'var(--ink-true)', textDecoration: 'underline' }}
          >
            sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update the sign-in page buttons to link to real routes**

Modify `src/app/page.tsx`: Change the "start the nine questions" `href` from `/onboarding/dealbreaker` to `/signup`, and the "i already have an account" `href` from `/introduction` to `/login`.

Find and replace:
- `href="/onboarding/dealbreaker"` → `href="/signup"`
- `href="/introduction"` → `href="/login"`

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: Successful build.

- [ ] **Step 5: Commit**

```bash
git add src/app/signup/ src/app/login/ src/app/page.tsx
git commit -m "feat: add signup and login pages, update sign-in buttons"
```

---

### Task 6: Protected routing with proxy.ts

**Files:**
- Create: `src/proxy.ts` (Next.js 16 — NOT middleware.ts)
- Create: `src/app/(app)/layout.tsx` — auth-gated layout
- Move existing screen pages into `src/app/(app)/` route group

- [ ] **Step 1: Create the proxy for auth redirects**

Create `src/proxy.ts`:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET!);
const COOKIE_NAME = "fl_session";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/api/auth/", "/how-this-works", "/manifesto"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) =>
    p.endsWith("/") ? pathname.startsWith(p) : pathname === p
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Public paths — no auth required
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check session
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

- [ ] **Step 2: Create the authenticated layout**

Create `src/app/(app)/layout.tsx`:

```typescript
import { getUser } from "@/lib/auth/get-user";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
```

- [ ] **Step 3: Move existing screens into the (app) route group**

Move these directories from `src/app/` to `src/app/(app)/`:
- `introduction/`
- `drought/`
- `billing-paused/`
- `conversations/`
- `onboarding/`

```bash
cd "/Users/nancychen/Library/Mobile Documents/com~apple~CloudDocs/Apps Created/free-love/app/src/app"
mkdir -p "(app)"
mv introduction "(app)/"
mv drought "(app)/"
mv billing-paused "(app)/"
mv conversations "(app)/"
mv onboarding "(app)/"
```

Note: `how-this-works/` and `manifesto/` stay at the top level — they're public pages accessible from the sign-in footer.

- [ ] **Step 4: Verify the build compiles and routing works**

Run: `npm run build`
Expected: All routes compile. The (app) group should show routes like `/(app)/introduction`, `/(app)/drought`, etc. The parenthetical group doesn't affect the URL — `/introduction` still works.

- [ ] **Step 5: Test the auth flow manually**

Run: `npm run dev`

1. Visit `http://localhost:3000` — should see the sign-in page
2. Click "start the nine questions" → should go to `/signup`
3. Sign up with an email/password → should redirect to `/onboarding/dealbreaker`
4. Visit `/introduction` directly → should show the page (you're logged in)
5. Open an incognito window, visit `/introduction` → should redirect to `/login`

- [ ] **Step 6: Commit**

```bash
git add src/proxy.ts src/app/\(app\)/ 
git commit -m "feat: add auth-protected routing via proxy.ts"
```

---

### Task 7: Deploy to Vercel + Neon

**Files:**
- No new files — deployment configuration

- [ ] **Step 1: Add .env.local variables to Vercel**

If you haven't already connected the repo to Vercel:

```bash
npx vercel link
```

Then set environment variables:

```bash
npx vercel env add DATABASE_URL
npx vercel env add SESSION_SECRET
```

Paste the same values from `.env.local` when prompted.

- [ ] **Step 2: Deploy**

```bash
npx vercel --prod
```

Expected: Deployment succeeds. You get a URL like `https://free-love-xxx.vercel.app`.

- [ ] **Step 3: Test the deployed app**

1. Visit the Vercel URL — should see the sign-in page
2. Sign up with a test email/password
3. Verify you're redirected to onboarding
4. Visit `/introduction` — should work (logged in via cookie)

- [ ] **Step 4: Commit any vercel config if generated**

```bash
git add -A
git commit -m "chore: deploy to Vercel"
```

---

### Task 8: Update StatusBar to show real state

**Files:**
- Modify: `src/app/components/StatusBar.tsx`

- [ ] **Step 1: Update StatusBar to accept optional user prop**

Replace `src/app/components/StatusBar.tsx`:

```typescript
export default function StatusBar({ email }: { email?: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 14,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 0,
      }}
    >
      <span className="type-status-bar">
        {new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })}
      </span>
      <span className="type-status-bar">free love</span>
    </div>
  );
}
```

This replaces the hardcoded "9:41" with the real time. The email prop is available for future use but not displayed (design spec shows only time + "free love" in the status bar).

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/StatusBar.tsx
git commit -m "feat: StatusBar shows real time instead of hardcoded 9:41"
```

---

## Summary

After completing all 8 tasks, the app has:

- ✅ PostgreSQL database on Neon with the full schema (15 tables)
- ✅ Email/password signup and login with secure session cookies
- ✅ Protected routing — unauthenticated users redirected to login
- ✅ Public pages (sign-in, how-this-works, manifesto) accessible without auth
- ✅ Real signup and login forms matching the design system
- ✅ Deployed to Vercel with a shareable URL
- ✅ StatusBar showing real time

**Next:** MVP-2 (Onboarding) — the nine questions writing to the database.
