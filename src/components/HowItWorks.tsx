'use client';

const STEPS = [
  {
    n: '01',
    title: 'Post a Deal',
    body: 'Vetted brokers and dealerships list real inventory — new vehicles and Certified Pre-Owned. Every posting is a live unit.',
    icon: 'broadcast',
    accent: 'rgba(255,255,255,0.55)',
  },
  {
    n: '02',
    title: 'Browse & Filter',
    body: 'Filter by budget, category, drivetrain, or location. Each deal has a live countdown — when the clock hits zero, it\'s gone.',
    icon: 'browse',
    accent: 'rgba(139,174,212,0.85)',
  },
  {
    n: '03',
    title: 'Request a Credit App',
    body: 'Found your price? Hit the button. The seller receives your intent and decides if they can move forward — no credit pull yet.',
    icon: 'request',
    accent: 'rgba(212,170,80,0.85)',
  },
  {
    n: '04',
    title: 'Dealer Approves',
    body: 'The dealership or broker confirms they can proceed. Your score stays intact until you\'re genuinely ready to sign.',
    icon: 'approve',
    accent: 'rgba(100,200,120,0.85)',
  },
  {
    n: '05',
    title: 'Fill Credit App',
    body: 'Once approved to proceed, you complete the credit application directly with the seller. Standard process, nothing new.',
    icon: 'fill',
    accent: 'rgba(180,120,220,0.8)',
  },
  {
    n: '06',
    title: 'Keys in Hand — $50',
    body: 'Approved? LEASED charges a flat $50 to coordinate delivery or pickup. We never retain your credit data — it passes directly to the dealer.',
    icon: 'keys',
    accent: '#FF2800',
    trust: true,
  },
];

export default function HowItWorks() {
  return (
    <>
      {/* CSS animations */}
      <style>{`
        @keyframes broadcast-ring {
          0%   { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes scan-sweep {
          0%   { transform: translateY(-18px); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(18px); opacity: 0; }
        }
        @keyframes tap-pulse {
          0%, 100% { transform: scale(1); }
          40%       { transform: scale(0.88); }
          70%       { transform: scale(1.06); }
        }
        @keyframes check-draw {
          0%   { stroke-dashoffset: 28; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes doc-fill {
          0%   { height: 0; }
          100% { height: 28px; }
        }
        @keyframes key-spin {
          0%   { transform: rotate(-15deg); }
          50%  { transform: rotate(15deg); }
          100% { transform: rotate(-15deg); }
        }
        @keyframes float-up {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
      `}</style>

      <section style={{ padding: '72px 48px 80px', maxWidth: 1320, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF2800' }} />
            <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.35)' }}>THE PROCESS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px, 5vw, 68px)', letterSpacing: '-0.025em', lineHeight: 0.9 }}>
              <span style={{ color: '#fff' }}>HOW IT </span><span style={{ color: '#FF2800' }}>WORKS.</span>
            </div>
            <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.35)', maxWidth: 340 }}>
              Six steps from live drop to keys in hand.<br/>No hidden fees, no data games.
            </p>
          </div>
        </div>

        {/* Steps grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {STEPS.map(step => (
            <StepCard key={step.n} step={step} />
          ))}
        </div>
      </section>
    </>
  );
}

function StepCard({ step }: { step: typeof STEPS[number] }) {
  return (
    <div style={{
      borderRadius: 24,
      padding: '28px 28px 32px',
      background: step.trust ? 'rgba(255,40,0,0.04)' : 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(32px) saturate(160%)',
      WebkitBackdropFilter: 'blur(32px) saturate(160%)',
      border: step.trust ? '1px solid rgba(255,40,0,0.2)' : '1px solid rgba(255,255,255,0.07)',
      boxShadow: step.trust
        ? '0 8px 40px rgba(255,40,0,0.08), inset 0 1px 0 rgba(255,255,255,0.06)'
        : '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = step.trust ? '0 20px 60px rgba(255,40,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)' : '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = step.trust ? '0 8px 40px rgba(255,40,0,0.08), inset 0 1px 0 rgba(255,255,255,0.06)' : '0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'; }}
    >
      {/* Ghost step number */}
      <div style={{ position: 'absolute', top: -12, right: 12, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 100, color: 'rgba(255,255,255,0.025)', letterSpacing: '-0.05em', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>
        {step.n}
      </div>

      {/* Animated icon — centered */}
      <div style={{ marginBottom: 24, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <StepIcon icon={step.icon} accent={step.accent} />
      </div>

      {/* Step number label — centered */}
      <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.16em', color: step.trust ? 'rgba(255,40,0,0.7)' : 'rgba(255,255,255,0.38)', marginBottom: 8, textAlign: 'center' }}>
        STEP {step.n}
      </div>

      {/* Title — centered */}
      <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 18, letterSpacing: '0.01em', color: '#fff', lineHeight: 1.2, marginBottom: 10, textTransform: 'uppercase', textAlign: 'center' }}>
        {step.title}
      </div>

      {/* Body — centered */}
      <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.58)', margin: 0, textAlign: 'center' }}>
        {step.body}
      </p>

      {/* Trust badge on step 6 */}
      {step.trust && (
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,40,0,0.1)', border: '1px solid rgba(255,40,0,0.28)', borderRadius: 99, padding: '5px 14px' }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1 L9 3 L9 6 C9 8 7 9.5 5 9.5 C3 9.5 1 8 1 6 L1 3 Z" stroke="#FF2800" strokeWidth="1" fill="none"/>
            <path d="M3.5 5 L4.5 6 L6.5 4" stroke="#FF2800" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', color: '#FF2800' }}>
            CREDIT DATA NEVER RETAINED
          </span>
        </div>
        </div>
      )}
    </div>
  );
}

function StepIcon({ icon, accent }: { icon: string; accent: string }) {
  const size = 44;

  if (icon === 'broadcast') return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {[1, 2].map(i => (
        <div key={i} style={{ position: 'absolute', width: size, height: size, borderRadius: '50%', border: `1px solid ${accent}`, animation: `broadcast-ring 2.4s ease-out ${i * 0.8}s infinite`, opacity: 0 }} />
      ))}
      <div style={{ width: 14, height: 14, borderRadius: '50%', background: accent, boxShadow: `0 0 12px ${accent}` }} />
    </div>
  );

  if (icon === 'browse') return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <rect x="6" y="8" width="32" height="28" rx="6" stroke={accent} strokeWidth="1.5"/>
      <rect x="6" y="8" width="32" height="8" rx="6" stroke={accent} strokeWidth="1.5" fill={`${accent}15`}/>
      <line x1="12" y1="22" x2="32" y2="22" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="12" y1="28" x2="26" y2="28" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
      <line x1="6" y1="20" x2="38" y2="20" stroke={accent} strokeWidth="1" strokeLinecap="round" style={{ animation: 'scan-sweep 2.5s ease-in-out infinite', animationFillMode: 'both' }} opacity="0.6"/>
    </svg>
  );

  if (icon === 'request') return (
    <div style={{ width: size, height: size, borderRadius: 14, border: `1.5px solid ${accent}`, background: `${accent}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'tap-pulse 2.2s ease-in-out infinite', boxShadow: `0 0 16px ${accent}30` }}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 4 L11 18" stroke={accent} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M4 11 L18 11" stroke={accent} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </div>
  );

  if (icon === 'approve') return (
    <div style={{ width: size, height: size, borderRadius: '50%', border: `1.5px solid ${accent}`, background: `${accent}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${accent}25` }}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M5 11 L9.5 15.5 L17 7" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="28" style={{ animation: 'check-draw 1.2s ease-out 0.2s infinite alternate' }}/>
      </svg>
    </div>
  );

  if (icon === 'fill') return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <rect x="10" y="6" width="24" height="32" rx="5" stroke={accent} strokeWidth="1.5"/>
      <line x1="15" y1="14" x2="29" y2="14" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <line x1="15" y1="19" x2="29" y2="19" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <rect x="14" y="24" width="16" height="0" rx="2" fill={accent} style={{ animation: 'doc-fill 1.6s ease-in-out infinite alternate', transformOrigin: 'bottom' }} opacity="0.7"/>
      <circle cx="35" cy="34" r="7" fill={`${accent}20`} stroke={accent} strokeWidth="1.5"/>
      <path d="M32 34 L34.5 36.5 L38 31.5" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  if (icon === 'keys') return (
    <div style={{ animation: 'float-up 2.8s ease-in-out infinite' }}>
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
        <circle cx="15" cy="18" r="8" stroke={accent} strokeWidth="1.5" fill={`${accent}12`}/>
        <circle cx="15" cy="18" r="4" stroke={accent} strokeWidth="1.2" opacity="0.5"/>
        <line x1="21" y1="24" x2="36" y2="36" stroke={accent} strokeWidth="2" strokeLinecap="round" style={{ animation: 'key-spin 2.5s ease-in-out infinite', transformOrigin: '21px 24px' }}/>
        <rect x="28" y="28" width="5" height="3" rx="1" stroke={accent} strokeWidth="1.2" fill={`${accent}20`}/>
        <rect x="32" y="32" width="4" height="3" rx="1" stroke={accent} strokeWidth="1.2" fill={`${accent}20`}/>
        <path d="M8 30 L18 38" stroke={accent} strokeWidth="1" strokeLinecap="round" opacity="0.2"/>
        <text x="3" y="42" style={{ fontFamily: 'var(--font-barlow-cond)', fontSize: 8, fill: accent, opacity: 0.7, letterSpacing: '0.05em' } as React.CSSProperties}>$50</text>
      </svg>
    </div>
  );

  return null;
}
