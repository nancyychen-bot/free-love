import { db } from '@/lib/db';
import { users, profiles, conversations } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq, or } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import AdminClient from './admin-client';

export default async function AdminPage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (!user.isAdmin) redirect('/home');

  // Fetch all users with profiles
  const allUsers = await db
    .select({
      id: users.id,
      email: users.email,
      isAdmin: users.isAdmin,
      onboardingComplete: users.onboardingComplete,
    })
    .from(users);

  const userData = await Promise.all(
    allUsers.map(async (u) => {
      const [profile] = await db
        .select({ displayName: profiles.displayName })
        .from(profiles)
        .where(eq(profiles.userId, u.id))
        .limit(1);

      const convos = await db
        .select({ id: conversations.id })
        .from(conversations)
        .where(
          or(eq(conversations.userAId, u.id), eq(conversations.userBId, u.id))
        );

      return {
        id: u.id,
        email: u.email,
        displayName: profile?.displayName || null,
        isAdmin: u.isAdmin,
        onboardingComplete: u.onboardingComplete,
        conversationCount: convos.length,
      };
    })
  );

  return <AdminClient users={userData} />;
}
