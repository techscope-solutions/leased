'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

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

const BOTTOM_TABS = [
  {
    label: 'HOME', href: '/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 9L10 3L17 9V17H13V12H7V17H3V9Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'MARKET', href: '/browse',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor"/>
        <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor"/>
        <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor"/>
        <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'BROKERS', href: '/brokers',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="6" r="3.5" fill="currentColor"/>
        <path d="M3 18C3 14.5 6.1 11.5 10 11.5C13.9 11.5 17 14.5 17 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'DEALERS', href: '/dealerships',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="7" width="16" height="11" rx="1" fill="currentColor" opacity="0.7"/>
        <rect x="1" y="5" width="18" height="4" rx="1" fill="currentColor"/>
        <rect x="7" y="12" width="3" height="6" fill="#080808"/>
        <rect x="10" y="12" width="3" height="6" fill="#080808"/>
      </svg>
    ),
  },
];

export default function Nav({ light = false }: { light?: boolean }) {
  const path = usePathname();
  const router = useRouter();
  const liveCount = useLiveCount();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles').select('role').eq('id', data.user.id).single();
        setRole(profile?.role ?? null);
      } else {
        setRole(null);
      }
    }

    loadUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.from('profiles').select('role').eq('id', session.user.id).single()
          .then(({ data: profile }) => setRole(profile?.role ?? null));
      } else {
        setRole(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const dashHref = role === 'moderator' ? '/admin' : role === 'seller' ? '/seller/dashboard' : null;
  const dashLabel = role === 'moderator' ? 'ADMIN' : 'DASHBOARD';

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const ink = light ? '#0a0a0a' : '#ffffff';
  const inkMuted = light ? 'rgba(10,10,10,0.56)' : 'rgba(255,255,255,0.45)';
  const navBg = light ? 'rgba(247,245,242,0.88)' : 'rgba(8,8,8,0.9)';
  const borderColor = light ? 'rgba(10,10,10,0.08)' : 'rgba(255,255,255,0.07)';
  const accent = light ? 'oklch(0.55 0.22 18)' : '#FF2800';
  const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif';

  const linkStyle = (href: string) => ({
    fontFamily: light ? SF : 'var(--font-barlow-cond)',
    fontWeight: light ? 500 : 600,
    fontSize: 14,
    letterSpacing: light ? '-0.01em' : '0.08em',
    color: path === href ? ink : inkMuted,
    textDecoration: 'none',
    transition: 'color 0.2s',
  });

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100, height: light ? 'auto' : 52,
        borderBottom: `1px solid ${borderColor}`,
        background: navBg,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: light ? '14px 24px' : '0 24px',
      }}>

        {/* Left: logo + desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            {light ? (
              /* Light theme: circle-lines logo + italic wordmark */
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: ink, fontWeight: 600, fontSize: 22, letterSpacing: '-0.03em', fontFamily: SF }}>
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="13" stroke={ink} strokeWidth="1.5"/>
                  <path d="M9 9h10M9 14h10M9 19h6" stroke={ink} strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <span style={{ fontStyle: 'italic', fontSize: 24, letterSpacing: '-0.02em' }}>Leased</span>
              </span>
            ) : (
              <>
                <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 900, fontSize: 20, letterSpacing: '-0.01em', color: '#fff' }}>LEASE</span>
                <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 900, fontSize: 20, letterSpacing: '-0.01em', color: '#FF2800' }}>D</span>
              </>
            )}
          </Link>

          <div className="r-nav-links">
            {light ? (
              <>
                <Link href="/browse" style={linkStyle('/browse')}>Browse deals</Link>
                <a href="#how-it-works" style={linkStyle('')}>How it works</a>
                <a href="#about" style={linkStyle('')}>About</a>
              </>
            ) : (
              NAV_LINKS.map(({ label, href }) => (
                <Link key={label} href={href} style={linkStyle(href)}>{label}</Link>
              ))
            )}
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: light ? 8 : 16 }}>
          {!light && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF2800', display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', fontVariantNumeric: 'tabular-nums', minWidth: 28, display: 'inline-block' }}>
                  {liveCount ?? BASE} PEOPLE LIVE
                </span>
              </div>
              <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
            </>
          )}

          {user ? (
            <div className="r-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {dashHref && (
                <Link href={dashHref} style={{ textDecoration: 'none' }}>
                  <button style={{ padding: '8px 16px', border: `1px solid ${light ? 'rgba(10,10,10,0.15)' : 'rgba(255,40,0,0.4)'}`, borderRadius: 999, background: light ? 'rgba(10,10,10,0.06)' : 'rgba(255,40,0,0.1)', color: light ? ink : '#FF2800', fontFamily: light ? SF : 'var(--font-barlow-cond)', fontWeight: 600, fontSize: 13, letterSpacing: light ? '-0.01em' : '0.1em', cursor: 'pointer' }}>
                    {dashLabel} →
                  </button>
                </Link>
              )}
              <button
                onClick={signOut}
                style={{ padding: '8px 14px', border: `1px solid ${light ? 'rgba(10,10,10,0.12)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 999, background: 'transparent', color: inkMuted, fontFamily: light ? SF : 'var(--font-barlow-cond)', fontWeight: 500, fontSize: 13, letterSpacing: light ? '-0.01em' : '0.1em', cursor: 'pointer' }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="r-nav-links" style={{ display: 'flex', gap: 8 }}>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '10px 16px', border: 'none', borderRadius: 999, background: 'transparent', color: inkMuted, fontFamily: light ? SF : 'var(--font-barlow-cond)', fontWeight: 500, fontSize: 14, letterSpacing: light ? '-0.01em' : '0.1em', cursor: 'pointer' }}>
                  {light ? 'Sign in' : 'LOG IN'}
                </button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom tab bar — mobile only */}
      <div className="r-bottom-nav">
        {BOTTOM_TABS.map(({ label, href, icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                textDecoration: 'none',
                color: active ? (href === '/browse' ? '#FF2800' : '#fff') : 'rgba(255,255,255,0.35)',
                transition: 'color 0.2s',
                borderTop: active ? `2px solid ${href === '/browse' ? '#FF2800' : 'rgba(255,255,255,0.5)'}` : '2px solid transparent',
              }}
            >
              {icon}
              <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 9, letterSpacing: '0.1em' }}>
                {label}
              </span>
            </Link>
          );
        })}
        {user && dashHref ? (
          <Link href={dashHref} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none', color: path === dashHref ? '#FF2800' : 'rgba(255,255,255,0.35)', borderTop: path === dashHref ? '2px solid #FF2800' : '2px solid transparent' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="7" height="9" rx="1.5" fill="currentColor" opacity="0.8"/>
              <rect x="11" y="2" width="7" height="5" rx="1.5" fill="currentColor" opacity="0.8"/>
              <rect x="2" y="13" width="7" height="5" rx="1.5" fill="currentColor" opacity="0.5"/>
              <rect x="11" y="9" width="7" height="9" rx="1.5" fill="currentColor" opacity="0.8"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 9, letterSpacing: '0.1em' }}>
              {role === 'moderator' ? 'ADMIN' : 'DASH'}
            </span>
          </Link>
        ) : !user ? (
          <Link href="/login" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textDecoration: 'none', color: 'rgba(255,255,255,0.35)', borderTop: '2px solid transparent' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="3.5" fill="currentColor"/>
              <path d="M3 18C3 14.5 6.1 11.5 10 11.5C13.9 11.5 17 14.5 17 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 9, letterSpacing: '0.1em' }}>LOG IN</span>
          </Link>
        ) : null}
      </div>
    </>
  );
}
