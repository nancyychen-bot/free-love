import Link from "next/link";
import StatusBar from "@/app/components/StatusBar";

const dataRows = [
  { what: "email address", why: "login, notifications", who: "only you and us" },
  { what: "password hash", why: "authentication", who: "never stored in plain text" },
  { what: "display name, age", why: "shown on your public profile", who: "your matches" },
  { what: "gender, orientation, seeking", why: "hard filter — who you see and who sees you", who: "never shown to matches" },
  { what: "location (city-level)", why: "radius matching", who: "shown as neighborhood + distance" },
  { what: "life basics answers", why: "soft matching + dealbreaker filtering", who: "never shown to matches" },
  { what: "dealbreaker flags", why: "absolute filters — we never match you across a hard line", who: "never shown to matches" },
  { what: "ranked qualities (4)", why: "matching weight — rank order matters", who: "never shown to matches" },
  { what: "ranked values (5)", why: "matching weight — rank order matters", who: "never shown to matches" },
  { what: "life-question answers (3)", why: "qualitative matching + your public profile", who: "your matches" },
  { what: "photos (face + body)", why: "your public profile", who: "your matches" },
  { what: "messages", why: "your conversations", who: "you and the other person" },
  { what: "match scores", why: "the explanation you see on every introduction", who: "shown as explanation, never as a number ranking you" },
];

export default function DataPage() {
  return (
    <div className="screen" style={{ padding: "0 0 40px 0" }}>
      <StatusBar />

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
          WHAT WE STORE, AND WHY
        </span>
        <Link href="/how-this-works" style={{ fontFamily: "var(--font-system)", fontSize: 13, color: "var(--gray-quiet)" }}>
          &times;
        </Link>
      </div>

      <div style={{ padding: "26px 24px 22px" }}>
        <p style={{ fontFamily: "var(--font-system)", fontSize: 12.5, lineHeight: 1.65, color: "var(--ink-true)", marginBottom: 24 }}>
          This is everything. No third-party trackers, no ad SDKs, no data sales. You can read and edit your match profile at any time.
        </p>

        {dataRows.map((row, index) => (
          <div
            key={row.what}
            style={{
              padding: "14px 0",
              borderTop: "1px solid var(--rule)",
              borderBottom: index === dataRows.length - 1 ? "1px solid var(--rule)" : "none",
            }}
          >
            <div style={{ fontFamily: "var(--font-system)", fontSize: 12.5, color: "var(--ink-true)", marginBottom: 4 }}>
              {row.what}
            </div>
            <div style={{ fontFamily: "var(--font-system)", fontSize: 11, color: "var(--gray-quiet)", lineHeight: 1.5 }}>
              {row.why} — {row.who}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
