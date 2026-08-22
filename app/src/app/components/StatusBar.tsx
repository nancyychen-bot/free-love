'use client';

export default function StatusBar() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 14,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 0,
      }}
    >
      <span className="type-status-bar">{time}</span>
      <span className="type-status-bar">free love</span>
    </div>
  );
}
