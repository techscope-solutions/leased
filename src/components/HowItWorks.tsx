'use client';

import Link from 'next/link';

const STEPS = [
  {
    n: '01',
    title: 'Post a Deal',
    body: 'Vetted brokers and dealerships list real inventory — new vehicles and Certified Pre-Owned. Every posting is a live unit.',
    gradient: 'linear-gradient(135deg, #0c1a30 0%, #0a2240 100%)',
    accentColor: 'rgba(100,160,255,0.9)',
  },
  {
    n: '02',
    title: 'Browse & Filter',
    body: 'Filter by budget, category, or drivetrain. Each deal has a live countdown — when the clock hits zero, it\'s gone.',
    gradient: 'linear-gradient(135deg, #101a10 0%, #0f2a1a 100%)',
    accentColor: 'rgba(80,210,130,0.9)',
  },
  {
    n: '03',
    title: 'Request a Credit App',
    body: 'Found your price? Hit the button. The seller receives your intent and decides if they can move forward — no credit pull yet.',
    gradient: 'linear-gradient(135deg, #1a1505 0%, #2a2008 100%)',
    accentColor: 'rgba(220,170,60,0.9)',
  },
  {
    n: '04',
    title: 'Dealer Approves',
    body: 'The dealership or broker confirms they can proceed. Your score stays intact until you\'re genuinely ready to sign.',
    gradient: 'linear-gradient(135deg, #0a1a0a 0%, #122a12 100%)',
    accentColor: 'rgba(80,200,110,0.9)',
  },
  {
    n: '05',
    title: 'Fill Credit App',
    body: 'Once approved to proceed, you complete the credit application directly with the seller. Standard process, nothing new.',
    gradient: 'linear-gradient(135deg, #120a20 0%, #1a0f30 100%)',
    accentColor: 'rgba(160,120,240,0.9)',
  },
  {
    n: '06',
    title: 'Keys in Hand — $50',
    body: 'Approved? LEASED charges a flat $50 to coordinate delivery or pickup. We never retain your credit data.',
    gradient: 'linear-gradient(135deg, #080f1e 0%, #0d1a30 100%)',
    accentColor: '#4a7fd4',
    trust: true,
  },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: '80px 48px 88px', maxWidth: 1320, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 56 }}>

      {/* Centered title */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4a7fd4' }} />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.35)' }}>
            THE PROCESS
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px, 5vw, 64px)', letterSpacing: '-0.025em', lineHeight: 0.95 }}>
          <span style={{ color: '#fff' }}>HOW IT </span><span style={{ color: '#FF2800' }}>WORKS.</span>
        </div>
        <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', marginTop: 16, maxWidth: 460, margin: '16px auto 0' }}>
          Six steps from live drop to keys in hand. No hidden fees, no data games.
        </p>
      </div>

      {/* 3-column step grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, width: '100%' }}>
        {STEPS.map(step => (
          <StepCard key={step.n} step={step} />
        ))}
      </div>

      {/* CTA */}
      <Link href="/browse" style={{ textDecoration: 'none' }}>
        <button
          style={{
            padding: '15px 36px',
            borderRadius: 10,
            background: '#FF2800',
            border: '1px solid rgba(255,80,40,0.4)',
            boxShadow: '0 4px 28px rgba(255,40,0,0.35), inset 0 1px 0 rgba(255,255,255,0.16)',
            color: '#fff',
            fontFamily: 'var(--font-barlow-cond)',
            fontWeight: 800,
            fontSize: 14,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(255,40,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 28px rgba(255,40,0,0.35), inset 0 1px 0 rgba(255,255,255,0.16)'; }}
        >
          BROWSE LIVE DROPS →
        </button>
      </Link>
    </section>
  );
}

function StepCard({ step }: { step: typeof STEPS[number] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Visual area — gradient bg + UI mockup anchored bottom-right */}
      <div style={{
        height: 180,
        borderRadius: 12,
        background: step.gradient,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Subtle grid texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.06,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}/>

        {/* Step number watermark */}
        <div style={{
          position: 'absolute', top: 14, left: 18,
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 72, color: 'rgba(255,255,255,0.06)',
          letterSpacing: '-0.05em', lineHeight: 1,
          userSelect: 'none',
        }}>
          {step.n}
        </div>

        {/* UI mockup — bottom-right, no bottom-right radius so it bleeds into corner */}
        <div style={{ position: 'absolute', bottom: 0, right: 0, borderRadius: '10px 0 0 0', overflow: 'hidden' }}>
          <StepMockup n={step.n} accent={step.accentColor} />
        </div>
      </div>

      {/* Step label + title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{
          fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10,
          letterSpacing: '0.16em', color: step.trust ? 'rgba(74,127,212,0.85)' : 'rgba(255,255,255,0.35)',
        }}>
          STEP {step.n}
        </span>
        <div style={{
          fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 20,
          letterSpacing: '-0.01em', color: '#fff', lineHeight: 1.15,
          textTransform: 'uppercase',
        }}>
          {step.title}
        </div>
      </div>

      {/* Body */}
      <p style={{
        fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 14,
        lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', margin: 0,
      }}>
        {step.body}
      </p>

      {/* Trust badge on step 6 */}
      {step.trust && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(74,127,212,0.08)', border: '1px solid rgba(74,127,212,0.3)', borderRadius: 99, padding: '5px 14px', alignSelf: 'flex-start' }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1 L9 3 L9 6 C9 8 7 9.5 5 9.5 C3 9.5 1 8 1 6 L1 3 Z" stroke="#4a7fd4" strokeWidth="1" fill="none"/>
            <path d="M3.5 5 L4.5 6 L6.5 4" stroke="#4a7fd4" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', color: '#4a7fd4' }}>
            CREDIT DATA NEVER RETAINED
          </span>
        </div>
      )}
    </div>
  );
}

/* Mini UI mockup SVGs — each looks like a fragment of the LEASED app UI */
function StepMockup({ n, accent }: { n: string; accent: string }) {
  const w = 210;
  const h = 130;

  if (n === '01') return (
    // "New listing" creation card
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <rect width={w} height={h} fill="rgba(8,14,24,0.92)"/>
      {/* Header bar */}
      <rect x="0" y="0" width={w} height="32" fill="rgba(255,255,255,0.04)"/>
      <circle cx="14" cy="16" r="5" fill={accent} opacity="0.9"/>
      <rect x="26" y="12" width="60" height="8" rx="4" fill="rgba(255,255,255,0.15)"/>
      <rect x="170" y="10" width="28" height="12" rx="4" fill={accent} opacity="0.85"/>
      {/* Form fields */}
      <rect x="12" y="44" width="186" height="24" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <rect x="20" y="52" width="60" height="8" rx="3" fill="rgba(255,255,255,0.18)"/>
      <rect x="12" y="76" width="88" height="24" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <rect x="20" y="84" width="36" height="8" rx="3" fill="rgba(255,255,255,0.18)"/>
      <rect x="108" y="76" width="90" height="24" rx="5" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <rect x="116" y="84" width="42" height="8" rx="3" fill="rgba(255,255,255,0.18)"/>
      {/* Live indicator */}
      <circle cx="20" cy="116" r="4" fill="#FF2800" opacity="0.9"/>
      <rect x="30" y="112" width="48" height="8" rx="3" fill="rgba(255,255,255,0.2)"/>
    </svg>
  );

  if (n === '02') return (
    // Browse/filter list
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <rect width={w} height={h} fill="rgba(8,18,12,0.92)"/>
      {/* Filter chips */}
      <rect x="10" y="10" width="32" height="16" rx="8" fill={accent} opacity="0.85"/>
      <rect x="48" y="10" width="40" height="16" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <rect x="94" y="10" width="36" height="16" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <rect x="136" y="10" width="32" height="16" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      {/* Deal rows */}
      {[36, 64, 92].map((y, i) => (
        <g key={y}>
          <rect x="10" y={y} width={w - 20} height="22" rx="5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
          <rect x="18" y={y + 7} width="28" height="8" rx="3" fill={i === 0 ? accent : 'rgba(255,255,255,0.15)'} opacity={i === 0 ? 0.8 : 1}/>
          <rect x="54" y={y + 7} width="60" height="8" rx="3" fill="rgba(255,255,255,0.12)"/>
          <rect x="160" y={y + 7} width="30" height="8" rx="3" fill="rgba(255,40,0,0.7)"/>
        </g>
      ))}
      {/* Countdown */}
      <rect x="10" y="118" width="80" height="8" rx="3" fill="rgba(255,255,255,0.12)"/>
      <circle cx="170" cy="122" r="4" fill="#FF2800" opacity="0.8"/>
    </svg>
  );

  if (n === '03') return (
    // Deal card with highlighted CTA
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <rect width={w} height={h} fill="rgba(16,12,4,0.92)"/>
      {/* Car silhouette mini */}
      <path d="M20 55 L20 45 L36 34 L100 34 L118 45 L118 55 Z" fill="rgba(255,255,255,0.06)" stroke={accent} strokeWidth="0.8" opacity="0.7"/>
      <path d="M37 34 L46 26 L94 26 L103 34" fill="rgba(255,255,255,0.04)" stroke={accent} strokeWidth="0.8" opacity="0.6"/>
      <circle cx="38" cy="56" r="7" fill="#0a0a0a" stroke={accent} strokeWidth="0.8"/>
      <circle cx="100" cy="56" r="7" fill="#0a0a0a" stroke={accent} strokeWidth="0.8"/>
      {/* Price */}
      <rect x="20" y="70" width="40" height="14" rx="3" fill="rgba(255,40,0,0.7)"/>
      <rect x="68" y="73" width="50" height="8" rx="3" fill="rgba(255,255,255,0.15)"/>
      {/* CTA button — glowing */}
      <rect x="12" y="95" width="186" height="28" rx="7" fill={accent} opacity="0.15" stroke={accent} strokeWidth="1"/>
      <rect x="12" y="95" width="186" height="28" rx="7" fill={accent} opacity="0.08"/>
      <rect x="60" y="104" width="90" height="10" rx="4" fill={accent} opacity="0.9"/>
      {/* glow under button */}
      <ellipse cx="105" cy="125" rx="60" ry="6" fill={accent} opacity="0.12"/>
    </svg>
  );

  if (n === '04') return (
    // Approval notification card
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <rect width={w} height={h} fill="rgba(8,14,8,0.92)"/>
      {/* Notification card */}
      <rect x="12" y="14" width="186" height="70" rx="10" fill="rgba(255,255,255,0.04)" stroke={accent} strokeWidth="1" opacity="0.8"/>
      {/* Checkmark circle */}
      <circle cx="38" cy="49" r="14" fill={accent} opacity="0.15" stroke={accent} strokeWidth="1"/>
      <path d="M32 49 L36.5 53.5 L44 44" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Text lines */}
      <rect x="58" y="40" width="80" height="9" rx="4" fill="rgba(255,255,255,0.55)"/>
      <rect x="58" y="54" width="120" height="7" rx="3" fill="rgba(255,255,255,0.2)"/>
      {/* Second smaller card */}
      <rect x="12" y="96" width="186" height="24" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
      <rect x="24" y="104" width="60" height="7" rx="3" fill="rgba(255,255,255,0.2)"/>
      <circle cx="188" cy="108" r="5" fill={accent} opacity="0.8"/>
    </svg>
  );

  if (n === '05') return (
    // Credit application form
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <rect width={w} height={h} fill="rgba(14,8,24,0.92)"/>
      {/* Form header */}
      <rect x="12" y="10" width="186" height="22" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <rect x="20" y="17" width="70" height="8" rx="3" fill="rgba(255,255,255,0.25)"/>
      <rect x="170" y="17" width="18" height="8" rx="3" fill={accent} opacity="0.7"/>
      {/* Form fields with fill state */}
      {[40, 62].map((y, i) => (
        <g key={y}>
          <rect x="12" y={y} width="90" height="16" rx="4" fill="rgba(255,255,255,0.05)" stroke={i === 0 ? accent : 'rgba(255,255,255,0.08)'} strokeWidth="1"/>
          <rect x="20" y={y + 4} width={i === 0 ? 52 : 30} height="8" rx="3" fill={i === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)'}/>
          <rect x="108" y={y} width="90" height="16" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
          <rect x="116" y={y + 4} width={i === 0 ? 40 : 20} height="8" rx="3" fill={i === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)'}/>
        </g>
      ))}
      {/* Multi-line field */}
      <rect x="12" y="86" width="186" height="30" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <rect x="20" y="93" width="100" height="6" rx="3" fill="rgba(255,255,255,0.4)"/>
      <rect x="20" y="103" width="60" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
      {/* Progress bar */}
      <rect x="12" y="122" width="186" height="4" rx="2" fill="rgba(255,255,255,0.06)"/>
      <rect x="12" y="122" width="130" height="4" rx="2" fill={accent} opacity="0.8"/>
    </svg>
  );

  // n === '06' — success / keys
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <rect width={w} height={h} fill="rgba(18,6,6,0.92)"/>
      {/* Success card */}
      <rect x="12" y="10" width="186" height="88" rx="12" fill="rgba(255,40,0,0.06)" stroke="rgba(255,40,0,0.25)" strokeWidth="1"/>
      {/* Big checkmark */}
      <circle cx="105" cy="42" r="20" fill="rgba(255,40,0,0.12)" stroke="#FF2800" strokeWidth="1.5"/>
      <path d="M96 42 L102 48 L114 34" stroke="#FF2800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Text */}
      <rect x="70" y="68" width="70" height="9" rx="4" fill="rgba(255,255,255,0.5)"/>
      <rect x="80" y="81" width="50" height="7" rx="3" fill="rgba(255,40,0,0.6)"/>
      {/* $50 badge */}
      <rect x="50" y="108" width="110" height="18" rx="9" fill="rgba(255,40,0,0.15)" stroke="rgba(255,40,0,0.35)" strokeWidth="1"/>
      <rect x="74" y="115" width="62" height="7" rx="3" fill="#FF2800" opacity="0.8"/>
    </svg>
  );
}
