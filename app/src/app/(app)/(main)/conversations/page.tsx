import StatusBar from "@/app/components/StatusBar";
import FooterLink from "@/app/components/FooterLink";
import { mockConversations } from "@/lib/mock-data";

export default function ConversationsPage() {
  const { open, max, threads, closed } = mockConversations;

  return (
    <div className="screen" style={{ padding: "0 0 60px 0" }}>
      <StatusBar />

      {/* Header row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 24px 14px",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-system)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase" as const,
            color: "var(--ink-true)",
          }}
        >
          CONVERSATIONS
        </span>
        <span
          style={{
            fontFamily: "var(--font-system)",
            fontSize: 11,
            color: "var(--gray-quiet)",
          }}
        >
          {open} of {max} open
        </span>
      </div>

      {/* Active threads */}
      {threads.map((thread) => (
        <div
          key={thread.name}
          style={{
            padding: "22px 24px",
            borderBottom: "1px solid var(--rule)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            {/* Avatar */}
            <div
              className="avatar-circle"
              style={{
                width: 34,
                height: 34,
                minWidth: 34,
                border: "1px dashed var(--gray-quiet)",
                backgroundColor: "transparent",
                marginTop: 2,
              }}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Name */}
              <div
                style={{
                  fontFamily: "var(--font-system)",
                  fontSize: 12.5,
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: thread.isNew
                    ? "var(--introduction)"
                    : "var(--ink-true)",
                }}
              >
                {thread.name.toUpperCase()}
              </div>

              {/* Timestamp */}
              <div
                style={{
                  fontFamily: "var(--font-system)",
                  fontSize: 10.5,
                  color: thread.isNew ? "#6B6591" : "var(--gray-quiet)",
                  marginTop: 2,
                }}
              >
                {thread.status}
              </div>

              {/* Preview */}
              <div
                style={{
                  fontFamily: "var(--font-human)",
                  fontSize: 16.5,
                  lineHeight: 1.55,
                  color: "var(--ink-human)",
                  marginTop: 8,
                }}
              >
                {thread.preview}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Open slot */}
      <div
        style={{
          padding: "22px 24px",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-system)",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase" as const,
            color: "var(--gray-quiet)",
          }}
        >
          ONE SLOT OPEN
        </div>
        <div
          style={{
            fontFamily: "var(--font-system)",
            fontSize: 12,
            lineHeight: 1.65,
            color: "var(--gray-quiet)",
            marginTop: 6,
          }}
        >
          Nobody is queued for it.
        </div>
      </div>

      {/* Closed threads */}
      {closed.map((thread) => (
        <div
          key={thread.name}
          style={{
            padding: "22px 24px",
            borderBottom: "1px solid var(--rule)",
          }}
        >
          {/* Closed eyebrow */}
          <div
            style={{
              fontFamily: "var(--font-system)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase" as const,
              color: "var(--gray-quiet)",
              marginBottom: 10,
            }}
          >
            CLOSED &middot; {thread.closedDate.toUpperCase()}
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            {/* Avatar */}
            <div
              className="avatar-circle"
              style={{
                width: 34,
                height: 34,
                minWidth: 34,
                border: "1px dashed var(--gray-quiet)",
                backgroundColor: "transparent",
                marginTop: 2,
              }}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Name */}
              <div
                style={{
                  fontFamily: "var(--font-system)",
                  fontSize: 12.5,
                  fontWeight: 500,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color: "var(--gray-quiet)",
                }}
              >
                {thread.name.toUpperCase()}
              </div>

              {/* Status */}
              <div
                style={{
                  fontFamily: "var(--font-system)",
                  fontSize: 10.5,
                  color: "var(--gray-quiet)",
                  marginTop: 2,
                }}
              >
                she sent a goodbye note
              </div>

              {/* Goodbye note */}
              <div
                style={{
                  fontFamily: "var(--font-human)",
                  fontSize: 16,
                  lineHeight: 1.55,
                  color: "var(--ink-human)",
                  marginTop: 8,
                }}
              >
                {thread.note}
              </div>
            </div>
          </div>
        </div>
      ))}

      <FooterLink />
    </div>
  );
}
