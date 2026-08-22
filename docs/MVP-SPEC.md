# Free Love — MVP Spec

**Date:** August 2026
**Owners:** Justin & Nancy
**Status:** Ready for implementation
**Holistic roadmap:** `docs/IMPLEMENTATION-ROADMAP.md`

---

## Goal

A multi-user dating app where real people sign up, build profiles, receive threshold-based introductions, and have conversations — deployed to a shareable URL. The MVP should feel like the real product, not a demo. Every screen works, every button does something, state persists.

**What this is:** Phase 1 of the full product. A working app that two people in different locations can use simultaneously.

**What this is not:** Production-ready software. No identity verification, no billing, no LLM scoring, no moderation tooling. Those are separate phases.

---

## Stack

| Component | Choice | Why |
|---|---|---|
| Framework | Next.js App Router | Already prototyped. Server Actions for mutations. |
| Language | TypeScript | End to end. |
| Database | PostgreSQL on Neon | Free tier. Vercel integration. |
| ORM | Drizzle | Type-safe, SQL-close, lightweight. |
| Auth | Custom email/password | Simple. No OAuth complexity. Upgrade to passwordless later. |
| Hosting | Vercel | Free tier. Deploy on push. |
| Email | Resend (or similar) | Transactional notifications. Free tier sufficient for MVP. |
| Photos | Vercel Blob or Cloudflare R2 | Simple object storage for user photos. |

---

## Database schema

### Core tables

```
users
  id              uuid PK
  email           text UNIQUE NOT NULL
  password_hash   text NOT NULL
  created_at      timestamptz
  is_admin        boolean DEFAULT false
  onboarding_complete boolean DEFAULT false

profiles
  id              uuid PK
  user_id         uuid FK → users UNIQUE
  display_name    text NOT NULL
  age             integer NOT NULL
  gender          text NOT NULL
  orientation     text NOT NULL
  seeking         text[] NOT NULL          -- gender(s) sought
  location_lat    decimal
  location_lng    decimal
  location_name   text                     -- "bed-stuy"
  radius_miles    integer DEFAULT 15
  face_photo_url  text
  body_photo_url  text
  created_at      timestamptz
  updated_at      timestamptz

life_basics
  id              uuid PK
  profile_id      uuid FK → profiles
  question        text NOT NULL            -- "kids", "smoking", etc.
  answer          text NOT NULL            -- "i want kids"
  is_dealbreaker  boolean DEFAULT false

ranked_qualities
  profile_id      uuid FK → profiles
  quality         text NOT NULL
  rank            integer NOT NULL         -- 1-4, no ties
  PRIMARY KEY (profile_id, quality)

ranked_values
  profile_id      uuid FK → profiles
  value           text NOT NULL
  rank            integer NOT NULL         -- 1-5, no ties
  PRIMARY KEY (profile_id, value)

life_answers
  id              uuid PK
  profile_id      uuid FK → profiles
  prompt          text NOT NULL            -- "the kind of people i'm drawn to"
  answer          text NOT NULL
  display_order   integer

life_signals
  id              uuid PK
  profile_id      uuid FK → profiles
  type            text                     -- "song", "space", "bookshelf", etc.
  photo_url       text
  caption         text
```

### Matching & introductions

```
introductions
  id              uuid PK
  user_a_id       uuid FK → users
  user_b_id       uuid FK → users
  score           decimal NOT NULL
  floor_a         decimal NOT NULL         -- user A's floor at time of intro
  floor_b         decimal NOT NULL
  explanation     text NOT NULL            -- templated in MVP
  source          text DEFAULT 'engine'    -- 'engine' or 'admin'
  status          text DEFAULT 'pending'   -- pending / opened / passed / saved / expired
  created_at      timestamptz
  expires_at      timestamptz              -- created_at + 5 days

  UNIQUE (user_a_id, user_b_id)            -- no duplicate pairings

introduction_actions
  id              uuid PK
  introduction_id uuid FK → introductions
  user_id         uuid FK → users
  action          text NOT NULL            -- 'open' / 'pass' / 'save'
  created_at      timestamptz
```

### Conversations

```
conversations
  id              uuid PK
  introduction_id uuid FK → introductions
  user_a_id       uuid FK → users
  user_b_id       uuid FK → users
  status          text DEFAULT 'active'    -- active / closed_by_user / closed_auto / closed_nudge_expired
  closed_by       uuid FK → users          -- null if auto-closed
  closure_reason  text                     -- from removal flow
  created_at      timestamptz
  closed_at       timestamptz

messages
  id              uuid PK
  conversation_id uuid FK → conversations
  sender_id       uuid FK → users
  body            text NOT NULL
  created_at      timestamptz

goodbye_notes
  id              uuid PK
  conversation_id uuid FK → conversations
  sender_id       uuid FK → users          -- the person who was closed on
  body            text NOT NULL
  created_at      timestamptz
```

### User state

```
user_state
  user_id         uuid FK → users PK
  status          text DEFAULT 'active'    -- active / paused_user / paused_inactive
  paused_at       timestamptz
  last_active_at  timestamptz

exits
  id              uuid PK
  user_id         uuid FK → users
  found_someone   boolean
  story           text                     -- optional, with permission
  created_at      timestamptz

blocked_pairs
  blocker_id      uuid FK → users
  blocked_id      uuid FK → users
  created_at      timestamptz
  PRIMARY KEY (blocker_id, blocked_id)
```

---

## Build phases (within MVP)

### MVP-1: Foundation (week 1-2)

**Database + Auth + Basic Navigation**

- Set up Neon PostgreSQL + Drizzle ORM
- Implement schema (all tables above)
- Email/password signup + login + session management
- Connect the existing prototype screens to real routing
- Protected routes (redirect to sign-in if not authenticated)
- StatusBar shows actual user state (replace hardcoded "9:41")
- Deploy to Vercel — live from day one

**Deliverable:** A user can sign up, log in, and see the app shell. No onboarding yet.

### MVP-2: Onboarding (week 2-3)

**The nine questions, all writing to the database**

The nine steps in order:
1. Identity verification → **skipped in MVP** (placeholder "verified" badge)
2. The pledge → display, record signature timestamp
3. Identity & seeking → gender, orientation, seeking, location
4. Life basics / dealbreakers → kids, smoking, drinking, religion, politics, lifestyle (each with hard-line flag)
5. Ranked qualities → pick and rank 4 from 8 (drag-to-reorder, swap from unranked pool)
6. Ranked values → pick and rank 5 from 9 (same interaction)
7. Personality questions → **deferred to Phase 3** (skip in MVP)
8. Three life-question answers → free text, soft minimum ~40 words
9. Photos → face + body required, optional additional

Each step:
- Shows step N of 9 and public/private status
- Autosaves on completion
- Resumable (if user drops off, they return to where they left off)
- Writes to the appropriate database table

After step 9: `onboarding_complete = true`, user lands on the introduction screen (or drought screen if no matches yet).

**Dealbreaker screen:** shows live exclusion percentage from real pool data.

**Deliverable:** A user completes onboarding and has a real profile in the database.

### MVP-3: Matching Engine + Introductions (week 3-5)

**The system finds people for you**

#### Matching pipeline (runs daily, or on-demand via admin)
1. **Hard filters** — orientation compatibility, location radius, both users' dealbreakers (bidirectional). Exclude blocked pairs.
2. **Rules-based scoring** — weighted overlap:
   - Ranked qualities: compare rankings, weight by position (rank 1 match worth more than rank 4)
   - Ranked values: same approach
   - Life basics: soft overlap on non-dealbreaker answers
   - Normalize to 0–1 score
3. **Compatibility floor** — per-user threshold. Initial floor: `0.5` (tunable). If no candidates clear the floor, surface nothing.
4. **Select top candidates** — up to 3 per day per user that clear the floor. Deduplicate (never re-introduce a pair).
5. **Generate explanation** — templated in MVP: "You both ranked {quality} first. Neither of you flagged a dealbreaker the other holds. You both describe {theme} in your life answers." Build a template library with 5-10 variants.

#### Introduction surfacing
- Cron job or scheduled function runs matching pipeline
- Creates `introductions` rows for qualifying pairs
- Each introduction expires in 5 days

#### Introduction screen (real data)
- Shows real profile data from the database
- Real "why this match?" from templated explanation
- Real score readout (floor + pair score)
- Actions: open / pass / save — write to `introduction_actions`
- Opening requires both users to have opened → creates a `conversation`
- One-sided open shows honest pending state

#### Photos screen
- Shows the other person's uploaded photos with titled prompts
- Linked from the introduction avatar/photo count

#### Admin panel (`/admin`)
- Protected route (only `is_admin = true`)
- View all users and their profiles
- Manually create an introduction between any two users
- View matching pipeline output (who scored above floor, who didn't)
- Override: force-surface an introduction regardless of floor

**Deliverable:** Users receive real introductions. The introduction and drought screens show real data. Admin can manually pair people.

### MVP-4: Conversations (week 5-7)

**Two people actually talk**

#### Opening a conversation
- When both users have opened the same introduction, a `conversation` row is created
- Both are notified (in-app + email)
- Introduction leaves the introduction surface

#### Messaging
- Poll-based: client fetches new messages every 3-5 seconds when conversation is open
- Messages stored in `messages` table
- No read receipts, no typing indicators, no online-now dots
- Optional opening-question suggestions (3 suggestions based on shared profile content — hardcoded templates in MVP)

#### Three-conversation cap
- Before opening, check: does user have < 3 active conversations?
- If at cap: introduction enters holding space ("at capacity" state)
- Other person sees honest "at capacity" message — not silence

#### Closure flow
- "Why do you think you're not compatible?" — one question
- Non-answer re-prompts once, then accepts
- Reason stored in `closure_reason`, never shown to other person
- Other person gets closure notification + option to send one goodbye note
- Conversation status → `closed_by_user`

#### Thread-level enforcement
- Background job checks conversations daily:
  - Unanswered ≥3 days → send nudge (in-app + email)
  - Unanswered ≥5 days → auto-close, closure notification to both
- Pending introduction unreviewed ≥5 days → expire, notify both

#### Conversations list screen (real data)
- Shows active threads with real names, previews, timestamps
- Violet accent on threads from today's introduction
- Open slot count
- Closed threads with goodbye notes

**Deliverable:** Two users can have a real text conversation. Cap, closure, and enforcement all work.

### MVP-5: Complete the Loop (week 7-9)

**Every screen works with real data**

#### Drought screen (real data)
- Shows user's actual bar (values count, qualities count)
- Actual dealbreaker count
- Actual radius
- Actual pool size (computed from current filters)
- Three levers link to real settings pages:
  - Widen radius → radius setting
  - Revisit a dealbreaker → dealbreaker list
  - Rewrite a life answer → life answers editor

#### Pause mode
- User-initiated: matching stops, conversations hold (other party notified)
- 30-day auto-pause: if no activity for 30 days, auto-pause with exit prompt
- Exit prompt: "Stepping away? If you met someone, we'd love to know — it's the only number we care about."

#### Exit flow
- Triggered on account deletion, user pause, or auto-pause
- One question: did you find someone?
- If yes: optional story capture (with explicit permission). Graceful offboard.
- If no: no friction. Optional free-text. Return anytime.
- Writes to `exits` table

#### Profile editing
- Users can view and edit their complete match profile at any time
- Rankings reorderable but never flattenable
- Life answers editable
- Photos replaceable
- Dealbreakers toggleable (shows pool impact)

#### How This Works (real links)
- "the matching source code" → GitHub repo
- "what we store, and why" → data transparency page (static for MVP, lists what's in the schema)
- "published finances" → placeholder page ("coming when we start charging")
- "your own match profile" → user's actual match profile

#### Manifesto
- Full v3 principles (currently only excerpts)

#### Notifications (email)
- New introduction available
- Someone opened a conversation with you
- New message in conversation
- Closure notification
- Nudge (3-day unanswered)
- Auto-close notification

#### Basic instrumentation
- Introductions per user (distribution, not average)
- Active users, paused users, exited users
- Exits with `found_someone = true` count (the north star)
- Conversations opened, closed, auto-closed
- Simple admin dashboard view for these numbers

**Deliverable:** The full product loop works end-to-end. Every screen shows real data. A user could go from signup to finding someone to exiting.

### MVP-6: Polish + Deploy (week 9-10)

- Mobile responsiveness pass (test on real iPhone/Android)
- Fix visual bugs against the design handoff screenshots
- Loading states and error handling on all mutations
- Rate limiting on auth endpoints
- CSRF protection
- Basic input sanitization
- Seed 5-10 test profiles (or invite real testers)
- Bug fixes from first real usage session

**Deliverable:** Ready to hand to ~10 real people.

---

## API routes / Server Actions

### Auth
- `POST /api/auth/signup` — create account
- `POST /api/auth/login` — email/password login
- `POST /api/auth/logout` — destroy session
- `GET /api/auth/me` — current user

### Onboarding
- Server Actions for each onboarding step (write to respective table)
- `GET /api/profile/me` — full match profile
- `PATCH /api/profile/me` — update profile fields

### Matching
- `GET /api/introductions` — today's introductions for current user
- `POST /api/introductions/:id/action` — open / pass / save
- `POST /api/admin/introductions` — admin: manually create introduction
- `POST /api/admin/run-matching` — admin: trigger matching pipeline

### Conversations
- `GET /api/conversations` — list user's conversations
- `GET /api/conversations/:id/messages` — poll for messages
- `POST /api/conversations/:id/messages` — send message
- `POST /api/conversations/:id/close` — closure flow
- `POST /api/conversations/:id/goodbye` — send goodbye note

### User state
- `POST /api/user/pause` — pause account
- `POST /api/user/resume` — resume
- `POST /api/user/exit` — exit flow

### Admin
- `GET /api/admin/users` — list all users
- `GET /api/admin/stats` — basic metrics
- `GET /api/admin/matching-output` — pipeline results

---

## What's explicitly NOT in MVP

- Identity verification (every user is "verified" by default)
- LLM qualitative scoring (rules-only matching)
- LLM match explanations (templated instead)
- Billing / subscriptions / Stripe (app is free during MVP)
- Drought billing pause (no billing to pause)
- Tiered abuse reporting UI (admin can ban manually)
- Moderation tooling / LLM flagging
- Personality inference questions (onboarding step 7 skipped)
- Cohort density gates / waitlist
- Life signals taxonomy (photos only, no curated set)
- Meeting prompts / voice-video calls
- Published finances dashboard
- Public RFC process
- Data export
- Password reset flow (manual via admin for MVP)

These are all Phase 2+ per `docs/IMPLEMENTATION-ROADMAP.md`.

---

## Success criteria for MVP

The MVP is done when:
1. Two people in different locations can sign up, complete onboarding, and land in the app
2. The matching engine surfaces at least one introduction between compatible users
3. Both users can open the introduction and have a text conversation
4. Closing a conversation produces a closure notification and optional goodbye note
5. The drought screen shows real pool data when no matches clear the floor
6. An admin can manually pair two users and view basic metrics
7. The app is accessible via a public URL

---

*This spec is downstream of MANIFESTO-v3, DESIGN-v3, and PRD-v2. When in doubt, re-read those.*
