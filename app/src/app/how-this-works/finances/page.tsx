import Link from "next/link";
import StatusBar from "@/app/components/StatusBar";

export default function FinancesPage() {
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
          PUBLISHED FINANCES
        </span>
        <Link href="/how-this-works" style={{ fontFamily: "var(--font-system)", fontSize: 13, color: "var(--gray-quiet)" }}>
          &times;
        </Link>
      </div>

      <div style={{ padding: "96px 24px 22px" }}>
        <p
          style={{
            fontFamily: "var(--font-system)",
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase" as const,
            color: "var(--ink-true)",
          }}
        >
          NOT YET
        </p>
        <p style={{ fontFamily: "var(--font-system)", fontSize: 13.5, lineHeight: 1.7, color: "var(--ink-true)", marginTop: 16, maxWidth: "46ch" }}>
          We publish quarterly finances once we start charging. Every dollar in, every dollar out, where the surplus goes.
        </p>
        <p style={{ fontFamily: "var(--font-system)", fontSize: 13.5, lineHeight: 1.7, color: "var(--gray-quiet)", marginTop: 16, maxWidth: "46ch" }}>
          The app is free during this phase. When we charge, the number will be honest and the math will be here.
        </p>
      </div>
    </div>
  );
}
