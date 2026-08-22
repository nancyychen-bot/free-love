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

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  onboardingComplete: boolean("onboarding_complete").default(false).notNull(),
  onboardingStep: integer("onboarding_step").default(1).notNull(),
  pledgeSignedAt: timestamp("pledge_signed_at", { withTimezone: true }),
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
