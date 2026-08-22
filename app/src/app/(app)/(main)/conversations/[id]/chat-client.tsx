'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import BackButton from '@/app/components/BackButton';
import StatusBar from '@/app/components/StatusBar';

type Message = {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function ChatClient({
  conversationId,
  currentUserId,
  otherUserId,
  otherName,
  otherPhoto,
  initialMessages,
}: {
  conversationId: string;
  currentUserId: string;
  otherUserId: string;
  otherName: string;
  otherPhoto: string | null;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/conversations/${conversationId}/messages`);
        if (res.ok) {
          const data = await res.json();
          const fetched = data.messages.map((m: { id: string; senderId: string; body: string; createdAt: string }) => ({
            id: m.id,
            senderId: m.senderId,
            body: m.body,
            createdAt: typeof m.createdAt === 'string' ? m.createdAt : new Date(m.createdAt).toISOString(),
          }));
          setMessages(fetched);
        }
      } catch {
        // silent retry next interval
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [conversationId]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);

    // Optimistically add the message
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      senderId: currentUserId,
      body: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setText('');

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });

      if (res.ok) {
        const data = await res.json();
        // Replace optimistic message with real one
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticMsg.id
              ? {
                  id: data.message.id,
                  senderId: data.message.senderId,
                  body: data.message.body,
                  createdAt: typeof data.message.createdAt === 'string'
                    ? data.message.createdAt
                    : new Date(data.message.createdAt).toISOString(),
                }
              : m
          )
        );
      }
    } catch {
      // keep the optimistic message visible
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="screen" style={{ padding: '0 0 0 0' }}>
      <StatusBar />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px 14px',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        <Link href={`/profile/${otherUserId}`} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          {otherPhoto ? (
            <div
              className="avatar-circle"
              style={{ width: 28, height: 28, minWidth: 28, overflow: 'hidden' }}
            >
              <img
                src={otherPhoto}
                alt={otherName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '9999px',
                }}
              />
            </div>
          ) : (
            <div
              className="avatar-circle"
              style={{
                width: 28,
                height: 28,
                minWidth: 28,
                border: '1px dashed var(--gray-quiet)',
              }}
            />
          )}
          <span
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--ink-true)',
            }}
          >
            {otherName}
          </span>
        </Link>
        <BackButton href="/home" />
      </div>

      {/* Messages */}
      <div style={{ padding: '16px 24px 120px' }}>
        {messages.length === 0 && (
          <p
            style={{
              fontFamily: 'var(--font-human)',
              fontSize: 16,
              lineHeight: 1.55,
              color: 'var(--gray-quiet)',
              marginTop: 20,
            }}
          >
            Start the conversation. Say something real.
          </p>
        )}

        <div style={{ display: 'grid', gap: 12 }}>
          {messages.map((msg, i) => {
            const isMe = msg.senderId === currentUserId;
            const prevMsg = i > 0 ? messages[i - 1] : null;
            const showSender = !prevMsg || prevMsg.senderId !== msg.senderId;

            return (
              <div key={msg.id}>
                {showSender && (
                  <div
                    style={{
                      fontFamily: 'var(--font-system)',
                      fontSize: 10,
                      fontWeight: 500,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--gray-quiet)',
                      marginBottom: 6,
                      marginTop: i > 0 ? 8 : 0,
                    }}
                  >
                    {isMe ? 'you' : otherName}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: isMe
                      ? 'var(--font-system)'
                      : 'var(--font-human)',
                    fontSize: isMe ? 13.5 : 16,
                    lineHeight: isMe ? 1.6 : 1.55,
                    color: isMe ? 'var(--ink-true)' : 'var(--ink-human)',
                    borderLeft: isMe
                      ? '2px solid var(--rule)'
                      : 'none',
                    paddingLeft: isMe ? 12 : 0,
                  }}
                >
                  {msg.body}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-system)',
                    fontSize: 10,
                    color: 'var(--gray-quiet)',
                    marginTop: 4,
                    paddingLeft: isMe ? 14 : 0,
                  }}
                >
                  {formatTime(msg.createdAt)}
                </div>
              </div>
            );
          })}
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: 390,
          margin: '0 auto',
          background: 'var(--paper)',
          borderTop: '1px solid var(--rule)',
          padding: '12px 24px 24px',
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="write a message..."
            style={{
              flex: 1,
              fontFamily: 'var(--font-system)',
              fontSize: 13.5,
              color: 'var(--ink-true)',
              border: '1px solid var(--rule)',
              padding: 13,
              background: 'var(--paper)',
              outline: 'none',
            }}
          />
          <button
            onClick={handleSend}
            disabled={sending || !text.trim()}
            style={{
              fontFamily: 'var(--font-system)',
              fontSize: 13.5,
              fontWeight: 500,
              color:
                sending || !text.trim()
                  ? 'var(--gray-quiet)'
                  : 'var(--ink-true)',
              background: 'none',
              border: '1px solid var(--rule)',
              padding: '13px 16px',
              cursor:
                sending || !text.trim() ? 'default' : 'pointer',
            }}
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
}
