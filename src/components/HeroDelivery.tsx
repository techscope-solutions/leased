'use client';

export default function HeroDelivery() {
  return (
    <>
      <style>{`
        @keyframes hd-car-arrive {
          0%   { transform: translateX(60px); opacity: 0; }
          100% { transform: translateX(0);    opacity: 1; }
        }
        @keyframes hd-glow-pulse {
          0%, 100% { opacity: 0.5; transform: scaleX(1); }
          50%       { opacity: 1;   transform: scaleX(1.12); }
        }
        @keyframes hd-contract-in {
          0%   { transform: translateY(-18px) rotate(-3deg); opacity: 0; }
          100% { transform: translateY(0)     rotate(-3deg); opacity: 1; }
        }
        @keyframes hd-sig-draw {
          0%   { stroke-dashoffset: 160; opacity: 0; }
          8%   { opacity: 1; }
          55%  { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes hd-stamp {
          0%, 45% { transform: scale(0) rotate(-15deg); opacity: 0; }
          60%     { transform: scale(1.15) rotate(-8deg); opacity: 1; }
          70%, 100% { transform: scale(1) rotate(-8deg); opacity: 1; }
        }
        @keyframes hd-keys-in {
          0%   { transform: translateX(24px) rotate(-20deg); opacity: 0; }
          100% { transform: translateX(0)    rotate(-8deg);  opacity: 1; }
        }
        @keyframes hd-keys-float {
          0%, 100% { transform: translateY(0) rotate(-8deg); }
          50%       { transform: translateY(-6px) rotate(-4deg); }
        }
        @keyframes hd-tag-in {
          0%   { transform: scaleX(0); opacity: 0; transform-origin: left; }
          100% { transform: scaleX(1); opacity: 1; transform-origin: left; }
        }
        @keyframes hd-hand-sign {
          0%   { transform: translate(0, 0) rotate(-8deg); }
          40%  { transform: translate(38px, -4px) rotate(-8deg); }
          80%  { transform: translate(60px, 2px) rotate(-8deg); }
          100% { transform: translate(72px, 0) rotate(-8deg); }
        }
        @keyframes hd-fade-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes hd-particle {
          0%   { transform: translate(0,0); opacity: 0.7; }
          100% { transform: translate(var(--px), var(--py)); opacity: 0; }
        }
        @keyframes hd-status-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>

      <div style={{
        position: 'relative',
        width: '100%',
        height: 560,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}>

        {/* Ambient background glow */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '120%', height: '55%',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255,40,0,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* ── Contract card ── */}
        <div style={{
          position: 'absolute', top: 0, right: 24,
          width: 200,
          background: 'rgba(14,14,14,0.92)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 16,
          padding: '16px 18px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          animation: 'hd-contract-in 0.8s cubic-bezier(0.23,1,0.32,1) 0.3s both',
          zIndex: 10,
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect width="14" height="14" rx="3" fill="rgba(255,40,0,0.2)" stroke="rgba(255,40,0,0.5)" strokeWidth="0.8"/>
              <rect x="3" y="4" width="8" height="1" rx="0.5" fill="#FF2800" opacity="0.8"/>
              <rect x="3" y="6.5" width="6" height="1" rx="0.5" fill="rgba(255,255,255,0.3)"/>
              <rect x="3" y="9" width="7" height="1" rx="0.5" fill="rgba(255,255,255,0.3)"/>
            </svg>
            <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.7)' }}>LEASE AGREEMENT</span>
          </div>

          {/* Redacted lines */}
          {[80, 100, 65, 90, 55].map((w, i) => (
            <div key={i} style={{ height: 4, width: `${w}%`, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 6 }} />
          ))}

          {/* Vehicle line */}
          <div style={{ marginTop: 10, marginBottom: 14 }}>
            <div style={{ fontFamily: 'var(--font-barlow-cond)', fontSize: 8, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>VEHICLE</div>
            <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>2024 BMW M3</div>
            <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 10, color: '#FF2800' }}>$1,350 / MONTH</div>
          </div>

          {/* Signature field */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 10, position: 'relative' }}>
            <div style={{ fontFamily: 'var(--font-barlow-cond)', fontSize: 8, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', marginBottom: 6 }}>SIGNATURE</div>
            <div style={{ position: 'relative', height: 34, overflow: 'hidden' }}>
              {/* Signature SVG path */}
              <svg width="164" height="34" viewBox="0 0 164 34" style={{ position: 'absolute', top: 0, left: 0 }}>
                <path
                  d="M4 22 C12 22 14 10 22 12 C30 14 28 28 36 26 C44 24 42 8 52 10 C58 11 56 24 64 22 C70 20 72 16 78 18 C86 21 84 14 92 12 C100 10 100 26 108 24 C114 23 114 16 120 18 C128 22 126 10 136 8 C142 7 142 22 150 20 C156 19 158 14 164 16"
                  stroke="rgba(255,255,255,0.75)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="160"
                  style={{
                    animation: 'hd-sig-draw 2.2s cubic-bezier(0.4,0,0.2,1) 1.2s both',
                  }}
                />
              </svg>
              {/* Signing hand */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0,
                animation: 'hd-hand-sign 2.2s cubic-bezier(0.4,0,0.2,1) 1.2s both',
              }}>
                <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
                  <path d="M8 22 C6 18 5 12 7 8 C8 5 11 4 12 6 C13 8 12 12 13 16" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M13 16 C14 14 16 13 17 15 C18 17 16 20 14 22" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M14 22 L20 20" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="20" cy="20" r="1.5" fill="rgba(255,255,255,0.4)"/>
                </svg>
              </div>
            </div>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.15)', marginTop: 2 }} />
          </div>

          {/* SIGNED stamp */}
          <div style={{
            position: 'absolute', top: 48, right: 12,
            border: '2px solid rgba(34,197,94,0.7)',
            borderRadius: 6, padding: '3px 8px',
            fontFamily: 'var(--font-barlow-cond)', fontWeight: 900,
            fontSize: 11, letterSpacing: '0.18em',
            color: 'rgba(34,197,94,0.9)',
            transform: 'rotate(-8deg)',
            animation: 'hd-stamp 3s cubic-bezier(0.23,1,0.32,1) 1.2s both',
          }}>
            SIGNED ✓
          </div>
        </div>

        {/* ── Keys card ── */}
        <div style={{
          position: 'absolute', top: 60, left: 16,
          background: 'rgba(12,12,12,0.9)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14, padding: '14px 16px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(20px)',
          animation: 'hd-keys-in 0.7s cubic-bezier(0.23,1,0.32,1) 2.8s both',
          zIndex: 10,
        }}>
          {/* Key SVG */}
          <div style={{ animation: 'hd-keys-float 3s ease-in-out 3.5s infinite' }}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              {/* Key fob body */}
              <rect x="2" y="14" width="32" height="24" rx="8" fill="rgba(30,30,30,0.95)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
              <rect x="6" y="18" width="24" height="8" rx="2" fill="rgba(255,40,0,0.15)" stroke="rgba(255,40,0,0.3)" strokeWidth="0.8"/>
              <rect x="8" y="19.5" width="5" height="5" rx="1" fill="rgba(255,40,0,0.6)"/>
              <rect x="15" y="19.5" width="5" height="5" rx="1" fill="rgba(255,255,255,0.15)"/>
              <rect x="22" y="19.5" width="5" height="5" rx="1" fill="rgba(255,255,255,0.15)"/>
              <rect x="6" y="29" width="24" height="4" rx="1.5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
              {/* Key ring */}
              <circle cx="18" cy="10" r="5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none"/>
              <line x1="18" y1="14" x2="18" y2="15" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
              {/* Physical key */}
              <line x1="32" y1="26" x2="50" y2="26" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"/>
              <rect x="40" y="22" width="3" height="4" rx="1" fill="rgba(255,255,255,0.4)"/>
              <rect x="45" y="23" width="2" height="5" rx="0.5" fill="rgba(255,255,255,0.3)"/>
              <circle cx="50" cy="26" r="1.5" fill="rgba(255,255,255,0.4)"/>
              {/* Glow behind fob */}
              <ellipse cx="18" cy="38" rx="12" ry="3" fill="rgba(255,40,0,0.15)" style={{ filter: 'blur(3px)' }}/>
            </svg>
          </div>
          <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 8, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: 4 }}>YOUR KEYS</div>
        </div>

        {/* ── Status pill ── */}
        <div style={{
          position: 'absolute', top: 180, left: 16,
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.25)',
          borderRadius: 99, padding: '6px 14px',
          animation: 'hd-tag-in 0.5s cubic-bezier(0.23,1,0.32,1) 3.4s both',
          zIndex: 10,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'hd-status-blink 1.8s ease-in-out 3.5s infinite' }} />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 9, letterSpacing: '0.14em', color: '#22c55e' }}>DELIVERY CONFIRMED</span>
        </div>

        {/* ── Car ── */}
        <div style={{
          width: '100%',
          paddingBottom: 40,
          position: 'relative',
          animation: 'hd-car-arrive 1.1s cubic-bezier(0.23,1,0.32,1) 0.1s both',
        }}>
          {/* Car SVG — luxury sedan */}
          <svg viewBox="0 0 560 200" width="100%" fill="none" style={{ display: 'block', filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.7))' }}>
            <defs>
              <radialGradient id="hd-body-grad" cx="50%" cy="30%" r="70%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.18)"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0.04)"/>
              </radialGradient>
              <radialGradient id="hd-underglow" cx="50%" cy="0%" r="50%">
                <stop offset="0%" stopColor="rgba(255,40,0,0.9)"/>
                <stop offset="100%" stopColor="rgba(255,40,0,0)"/>
              </radialGradient>
            </defs>

            {/* Ground underglow */}
            <ellipse cx="280" cy="188" rx="220" ry="14" fill="url(#hd-underglow)" opacity="0.6"
              style={{ animation: 'hd-glow-pulse 2.5s ease-in-out 1s infinite' }} />

            {/* Ground shadow */}
            <ellipse cx="280" cy="185" rx="200" ry="8" fill="rgba(0,0,0,0.5)" style={{ filter: 'blur(4px)' }}/>

            {/* Body main */}
            <path d="M60 130 L60 104 L96 60 L180 44 L372 44 L444 60 L500 104 L500 130 Z"
              fill="rgba(18,18,24,0.95)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
            <path d="M60 130 L60 104 L96 60 L180 44 L372 44 L444 60 L500 104 L500 130 Z"
              fill="url(#hd-body-grad)" opacity="0.6"/>

            {/* Roofline */}
            <path d="M140 44 L172 16 L364 16 L412 44" fill="rgba(14,14,20,0.98)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            <path d="M140 44 L172 16 L364 16 L412 44" fill="url(#hd-body-grad)" opacity="0.4"/>

            {/* Windshield */}
            <path d="M148 42 L176 18 L280 18 L280 42 Z" fill="rgba(120,180,255,0.08)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
            {/* Rear glass */}
            <path d="M300 18 L356 18 L400 42 L300 42 Z" fill="rgba(120,180,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"/>

            {/* Door line */}
            <line x1="270" y1="44" x2="275" y2="130" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>

            {/* Door handles */}
            <rect x="200" y="86" width="22" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>
            <rect x="298" y="86" width="22" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>

            {/* Sill */}
            <rect x="80" y="126" width="400" height="8" rx="2" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>

            {/* Front headlight */}
            <path d="M494 80 L510 88 L510 98 L494 102 Z" fill="rgba(255,220,180,0.9)" style={{ filter: 'drop-shadow(0 0 8px rgba(255,220,180,0.8))' }}/>
            <path d="M500 95 L520 88 L530 95 L520 102 Z" fill="rgba(255,220,180,0.5)" opacity="0.6"/>

            {/* DRL strip */}
            <path d="M470 76 L500 80" stroke="rgba(255,220,180,0.6)" strokeWidth="2.5" strokeLinecap="round"/>

            {/* Rear taillight */}
            <path d="M60 82 L46 88 L46 102 L60 104 Z" fill="rgba(255,40,0,0.85)" style={{ filter: 'drop-shadow(0 0 6px rgba(255,40,0,0.9))' }}/>
            <path d="M60 92 L52 95 L52 100 L60 100 Z" fill="rgba(255,80,60,0.9)"/>

            {/* Front wheel */}
            <circle cx="418" cy="148" r="38" fill="rgba(8,8,8,0.98)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
            <circle cx="418" cy="148" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
            <circle cx="418" cy="148" r="14" fill="rgba(20,20,20,0.9)" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
            {[0,60,120,180,240,300].map(a => (
              <line key={a}
                x1={418 + 16 * Math.cos(a * Math.PI / 180)}
                y1={148 + 16 * Math.sin(a * Math.PI / 180)}
                x2={418 + 26 * Math.cos(a * Math.PI / 180)}
                y2={148 + 26 * Math.sin(a * Math.PI / 180)}
                stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"
              />
            ))}
            <circle cx="418" cy="148" r="4" fill="rgba(255,255,255,0.3)"/>

            {/* Rear wheel */}
            <circle cx="154" cy="148" r="38" fill="rgba(8,8,8,0.98)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
            <circle cx="154" cy="148" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
            <circle cx="154" cy="148" r="14" fill="rgba(20,20,20,0.9)" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
            {[0,60,120,180,240,300].map(a => (
              <line key={a}
                x1={154 + 16 * Math.cos(a * Math.PI / 180)}
                y1={148 + 16 * Math.sin(a * Math.PI / 180)}
                x2={154 + 26 * Math.cos(a * Math.PI / 180)}
                y2={148 + 26 * Math.sin(a * Math.PI / 180)}
                stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"
              />
            ))}
            <circle cx="154" cy="148" r="4" fill="rgba(255,255,255,0.3)"/>

            {/* Grille */}
            <path d="M486 110 L514 104 L516 118 L486 122 Z" fill="rgba(14,14,14,0.9)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
            {[113,117,121].map(y => (
              <line key={y} x1="488" y1={y - 2} x2="514" y2={y - 4} stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/>
            ))}

            {/* Badge (front) */}
            <circle cx="500" cy="112" r="5" fill="rgba(20,20,20,0.9)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
            <text x="500" y="115" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="5" fontWeight="bold">M</text>

            {/* Roof shine */}
            <path d="M190 22 L340 22" stroke="rgba(255,255,255,0.12)" strokeWidth="3" strokeLinecap="round" style={{ filter: 'blur(1px)' }}/>

            {/* Body highlight */}
            <path d="M100 90 L480 90" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        {/* ── Delivery tag ── */}
        <div style={{
          position: 'absolute', bottom: 32, right: 20,
          background: 'rgba(12,12,12,0.9)',
          border: '1px solid rgba(255,40,0,0.3)',
          borderRadius: 10, padding: '8px 14px',
          backdropFilter: 'blur(16px)',
          animation: 'hd-fade-float 4s ease-in-out 2s infinite, hd-contract-in 0.6s cubic-bezier(0.23,1,0.32,1) 2.2s both',
          zIndex: 10,
        }}>
          <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 8, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>DELIVER TO</div>
          <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 12, color: '#fff' }}>YOU.</div>
        </div>

      </div>
    </>
  );
}
