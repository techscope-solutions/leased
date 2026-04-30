'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

const MIN = 28, MAX = 64, BASE = 41;
const STORAGE_KEY = 'leased_live_v1';

function loadCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const { count, ts } = JSON.parse(raw);
      const elapsed = Math.min(Math.floor((Date.now() - ts) / 1000), 90);
      let c = Math.max(MIN, Math.min(MAX, count));
      for (let i = 0; i < elapsed; i++) c = step(c);
      return c;
    }
  } catch { /* ignore */ }
  return BASE;
}

function step(c: number): number {
  const r = Math.random();
  let delta: number;
  if (r < 0.04) delta = -3;
  else if (r < 0.10) delta = -2;
  else if (r < 0.42) delta = -1;
  else if (r < 0.74) delta = 1;
  else if (r < 0.93) delta = 2;
  else delta = 3;
  if (c + delta > MAX) delta = -1;
  if (c + delta < MIN) delta = 1;
  return c + delta;
}

function saveCount(count: number) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ count, ts: Date.now() })); } catch { /* ignore */ }
}

function useLiveCount() {
  const [count, setCount] = useState<number | null>(null);
  const countRef = useRef(BASE);
  useEffect(() => {
    const initial = loadCount();
    countRef.current = initial;
    setCount(initial);
    saveCount(initial);
    const id = setInterval(() => {
      countRef.current = step(countRef.current);
      setCount(countRef.current);
      saveCount(countRef.current);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}

const NAV_LINKS = [
  { label: 'MARKETPLACE', href: '/browse' },
  { label: 'BROKERS',     href: '/brokers' },
  { label: 'DEALERSHIPS', href: '/dealerships' },
];

export default function Nav() {
  const path = usePathname();
  const liveCount = useLiveCount();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [path]);

  const linkStyle = (href: string) => ({
    fontFamily: 'var(--font-barlow-cond)',
    fontWeight: 600,
    fontSize: 13,
    letterSpacing: '0.08em',
    color: path === href ? '#fff' : 'rgba(255,255,255,0.45)',
    textDecoration: 'none',
    transition: 'color 0.2s',
  });

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100, height: 52,
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(8,8,8,0.9)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px',
    }}>

      {/* Left: logo + desktop links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 900, fontSize: 20, letterSpacing: '-0.01em', color: '#fff' }}>LEASE</span>
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 900, fontSize: 20, letterSpacing: '-0.01em', color: '#FF2800' }}>D</span>
        </Link>

        {/* Desktop nav links */}
        <div className="r-nav-links">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href} style={linkStyle(href)}>{label}</Link>
          ))}
        </div>
      </div>

      {/* Right: live count + log in + hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF2800', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', fontVariantNumeric: 'tabular-nums', minWidth: 28, display: 'inline-block' }}>
            {liveCount ?? BASE} LIVE
          </span>
        </div>

        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />

        {/* Desktop LOG IN */}
        <button
          className="r-nav-links"
          style={{ padding: '6px 18px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, background: 'transparent', color: '#fff', fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', cursor: 'pointer' }}
        >
          LOG IN
        </button>

        {/* Mobile hamburger */}
        <button
          className="r-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2 L16 16" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 2 L2 16" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <rect y="0" width="20" height="2" rx="1" fill="rgba(255,255,255,0.85)"/>
              <rect y="6" width="20" height="2" rx="1" fill="rgba(255,255,255,0.85)"/>
              <rect y="12" width="20" height="2" rx="1" fill="rgba(255,255,255,0.85)"/>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      <div className={`r-mobile-menu${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            style={{
              ...linkStyle(href),
              padding: '14px 4px',
              fontSize: 15,
              letterSpacing: '0.1em',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {label}
          </Link>
        ))}
        <button style={{ marginTop: 16, padding: '12px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, background: 'transparent', color: '#fff', fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', cursor: 'pointer', width: '100%' }}>
          LOG IN
        </button>
      </div>
    </nav>
  );
}
