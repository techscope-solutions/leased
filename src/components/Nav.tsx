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

export default function Nav() {
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
    <>
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

          <div className="r-nav-links">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} style={linkStyle(href)}>{label}</Link>
            ))}
          </div>
        </div>

        {/* Right: live count + log in */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span className="pulse-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF2800', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', fontVariantNumeric: 'tabular-nums', minWidth: 28, display: 'inline-block' }}>
              {liveCount ?? BASE} PEOPLE LIVE
            </span>
          </div>

          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />

          {user ? (
            <div className="r-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {dashHref && (
                <Link href={dashHref} style={{ textDecoration: 'none' }}>
                  <button style={{ padding: '6px 16px', border: '1px solid rgba(255,40,0,0.4)', borderRadius: 8, background: 'rgba(255,40,0,0.1)', color: '#FF2800', fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 12, letterSpacing: '0.1em', cursor: 'pointer' }}>
                    {dashLabel} →
                  </button>
                </Link>
              )}
              <button
                onClick={signOut}
                style={{ padding: '6px 14px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-barlow-cond)', fontWeight: 600, fontSize: 11, letterSpacing: '0.1em', cursor: 'pointer' }}
              >
                SIGN OUT
              </button>
            </div>
          ) : (
            <Link href="/login" className="r-nav-links" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '6px 18px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, background: 'transparent', color: '#fff', fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', cursor: 'pointer' }}>
                LOG IN
              </button>
            </Link>
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
        ) : (
          <button
            onClick={signOut}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, background: 'transparent', border: 'none', borderTop: '2px solid transparent', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', padding: 0 }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="3.5" fill="currentColor"/>
              <path d="M3 18C3 14.5 6.1 11.5 10 11.5C13.9 11.5 17 14.5 17 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 9, letterSpacing: '0.1em' }}>ACCOUNT</span>
          </button>
        )}
      </div>
    </>
  );
}
