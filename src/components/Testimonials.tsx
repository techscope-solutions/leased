'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const TESTIMONIALS = [
  {
    name: 'Marcus T.',
    location: 'Los Angeles, CA',
    quote: 'Found a $649/mo BMW M3 with zero down. Clicked the drop, applied through the dealer, signed three days later. Nothing else comes close.',
    car: 'BMW M3 Competition',
    monthly: 649,
    carType: 'sedan',
    carColor: '#1a3a6b',
    accentColor: 'rgba(100,140,220,0.85)',
    avatarSeed: 1,
  },
  {
    name: 'Priya K.',
    location: 'Austin, TX',
    quote: 'I was skeptical at first but the broker was verified and the deal was real. Drove off in a Porsche Macan at $589/mo. Insane.',
    car: 'Porsche Macan S',
    monthly: 589,
    carType: 'suv',
    carColor: '#2a1a0a',
    accentColor: 'rgba(220,160,80,0.85)',
    avatarSeed: 2,
  },
  {
    name: 'Jordan R.',
    location: 'Miami, FL',
    quote: 'The countdown timer is real. I missed a $489 Tesla deal by 20 minutes. Grabbed the next one instantly. Worth every second of attention.',
    car: 'Tesla Model 3',
    monthly: 489,
    carType: 'ev',
    carColor: '#0a2a1a',
    accentColor: 'rgba(80,220,140,0.85)',
    avatarSeed: 3,
  },
  {
    name: 'Sofia M.',
    location: 'New York, NY',
    quote: 'No credit pull until I was actually approved to proceed. That alone was worth it. Ended up in an Audi Q5 at $612/mo.',
    car: 'Audi Q5 Premium+',
    monthly: 612,
    carType: 'suv',
    carColor: '#1a1a2a',
    accentColor: 'rgba(160,140,220,0.85)',
    avatarSeed: 4,
  },
];

const AVATAR_COLORS = [
  { bg: 'rgba(100,140,220,0.15)', border: 'rgba(100,140,220,0.4)', fill: 'rgba(100,140,220,0.8)' },
  { bg: 'rgba(220,160,80,0.15)', border: 'rgba(220,160,80,0.4)', fill: 'rgba(220,160,80,0.8)' },
  { bg: 'rgba(80,220,140,0.15)', border: 'rgba(80,220,140,0.4)', fill: 'rgba(80,220,140,0.8)' },
  { bg: 'rgba(160,140,220,0.15)', border: 'rgba(160,140,220,0.4)', fill: 'rgba(160,140,220,0.8)' },
];

function AvatarSVG({ seed, size = 44 }: { seed: number; size?: number }) {
  const c = AVATAR_COLORS[(seed - 1) % AVATAR_COLORS.length];
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="25" fill={c.bg} stroke={c.border} strokeWidth="1"/>
      <circle cx="26" cy="20" r="8" fill={c.fill} opacity="0.9"/>
      <path d="M10 46 C10 36 16 30 26 30 C36 30 42 36 42 46" fill={c.fill} opacity="0.7"/>
    </svg>
  );
}

function CarSilhouetteMini({ type, color, accent }: { type: string; color: string; accent: string }) {
  if (type === 'suv') return (
    <svg width="220" height="96" viewBox="0 0 220 96" fill="none">
      <defs>
        <radialGradient id="glow-suv" cx="50%" cy="80%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.5"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="110" cy="88" rx="76" ry="8" fill="url(#glow-suv)"/>
      <path d="M28 68 L28 48 L54 30 L152 30 L190 48 L190 68 Z" fill={color} stroke={accent} strokeWidth="1" opacity="0.9"/>
      <path d="M57 30 L74 14 L146 14 L163 30" fill={color} stroke={accent} strokeWidth="1" opacity="0.85"/>
      <path d="M76 15 L84 30 L134 30 L142 15 Z" fill={accent} opacity="0.18"/>
      <line x1="110" y1="15" x2="110" y2="30" stroke={accent} strokeWidth="0.7" opacity="0.25"/>
      <circle cx="62" cy="70" r="16" fill="#080808" stroke={accent} strokeWidth="1.2"/>
      <circle cx="62" cy="70" r="8" fill={accent} opacity="0.2"/>
      <circle cx="156" cy="70" r="16" fill="#080808" stroke={accent} strokeWidth="1.2"/>
      <circle cx="156" cy="70" r="8" fill={accent} opacity="0.2"/>
    </svg>
  );

  if (type === 'ev') return (
    <svg width="220" height="96" viewBox="0 0 220 96" fill="none">
      <defs>
        <radialGradient id="glow-ev" cx="50%" cy="80%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.5"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="110" cy="88" rx="76" ry="8" fill="url(#glow-ev)"/>
      <path d="M24 68 L24 50 L46 32 L168 32 L194 50 L194 68 Z" fill={color} stroke={accent} strokeWidth="1" opacity="0.9"/>
      <path d="M48 32 L66 17 L154 17 L172 32" fill={color} stroke={accent} strokeWidth="1" opacity="0.85"/>
      <path d="M68 18 L76 32 L144 32 L152 18 Z" fill={accent} opacity="0.18"/>
      <line x1="110" y1="18" x2="110" y2="32" stroke={accent} strokeWidth="0.7" opacity="0.25"/>
      <circle cx="60" cy="70" r="15" fill="#080808" stroke={accent} strokeWidth="1.2"/>
      <circle cx="60" cy="70" r="7" fill={accent} opacity="0.2"/>
      <circle cx="158" cy="70" r="15" fill="#080808" stroke={accent} strokeWidth="1.2"/>
      <circle cx="158" cy="70" r="7" fill={accent} opacity="0.2"/>
      <path d="M112 42 L104 58 L113 58 L105 74" stroke={accent} strokeWidth="2" strokeLinecap="round" opacity="0.65"/>
    </svg>
  );

  return (
    <svg width="220" height="96" viewBox="0 0 220 96" fill="none">
      <defs>
        <radialGradient id="glow-sedan" cx="50%" cy="80%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.5"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="110" cy="88" rx="76" ry="8" fill="url(#glow-sedan)"/>
      <path d="M20 68 L20 52 L42 34 L174 34 L198 52 L198 68 Z" fill={color} stroke={accent} strokeWidth="1" opacity="0.9"/>
      <path d="M58 34 L76 18 L144 18 L164 34" fill={color} stroke={accent} strokeWidth="1" opacity="0.85"/>
      <path d="M78 19 L86 34 L142 34 L154 19 Z" fill={accent} opacity="0.18"/>
      <line x1="110" y1="19" x2="110" y2="34" stroke={accent} strokeWidth="0.7" opacity="0.25"/>
      <circle cx="58" cy="70" r="15" fill="#080808" stroke={accent} strokeWidth="1.2"/>
      <circle cx="58" cy="70" r="7" fill={accent} opacity="0.2"/>
      <circle cx="160" cy="70" r="15" fill="#080808" stroke={accent} strokeWidth="1.2"/>
      <circle cx="160" cy="70" r="7" fill={accent} opacity="0.2"/>
    </svg>
  );
}

function StarRow() {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 12 12" fill="none">
          <path d="M6 1 L7.2 4.2 L10.6 4.4 L8 6.8 L8.9 10.2 L6 8.4 L3.1 10.2 L4 6.8 L1.4 4.4 L4.8 4.2 Z" fill="#FF2800"/>
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);

  const goTo = (next: number) => {
    if (animating || next === active) return;
    setDir(next > active ? 1 : -1);
    setAnimating(true);
    setTimeout(() => {
      setActive(next);
      setAnimating(false);
    }, 380);
  };

  useEffect(() => {
    const id = setInterval(() => goTo((active + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(id);
  }, [active, animating]);

  const t = TESTIMONIALS[active];

  return (
    <>
      <style>{`
        @keyframes slide-in-right { from { opacity: 0; transform: translateX(48px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slide-in-left  { from { opacity: 0; transform: translateX(-48px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slide-out-right { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(48px); } }
        @keyframes slide-out-left  { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-48px); } }
      `}</style>

      <section style={{
        padding: '72px 48px 88px',
        maxWidth: 1320,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '80vh',
      }}>

        {/* Header */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF2800' }} />
            <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.35)' }}>
              REAL DRIVERS
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px, 5vw, 68px)', letterSpacing: '-0.025em', lineHeight: 0.9 }}>
              <span style={{ color: '#fff' }}>THEY </span><span style={{ color: '#FF2800' }}>LEASED.</span>
            </div>
            <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', maxWidth: 300 }}>
              Real drops. Real numbers. Real keys.
            </p>
          </div>
        </div>

        {/* Slideshow — fills remaining height */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Main card */}
          <div
            key={active}
            style={{
              flex: 1,
              borderRadius: 28,
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(40px) saturate(160%)',
              WebkitBackdropFilter: 'blur(40px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 12px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              overflow: 'hidden',
              animation: animating
                ? (dir > 0 ? 'slide-out-left 0.38s ease forwards' : 'slide-out-right 0.38s ease forwards')
                : (dir > 0 ? 'slide-in-right 0.38s ease forwards' : 'slide-in-left 0.38s ease forwards'),
            }}
          >
            {/* Left — quote side */}
            <div style={{
              padding: '48px 48px 48px 52px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRight: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div>
                <StarRow />
                <p style={{
                  fontFamily: 'var(--font-barlow)',
                  fontWeight: 300,
                  fontSize: 20,
                  lineHeight: 1.65,
                  color: 'rgba(255,255,255,0.85)',
                  margin: '28px 0 0',
                  letterSpacing: '-0.01em',
                }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 36 }}>
                <AvatarSVG seed={t.avatarSeed} size={44} />
                <div>
                  <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '0.02em' }}>
                    {t.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                    {t.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Right — car side */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
              padding: '48px',
              background: `radial-gradient(ellipse at 50% 60%, ${t.carColor} 0%, rgba(8,8,8,0.6) 65%)`,
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Grid texture */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.05,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}/>

              <CarSilhouetteMini type={t.carType} color={t.carColor} accent={t.accentColor} />

              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 48, color: '#FF2800', letterSpacing: '-0.04em', lineHeight: 1 }}>
                  ${t.monthly}
                </div>
                <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', marginTop: 4 }}>
                  PER MONTH · {t.car.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row: dots + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            {/* Dots */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  style={{
                    width: i === active ? 28 : 8,
                    height: 8,
                    borderRadius: 99,
                    background: i === active ? '#FF2800' : 'rgba(255,255,255,0.18)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.3s cubic-bezier(0.23,1,0.32,1)',
                  }}
                />
              ))}
            </div>

            {/* CTA */}
            <Link href="/browse" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  padding: '14px 36px',
                  borderRadius: 14,
                  background: 'rgba(255,40,0,0.9)',
                  border: '1px solid rgba(255,80,40,0.45)',
                  boxShadow: '0 4px 28px rgba(255,40,0,0.35), inset 0 1px 0 rgba(255,255,255,0.16)',
                  color: '#fff',
                  fontFamily: 'var(--font-barlow-cond)',
                  fontWeight: 800,
                  fontSize: 13,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 8px 40px rgba(255,40,0,0.55), inset 0 1px 0 rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 4px 28px rgba(255,40,0,0.35), inset 0 1px 0 rgba(255,255,255,0.16)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                YOUR NEXT CAR SHOULD BE LEASED TODAY →
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
