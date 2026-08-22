import Link from "next/link";
import StatusBar from "@/app/components/StatusBar";
import BackButton from "@/app/components/BackButton";

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
    number: "01",
    statement: "We optimize for exits, not engagement.",
    body: "Our north-star metric is successful departures. We measure them, publish them, celebrate them. We will never measure time in app as a goal.",
  },
  {
    number: "02",
    statement: "No pay-to-win. Ever.",
    body: "Nobody’s visibility is auctioned. Nobody buys an advantage. Billing pauses automatically during droughts — if we haven’t introduced you to anyone, we don’t charge you. Any surplus is donated, not retained.",
  },
  {
    number: "03",
    statement: "No selling data. No ad targeting. No surveillance.",
    body: "We collect the minimum, say exactly what we keep, and never monetize who you are. This is an ethic and a moat — the one thing they cannot copy without dismantling their business.",
  },
  {
    number: "04",
    statement: "No secret ranking.",
    body: "We will not sort people into desirability tiers. Matching is open source and explainable. If we surface two people to each other, we can tell them why.",
  },
  {
    number: "05",
    statement: "Nothing here is built to keep you checking.",
    body: "No infinite deck. No variable-reward mechanics. No fixed daily quota that forces filler. Introductions happen when someone genuinely matches — not on a schedule.",
  },
  {
    number: "06",
    statement: "Photos are part of the picture, never the first thing you judge.",
    body: "Profiles reveal how someone lives — their music, their spaces, what they’re reading, where they feel at home. Photos are present, never the whole picture.",
  },
  {
    number: "07",
    statement: "Accountability over disposability.",
    body: "We design against ghosting and toward kind closure. No juggling dozens of half-alive threads. When something ends, it ends with dignity.",
  },
  {
    number: "08",
    statement: "Safety is a product, not a settings page.",
    body: "Every person is verified as real. Abusive behavior is met with zero tolerance. We will never ask someone — especially women — to adjust their settings to feel safe.",
  },
  {
    number: "09",
    statement: "The matching logic is not a black box.",
    body: "Anyone can read how they are being matched. The code is public. The formula is published. In this category, that is radical, and it is our credibility.",
  },
];

export default function ManifestoPage() {
  return (
    <div className="screen" style={{ padding: "0 0 60px 0" }}>
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
            V3
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
            <div key={c.numeral} style={{ display: "flex", gap: 14 }}>
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
        <hr style={{ border: "none", borderTop: "1px solid var(--rule)", marginTop: 40 }} />

        {/* All nine principles */}
        <div
          style={{
            marginTop: 28,
            display: "flex",
            flexDirection: "column" as const,
            gap: 32,
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
              <span
                style={{
                  fontFamily: "var(--font-system)",
                  fontSize: 12.5,
                  lineHeight: 1.65,
                  color: "var(--gray-quiet)",
                  marginTop: 2,
                }}
              >
                {p.body}
              </span>
            </div>
          ))}
        </div>

        {/* When principles conflict */}
        <hr style={{ border: "none", borderTop: "1px solid var(--rule)", marginTop: 40 }} />

        <div style={{ marginTop: 28 }}>
          <span
            style={{
              fontFamily: "var(--font-system)",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.16em",
              textTransform: "uppercase" as const,
              color: "var(--gray-quiet)",
            }}
          >
            WHEN PRINCIPLES CONFLICT
          </span>

          <p
            style={{
              fontFamily: "var(--font-human)",
              fontWeight: 400,
              fontSize: 22,
              lineHeight: 1.5,
              color: "var(--ink-human)",
              maxWidth: "24ch",
              marginTop: 10,
            }}
          >
            Safety beats privacy.
          </p>
          <p
            style={{
              fontFamily: "var(--font-system)",
              fontSize: 12.5,
              lineHeight: 1.65,
              color: "var(--gray-quiet)",
              marginTop: 10,
            }}
          >
            When protecting people on the platform requires collecting or acting on information we&rsquo;d otherwise rather not touch, safety wins. We won&rsquo;t pretend we can have absolute privacy and absolute safety. We chose.
          </p>

          <p
            style={{
              fontFamily: "var(--font-human)",
              fontWeight: 400,
              fontSize: 22,
              lineHeight: 1.5,
              color: "var(--ink-human)",
              maxWidth: "24ch",
              marginTop: 28,
            }}
          >
            Unequal match frequency is the cost of honesty.
          </p>
          <p
            style={{
              fontFamily: "var(--font-system)",
              fontSize: 12.5,
              lineHeight: 1.65,
              color: "var(--gray-quiet)",
              marginTop: 10,
            }}
          >
            A quality threshold means some people receive introductions weekly and some go six weeks without one. We accept this, we measure it, and we show it to you rather than hiding it. We will never pad a drought with filler matches to make the distribution look equal.
          </p>
        </div>

        {/* Footer */}
        <hr style={{ border: "none", borderTop: "1px solid var(--rule)", marginTop: 40 }} />
        <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
          <Link
            href="/how-this-works"
            style={{
              fontFamily: "var(--font-system)",
              fontSize: 11,
              color: "var(--gray-quiet)",
            }}
          >
            how this works
          </Link>
          <BackButton />
        </div>
      </div>
    </div>
  );
}
