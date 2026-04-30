'use client';

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

function AvatarSVG({ seed, size = 52 }: { seed: number; size?: number }) {
  const c = AVATAR_COLORS[(seed - 1) % AVATAR_COLORS.length];
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <circle cx="26" cy="26" r="25" fill={c.bg} stroke={c.border} strokeWidth="1"/>
      {/* Head */}
      <circle cx="26" cy="20" r="8" fill={c.fill} opacity="0.9"/>
      {/* Shoulders */}
      <path d="M10 46 C10 36 16 30 26 30 C36 30 42 36 42 46" fill={c.fill} opacity="0.7"/>
    </svg>
  );
}

function CarSilhouetteMini({ type, color, accent }: { type: string; color: string; accent: string }) {
  if (type === 'suv') return (
    <svg width="160" height="72" viewBox="0 0 160 72" fill="none">
      <defs>
        <radialGradient id={`glow-${type}-${color}`} cx="50%" cy="80%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="80" cy="66" rx="56" ry="6" fill={`url(#glow-${type}-${color})`}/>
      {/* Body */}
      <path d="M20 50 L20 36 L40 22 L110 22 L138 36 L138 50 Z" fill={color} stroke={accent} strokeWidth="0.8" opacity="0.9"/>
      {/* Roof */}
      <path d="M42 22 L55 10 L105 10 L118 22" fill={color} stroke={accent} strokeWidth="0.8" opacity="0.85"/>
      {/* Windows */}
      <path d="M56 12 L62 22 L95 22 L100 12 Z" fill={accent} opacity="0.2"/>
      <line x1="80" y1="12" x2="80" y2="22" stroke={accent} strokeWidth="0.5" opacity="0.3"/>
      {/* Wheels */}
      <circle cx="46" cy="52" r="12" fill="#0a0a0a" stroke={accent} strokeWidth="1"/>
      <circle cx="46" cy="52" r="6" fill={accent} opacity="0.25"/>
      <circle cx="112" cy="52" r="12" fill="#0a0a0a" stroke={accent} strokeWidth="1"/>
      <circle cx="112" cy="52" r="6" fill={accent} opacity="0.25"/>
    </svg>
  );

  if (type === 'ev') return (
    <svg width="160" height="72" viewBox="0 0 160 72" fill="none">
      <defs>
        <radialGradient id={`glow-ev-${color}`} cx="50%" cy="80%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="80" cy="66" rx="56" ry="6" fill={`url(#glow-ev-${color})`}/>
      {/* Body */}
      <path d="M18 50 L18 38 L36 24 L122 24 L140 38 L140 50 Z" fill={color} stroke={accent} strokeWidth="0.8" opacity="0.9"/>
      {/* Roof */}
      <path d="M38 24 L50 13 L110 13 L122 24" fill={color} stroke={accent} strokeWidth="0.8" opacity="0.85"/>
      {/* Windows */}
      <path d="M52 14 L58 24 L100 24 L108 14 Z" fill={accent} opacity="0.2"/>
      <line x1="82" y1="14" x2="82" y2="24" stroke={accent} strokeWidth="0.5" opacity="0.3"/>
      {/* Wheels */}
      <circle cx="44" cy="52" r="11" fill="#0a0a0a" stroke={accent} strokeWidth="1"/>
      <circle cx="44" cy="52" r="5" fill={accent} opacity="0.25"/>
      <circle cx="114" cy="52" r="11" fill="#0a0a0a" stroke={accent} strokeWidth="1"/>
      <circle cx="114" cy="52" r="5" fill={accent} opacity="0.25"/>
      {/* EV bolt */}
      <path d="M82 30 L76 42 L83 42 L77 54" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    </svg>
  );

  // sedan (default)
  return (
    <svg width="160" height="72" viewBox="0 0 160 72" fill="none">
      <defs>
        <radialGradient id={`glow-sedan-${color}`} cx="50%" cy="80%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.4"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="80" cy="66" rx="56" ry="6" fill={`url(#glow-sedan-${color})`}/>
      {/* Body */}
      <path d="M16 50 L16 40 L32 26 L126 26 L142 40 L142 50 Z" fill={color} stroke={accent} strokeWidth="0.8" opacity="0.9"/>
      {/* Roof — low and sleek */}
      <path d="M44 26 L58 14 L102 14 L118 26" fill={color} stroke={accent} strokeWidth="0.8" opacity="0.85"/>
      {/* Windows */}
      <path d="M60 15 L66 26 L100 26 L108 15 Z" fill={accent} opacity="0.2"/>
      <line x1="83" y1="15" x2="83" y2="26" stroke={accent} strokeWidth="0.5" opacity="0.3"/>
      {/* Wheels */}
      <circle cx="42" cy="52" r="11" fill="#0a0a0a" stroke={accent} strokeWidth="1"/>
      <circle cx="42" cy="52" r="5" fill={accent} opacity="0.25"/>
      <circle cx="116" cy="52" r="11" fill="#0a0a0a" stroke={accent} strokeWidth="1"/>
      <circle cx="116" cy="52" r="5" fill={accent} opacity="0.25"/>
    </svg>
  );
}

function StarRow({ rating = 5 }: { rating?: number }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 1 L7.2 4.2 L10.6 4.4 L8 6.8 L8.9 10.2 L6 8.4 L3.1 10.2 L4 6.8 L1.4 4.4 L4.8 4.2 Z"
            fill={i < rating ? '#FF2800' : 'rgba(255,255,255,0.15)'}
          />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section style={{ padding: '72px 48px 88px', maxWidth: 1320, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF2800' }} />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.35)' }}>
            REAL DRIVERS
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px, 5vw, 68px)', letterSpacing: '-0.025em', lineHeight: 0.9 }}>
            <span style={{ color: '#fff' }}>THEY LEASED </span><span style={{ color: '#FF2800' }}>TODAY.</span>
          </div>
          <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', maxWidth: 320 }}>
            Real drops. Real numbers. Real keys.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 56 }}>
        {TESTIMONIALS.map((t, i) => (
          <TestimonialCard key={i} testimonial={t} index={i} />
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 15, color: 'rgba(255,255,255,0.55)', marginBottom: 28, letterSpacing: '0.01em' }}>
          Your next car should be leased today.
        </p>
        <Link href="/browse" style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: '16px 44px',
              borderRadius: 16,
              background: 'rgba(255,40,0,0.9)',
              border: '1px solid rgba(255,80,40,0.45)',
              boxShadow: '0 4px 32px rgba(255,40,0,0.38), inset 0 1px 0 rgba(255,255,255,0.16)',
              color: '#fff',
              fontFamily: 'var(--font-barlow-cond)',
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: '0.1em',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 8px 48px rgba(255,40,0,0.55), inset 0 1px 0 rgba(255,255,255,0.2)';
              e.currentTarget.style.background = 'rgba(255,40,0,1)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 4px 32px rgba(255,40,0,0.38), inset 0 1px 0 rgba(255,255,255,0.16)';
              e.currentTarget.style.background = 'rgba(255,40,0,0.9)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            BROWSE LIVE DROPS →
          </button>
        </Link>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial: t, index }: { testimonial: typeof TESTIMONIALS[number]; index: number }) {
  const avatarC = AVATAR_COLORS[index % AVATAR_COLORS.length];

  return (
    <div style={{
      borderRadius: 24,
      padding: '28px 28px 24px',
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(32px) saturate(160%)',
      WebkitBackdropFilter: 'blur(32px) saturate(160%)',
      border: '1px solid rgba(255,255,255,0.07)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    }}>

      {/* Car silhouette */}
      <div style={{
        height: 100,
        borderRadius: 16,
        background: `radial-gradient(ellipse at 50% 60%, ${t.carColor} 0%, rgba(10,10,10,0.8) 70%)`,
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* subtle grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.07,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}/>
        <CarSilhouetteMini type={t.carType} color={t.carColor} accent={t.accentColor} />
      </div>

      {/* Stars */}
      <StarRow rating={5} />

      {/* Quote */}
      <p style={{
        fontFamily: 'var(--font-barlow)',
        fontWeight: 300,
        fontSize: 14,
        lineHeight: 1.75,
        color: 'rgba(255,255,255,0.75)',
        margin: '0 0 20px',
        flexGrow: 1,
      }}>
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 16 }} />

      {/* Person + car info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <AvatarSVG seed={index + 1} size={40} />
          <div>
            <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 13, color: '#fff', letterSpacing: '0.02em' }}>
              {t.name}
            </div>
            <div style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>
              {t.location}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: '#FF2800', letterSpacing: '-0.02em', lineHeight: 1 }}>
            ${t.monthly}
          </div>
          <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 500, fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginTop: 2 }}>
            /MO · {t.car.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}
