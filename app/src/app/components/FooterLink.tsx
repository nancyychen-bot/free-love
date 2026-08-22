import Link from "next/link";

export default function FooterLink() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "20px 24px",
      }}
    >
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
    </div>
  );
}
