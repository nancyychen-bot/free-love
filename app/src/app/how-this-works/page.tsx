import Link from "next/link";
import StatusBar from "@/app/components/StatusBar";
import BackButton from "@/app/components/BackButton";

const receipts = [
  { label: "the matching source code", href: "https://github.com/nancyychen-bot/free-love" },
  { label: "what we store, and why", href: "/how-this-works/data" },
  { label: "published finances", href: "/how-this-works/finances" },
];

const steps = [
  "Hard filters. Your dealbreakers, in both directions. If you said kids are a hard line, nobody who said otherwise will ever appear.",
  "Your ranked values, weighted in the order you put them. A shared first-rank value counts far more than a shared fourth.",
  "Your ranked qualities, same logic. The system scores overlap and penalizes misalignment proportionally to rank.",
  "A small model reads both sets of life answers and scores the meaning overlap. It sees the pair, and nothing else — never the full pool, never your history, never your photos.",
  "The scores combine by a published formula. Rules-based structure plus qualitative meaning, each weighted, each auditable.",
  "Below your floor, nothing surfaces. There is no best available today. We'd rather give you nothing than give you filler.",
  "The same model writes the explanation, for both of you. If it can't explain the match in plain language, the match doesn't ship.",
];

const mechanics = [
  { label: "introductions per day", value: "three, at most" },
  { label: "conversations at once", value: "three" },
  { label: "introduction expires after", value: "five days" },
  { label: "unanswered message nudge", value: "three days" },
  { label: "unanswered auto-close", value: "five days" },
  { label: "inactivity auto-pause", value: "thirty days" },
  { label: "billing pause trigger", value: "twenty-one days with zero introductions" },
];


export default function HowThisWorksPage() {
  return (
    <div className="screen" style={{ padding: "0 0 40px 0" }}>
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
          HOW THIS WORKS
        </span>
        <BackButton />
      </div>

      <div style={{ padding: "26px 24px 22px" }}>
        {/* ── Intro ────────────────────────────────────────── */}
        <p
          style={{
            fontFamily: "var(--font-human)",
            fontWeight: 300,
            fontSize: 22,
            lineHeight: 1.35,
            color: "var(--ink-human)",
            marginBottom: 14,
          }}
        >
          A matchmaker who works for you, not against you.
        </p>
        <p
          style={{
            fontFamily: "var(--font-system)",
            fontSize: 12.5,
            lineHeight: 1.7,
            color: "var(--gray-quiet)",
            marginBottom: 28,
          }}
        >
          Free Love is a non-profit dating app. We use what you told us about yourself — your values, your dealbreakers, what you wrote in your own words — to introduce you to someone worth meeting. We charge at cost, publish our finances, and the code that matches you is open source. If we can not find someone who clears your bar, we give you nothing rather than filler.
        </p>

        {/* ── Receipts ──────────────────────────────────────── */}
        <div
          style={{
            fontFamily: "var(--font-system)",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase" as const,
            color: "var(--ink-true)",
            marginBottom: 12,
          }}
        >
          RECEIPTS
        </div>

        <div>
          {receipts.map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 0",
                borderTop: "1px solid var(--rule)",
                borderBottom:
                  index === receipts.length - 1
                    ? "1px solid var(--rule)"
                    : "none",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-system)",
                  fontSize: 12.5,
                  color: "var(--ink-true)",
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-system)",
                  fontSize: 12.5,
                  color: "var(--gray-quiet)",
                }}
              >
                ›
              </span>
            </Link>
          ))}
        </div>

        {/* ── How an introduction is made ────────────────────── */}
        <div style={{ marginTop: 30 }}>
          <div
            style={{
              fontFamily: "var(--font-system)",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase" as const,
              color: "var(--ink-true)",
              marginBottom: 14,
            }}
          >
            HOW AN INTRODUCTION IS MADE
          </div>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
            {steps.map((step, index) => (
              <div key={index} style={{ display: "flex", gap: 14 }}>
                <span
                  style={{
                    fontFamily: "var(--font-system)",
                    fontSize: 11,
                    color: "var(--gray-quiet)",
                    width: 20,
                    minWidth: 20,
                    lineHeight: 1.65,
                    textAlign: "right" as const,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-system)",
                    fontSize: 12.5,
                    lineHeight: 1.65,
                    color: "var(--ink-true)",
                  }}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── The mechanics ──────────────────────────────────── */}
        <div style={{ marginTop: 30 }}>
          <div
            style={{
              fontFamily: "var(--font-system)",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase" as const,
              color: "var(--ink-true)",
              marginBottom: 12,
            }}
          >
            THE MECHANICS
          </div>

          <div>
            {mechanics.map((row, index) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  padding: "13px 0",
                  borderTop: "1px solid var(--rule)",
                  borderBottom:
                    index === mechanics.length - 1
                      ? "1px solid var(--rule)"
                      : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-system)",
                    fontSize: 12,
                    color: "var(--gray-quiet)",
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-system)",
                    fontSize: 12,
                    color: "var(--ink-true)",
                    textAlign: "right" as const,
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
