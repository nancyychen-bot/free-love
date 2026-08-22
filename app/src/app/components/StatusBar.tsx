'use client';

import { useEffect, useState } from 'react';

export default function StatusBar() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

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
      <span className="type-status-bar" suppressHydrationWarning>{time || ' '}</span>
      <span className="type-status-bar">free love</span>
    </div>
  );
}
