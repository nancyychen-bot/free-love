import StatusBar from "@/app/components/StatusBar";

const commitments = [
  {
    numeral: "i",
    text: "Non-profit. At cost, finances published, surplus given away.",
  },
  {
    numeral: "ii",
    text: "Verified humans only. Safety is a surface, not a settings page.",
  },
  {
    numeral: "iii",
    text: "Curation at the standard of a matchmaker, at the price of software. Some days that means nobody.",
  },
];

const principles = [
  {
    number: "05",
    statement: "Nothing here is built to keep you checking.",
  },
  {
    number: "06",
    statement:
      "Photos are part of the picture, never the first thing you judge.",
  },
  {
    number: "09",
    statement: "The matching logic is not a black box.",
  },
];

export default function ManifestoPage() {
  return (
    <div
      className="screen"
      style={{ padding: "0 0 40px 0" }}
    >
      <StatusBar />

      <div style={{ padding: "28px 26px 0" }}>
        {/* Eyebrow row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-system)",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              color: "var(--gray-quiet)",
            }}
          >
            WHAT WE WILL NOT DO
          </span>
          <span
            style={{
              fontFamily: "var(--font-system)",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase" as const,
              color: "var(--gray-quiet)",
            }}
          >
            EXCERPTS &middot; V3
          </span>
        </div>

        {/* Lede */}
        <p
          style={{
            fontFamily: "var(--font-human)",
            fontWeight: 300,
            fontSize: 30,
            lineHeight: 1.28,
            color: "var(--ink-human)",
            marginTop: 26,
          }}
        >
          Three commitments, and everything else follows from them.
        </p>

        {/* Three commitments */}
        <div
          style={{
            marginTop: 34,
            display: "flex",
            flexDirection: "column" as const,
            gap: 20,
          }}
        >
          {commitments.map((c) => (
            <div
              key={c.numeral}
              style={{
                display: "flex",
                gap: 14,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-system)",
                  fontSize: 10.5,
                  color: "var(--gray-quiet)",
                  lineHeight: 1.65,
                  minWidth: 16,
                }}
              >
                {c.numeral}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-system)",
                  fontSize: 12.5,
                  lineHeight: 1.65,
                  color: "var(--ink-true)",
                }}
              >
                {c.text}
              </span>
            </div>
          ))}
        </div>

        {/* Hairline */}
        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--rule)",
            marginTop: 40,
          }}
        />

        {/* Three principles */}
        <div
          style={{
            marginTop: 28,
            display: "flex",
            flexDirection: "column" as const,
            gap: 26,
          }}
        >
          {principles.map((p) => (
            <div
              key={p.number}
              style={{
                display: "flex",
                flexDirection: "column" as const,
                gap: 10,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-system)",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "0.16em",
                  color: "var(--gray-quiet)",
                }}
              >
                {p.number}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-human)",
                  fontWeight: 400,
                  fontSize: 22,
                  lineHeight: 1.5,
                  color: "var(--ink-human)",
                  maxWidth: "24ch",
                }}
              >
                {p.statement}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
