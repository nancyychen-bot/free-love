"use client";

import { useState } from "react";
import StatusBar from "@/app/components/StatusBar";
import FooterLink from "@/app/components/FooterLink";
import { mockDealbreaker } from "@/lib/mock-data";

export default function DealbreakerPage() {
  const [selected, setSelected] = useState(mockDealbreaker.selected);
  const [isHardLine, setIsHardLine] = useState(mockDealbreaker.isHardLine);

  return (
    <div className="screen" style={{ padding: "0 0 60px 0" }}>
      <StatusBar />

      <div style={{ padding: "40px 24px 0" }}>
        {/* Step row */}
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
              letterSpacing: "0.16em",
              textTransform: "uppercase" as const,
              color: "var(--gray-quiet)",
            }}
          >
            STEP {mockDealbreaker.step} OF {mockDealbreaker.totalSteps}
          </span>
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
            PRIVATE
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-system)",
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "0.14em",
            textTransform: "uppercase" as const,
            color: "var(--ink-true)",
            marginTop: 30,
          }}
        >
          KIDS
        </h1>

        {/* Options */}
        <div style={{ marginTop: 30 }}>
          {mockDealbreaker.options.map((option, index) => {
            const isSelected = selected === option;
            const isLast = index === mockDealbreaker.options.length - 1;

            return (
              <div
                key={option}
                onClick={() => setSelected(option)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "15px 0",
                  borderTop: "1px solid var(--rule)",
                  borderBottom: isLast ? "1px solid var(--rule)" : "none",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-system)",
                    fontSize: 15,
                    color: isSelected
                      ? "var(--ink-true)"
                      : "var(--gray-quiet)",
                  }}
                >
                  {option}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-system)",
                    fontSize: isSelected ? 11 : 15,
                    color: isSelected
                      ? "var(--ink-true)"
                      : "var(--gray-quiet)",
                  }}
                >
                  {isSelected ? "selected" : "—"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Hard line checkbox */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 30,
            cursor: "pointer",
          }}
          onClick={() => setIsHardLine(!isHardLine)}
        >
          <div
            style={{
              width: 15,
              height: 15,
              minWidth: 15,
              border: "1px solid var(--ink-true)",
              backgroundColor: isHardLine
                ? "var(--ink-true)"
                : "transparent",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-system)",
              fontSize: 15,
              color: "var(--ink-true)",
            }}
          >
            this is a hard line
          </span>
        </div>

        {/* Cost readout */}
        <p
          style={{
            fontFamily: "var(--font-system)",
            fontSize: 12.5,
            lineHeight: 1.7,
            color: "var(--ink-true)",
            marginTop: 30,
          }}
        >
          Flagged, this becomes an absolute filter in both directions. It
          excludes about {mockDealbreaker.excludePct}% of the{" "}
          {mockDealbreaker.poolSize} people currently inside your other filters.
        </p>

        {/* Consequence note */}
        <p
          style={{
            fontFamily: "var(--font-system)",
            fontSize: 12.5,
            lineHeight: 1.7,
            color: "var(--gray-quiet)",
            marginTop: 16,
          }}
        >
          Unflagged, it still counts — as weight, not as a wall. Dealbreakers
          are the fastest route to a long drought. You can change this whenever
          you like.
        </p>

        {/* Footer button */}
        <button
          style={{
            width: "100%",
            border: "1px solid var(--ink-true)",
            background: "transparent",
            fontFamily: "var(--font-system)",
            fontSize: 14,
            color: "var(--ink-true)",
            padding: "14px 0",
            cursor: "pointer",
            marginTop: 30,
            transition: "background-color 0.15s ease, color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--ink-true)";
            e.currentTarget.style.color = "var(--paper)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--ink-true)";
          }}
        >
          keep it as a hard line
        </button>
      </div>

      <FooterLink />
    </div>
  );
}
