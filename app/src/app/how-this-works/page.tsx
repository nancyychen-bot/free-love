import Link from "next/link";
import StatusBar from "@/app/components/StatusBar";

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

const principles = [
  "We optimize for exits, not engagement. Our north-star metric is successful departures — people who found their person and left.",
  "Nobody's visibility is auctioned. Nobody buys an advantage. Same price for everyone. Billing pauses when we give you nothing.",
  "We collect the minimum, say exactly what we keep, and never monetize who you are.",
  "We will not sort people into desirability tiers. If we surface two people to each other, we can tell them why.",
  "No infinite deck. No variable-reward mechanics. No fixed daily quota that forces filler. Introductions happen when someone genuinely matches.",
  "Profiles reveal how someone lives — not just how they look. Photos are part of the picture, never the first thing you judge.",
  "We design against ghosting and toward kind closure. When something ends, it ends with dignity.",
  "Every person is verified as real. Abusive behavior is met with zero tolerance. Safety is built in, not bolted on.",
  "The matching logic is not a black box. Anyone can read how they are being matched. The code is open source, the formula is published, the explanation is plain language.",
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
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-system)",
            fontSize: 13,
            color: "var(--gray-quiet)",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          &times;
        </Link>
      </div>

      <div style={{ padding: "26px 24px 22px" }}>
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

        {/* ── The principles ─────────────────────────────────── */}
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
            THE NINE LINES WE WILL NOT CROSS
          </div>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
            {principles.map((principle, index) => (
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
                  {principle}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── When principles conflict ───────────────────────── */}
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
            WHEN PRINCIPLES CONFLICT
          </div>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
            <p
              style={{
                fontFamily: "var(--font-system)",
                fontSize: 12.5,
                lineHeight: 1.65,
                color: "var(--ink-true)",
              }}
            >
              Safety beats privacy. When protecting people on the platform requires collecting or acting on information we&rsquo;d otherwise rather not touch, safety wins.
            </p>
            <p
              style={{
                fontFamily: "var(--font-system)",
                fontSize: 12.5,
                lineHeight: 1.65,
                color: "var(--ink-true)",
              }}
            >
              Unequal match frequency is a consequence of refusing to fake matches. Some people receive introductions weekly and some go six weeks without one. We accept this, we measure it, and we show it to you rather than hiding it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
