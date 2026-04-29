'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav({ liveCount = 12 }: { liveCount?: number }) {
  const path = usePathname();

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: 52,
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(8,8,8,0.9)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
    }}>
      {/* Left: logo + links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <span style={{
            fontFamily: 'var(--font-barlow-cond)',
            fontWeight: 900,
            fontSize: 20,
            letterSpacing: '-0.01em',
            color: '#fff',
          }}>LEASE</span>
          <span style={{
            fontFamily: 'var(--font-barlow-cond)',
            fontWeight: 900,
            fontSize: 20,
            letterSpacing: '-0.01em',
            color: '#FF2800',
          }}>D</span>
        </Link>

        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { label: 'FEED', href: '/browse' },
            { label: 'POST', href: '/post' },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              style={{
                fontFamily: 'var(--font-barlow-cond)',
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: '0.08em',
                color: path === href ? '#fff' : 'rgba(255,255,255,0.45)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right: live count + light mode toggle + sign in */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span
            className="pulse-dot"
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#FF2800',
              display: 'inline-block',
            }}
          />
          <span style={{
            fontFamily: 'var(--font-barlow-cond)',
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.7)',
          }}>
            {liveCount} LIVE
          </span>
        </div>

        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />

        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'transparent',
          border: 'none',
          color: 'rgba(255,255,255,0.4)',
          fontFamily: 'var(--font-barlow-cond)',
          fontWeight: 600,
          fontSize: 12,
          letterSpacing: '0.08em',
          padding: 0,
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.35)',
            display: 'inline-block',
          }} />
          LIGHT
        </button>

        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />

        <button style={{
          padding: '6px 16px',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 3,
          background: 'transparent',
          color: '#fff',
          fontFamily: 'var(--font-barlow-cond)',
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: '0.1em',
        }}>
          SIGN IN
        </button>
      </div>
    </nav>
  );
}
