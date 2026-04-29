'use client';

import { useState, useEffect } from 'react';

function getTimeLeft(expiresAt: Date) {
  const diff = expiresAt.getTime() - Date.now();
  if (diff <= 0) return { h: 0, m: 0, s: 0, urgent: true };
  const totalSecs = Math.floor(diff / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return { h, m, s, urgent: diff < 3 * 3600 * 1000 }; // urgent if < 3 hours
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export default function CountdownTimer({ expiresAt }: { expiresAt: Date }) {
  const [time, setTime] = useState(() => getTimeLeft(expiresAt));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(expiresAt)), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const color = time.urgent ? '#FF2800' : 'rgba(255,255,255,0.65)';

  return (
    <span style={{
      fontFamily: 'var(--font-barlow-cond)',
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: '0.04em',
      color,
      fontVariantNumeric: 'tabular-nums',
    }}>
      {pad(time.h)} : {pad(time.m)} : {pad(time.s)}
    </span>
  );
}
