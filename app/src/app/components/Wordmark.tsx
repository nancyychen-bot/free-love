interface WordmarkProps {
  size?: number;
}

export default function Wordmark({ size = 21 }: WordmarkProps) {
  return (
    <span
      style={{
        fontFamily: "var(--font-system)",
        fontSize: size,
        letterSpacing: "0.1em",
        color: "var(--ink-true)",
      }}
    >
      free love
      <span style={{ color: "var(--introduction)" }}>.</span>
    </span>
  );
}
