import { db } from '@/lib/db';
import { conversations, messages, profiles, lifeSignals } from '@/lib/db/schema';
import { getUser } from '@/lib/auth/get-user';
import { eq, or, and, asc } from 'drizzle-orm';
import { redirect, notFound } from 'next/navigation';
import ChatClient from './chat-client';

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();
  if (!user) redirect('/login');

  const { id } = await params;

  // Fetch conversation and verify user is part of it
  const [convo] = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.id, id),
        or(
          eq(conversations.userAId, user.id),
          eq(conversations.userBId, user.id)
        )
      )
    )
    .limit(1);

  if (!convo) notFound();

  // Get the other person's profile
  const otherUserId =
    convo.userAId === user.id ? convo.userBId : convo.userAId;

  const [otherProfile] = await db
    .select({
      displayName: profiles.displayName,
      id: profiles.id,
    })
    .from(profiles)
    .where(eq(profiles.userId, otherUserId))
    .limit(1);

  // Get other person's photo
  let otherPhoto: string | null = null;
  if (otherProfile) {
    const [sig] = await db
      .select({ url: lifeSignals.photoUrl })
      .from(lifeSignals)
      .where(eq(lifeSignals.profileId, otherProfile.id))
      .limit(1);
    otherPhoto = sig?.url ?? null;
  }

  // Fetch all messages ordered by creation time
  const allMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(asc(messages.createdAt));

  const serializedMessages = allMessages.map((m) => ({
    id: m.id,
    senderId: m.senderId,
    body: m.body,
    createdAt: m.createdAt.toISOString(),
  }));

  return (
    <ChatClient
      conversationId={id}
      currentUserId={user.id}
      otherUserId={otherUserId}
      otherName={otherProfile?.displayName || 'Someone'}
      otherPhoto={otherPhoto}
      initialMessages={serializedMessages}
    />
  );
}
