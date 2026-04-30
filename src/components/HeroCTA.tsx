'use client';

import Link from 'next/link';

export default function HeroCTA() {
  return (
    <div className="r-cta-row" style={{ position: 'relative', zIndex: 8 }}>
      <Link href="/browse" style={{ textDecoration: 'none' }}>
        <button
          style={{
            padding: '14px 32px', borderRadius: 14,
            background: 'rgba(255,40,0,0.9)',
            border: '1px solid rgba(255,80,40,0.45)',
            boxShadow: '0 4px 28px rgba(255,40,0,0.38), inset 0 1px 0 rgba(255,255,255,0.16)',
            color: '#fff', fontFamily: 'var(--font-barlow-cond)', fontWeight: 800,
            fontSize: 13, letterSpacing: '0.1em', cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 40px rgba(255,40,0,0.55), inset 0 1px 0 rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'rgba(255,40,0,1)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 28px rgba(255,40,0,0.38), inset 0 1px 0 rgba(255,255,255,0.16)'; e.currentTarget.style.background = 'rgba(255,40,0,0.9)'; }}
        >
          BROWSE LIVE DROPS →
        </button>
      </Link>
      <button style={{
        padding: '14px 24px', borderRadius: 14,
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.65)',
        fontFamily: 'var(--font-barlow-cond)', fontWeight: 700,
        fontSize: 13, letterSpacing: '0.08em', cursor: 'pointer',
      }}>
        HOW IT WORKS
      </button>
    </div>
  );
}
