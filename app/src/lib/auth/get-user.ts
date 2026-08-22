import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getSessionUserId } from "./session";

export type AuthUser = {
  id: string;
  email: string;
  isAdmin: boolean;
  onboardingComplete: boolean;
  onboardingStep: number;
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
      onboardingStep: users.onboardingStep,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return rows[0] ?? null;
}
