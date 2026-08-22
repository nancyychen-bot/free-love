import Link from "next/link";
import StatusBar from "@/app/components/StatusBar";

const receipts = [
  "the matching source code",
  "what we store, and why",
  "published finances",
  "your own match profile",
];

const steps = [
  "Hard filters. Your dealbreakers, in both directions.",
  "Your ranked values, weighted in the order you put them.",
  "A small model reads both sets of life answers and scores the overlap. It sees the pair, and nothing else.",
  "The scores combine by a published formula.",
  "Below your floor, nothing surfaces. There is no best available today.",
  "The same model writes the explanation, for both of you.",
];

const restOfIt = [
  { label: "introductions per day", value: "three, at most" },
  { label: "conversations at once", value: "three" },
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
          href="/introduction"
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
        {/* Receipts section */}
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
            <div
              key={item}
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
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-system)",
                  fontSize: 12.5,
                  color: "var(--ink-true)",
                }}
              >
                {item}
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
            </div>
          ))}
        </div>

        {/* How an introduction is made */}
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

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
            {steps.map((step, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: 14,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-system)",
                    fontSize: 11,
                    color: "var(--gray-quiet)",
                    width: 16,
                    minWidth: 16,
                    lineHeight: 1.65,
                  }}
                >
                  {index + 1}
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

        {/* The rest of it */}
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
            THE REST OF IT
          </div>

          <div>
            {restOfIt.map((row, index) => (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 0",
                  borderTop: "1px solid var(--rule)",
                  borderBottom:
                    index === restOfIt.length - 1
                      ? "1px solid var(--rule)"
                      : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-system)",
                    fontSize: 12.5,
                    color: "var(--ink-true)",
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-system)",
                    fontSize: 12.5,
                    color: "var(--ink-true)",
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
