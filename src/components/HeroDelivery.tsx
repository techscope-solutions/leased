'use client';

export default function HeroDelivery() {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <style>{`
        @keyframes hd-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hd-badge {
          from { opacity: 0; transform: translateX(-14px) scale(0.92); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes hd-float-a {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes hd-float-b {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes hd-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.25; }
        }
        @keyframes hd-stamp {
          0%, 52% { opacity: 0; transform: scale(0.45) rotate(-12deg); }
          68%     { opacity: 1; transform: scale(1.08) rotate(-8deg); }
          80%, 100% { opacity: 1; transform: scale(1) rotate(-8deg); }
        }
        @keyframes hd-glow {
          0%, 100% { opacity: 0.28; }
          50%       { opacity: 0.65; }
        }
      `}</style>

      {/* Ambient red glow behind scene */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 55% 45% at 58% 72%, rgba(255,40,0,0.09) 0%, transparent 70%)',
      }} />

      {/* ── Floating: DELIVERY CONFIRMED ── */}
      <div style={{
        position: 'absolute', top: 72, left: 12,
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(10,10,13,0.94)',
        border: '1px solid rgba(34,197,94,0.26)',
        borderRadius: 99, padding: '9px 18px',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 8px 36px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
        animation: 'hd-badge 0.55s cubic-bezier(0.23,1,0.32,1) 1.3s both, hd-float-a 4.8s ease-in-out 2s infinite',
        zIndex: 4,
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block',
          animation: 'hd-blink 2s ease-in-out 2s infinite',
        }} />
        <span style={{
          fontFamily: 'var(--font-barlow-cond)', fontWeight: 700,
          fontSize: 10, letterSpacing: '0.14em', color: '#22c55e',
        }}>DELIVERY CONFIRMED</span>
      </div>

      {/* ── Floating: savings stat ── */}
      <div style={{
        position: 'absolute', bottom: 116, left: 12,
        background: 'rgba(10,10,13,0.94)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 16, padding: '13px 18px',
        backdropFilter: 'blur(24px)',
        boxShadow: '0 8px 36px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)',
        animation: 'hd-badge 0.55s cubic-bezier(0.23,1,0.32,1) 1.7s both, hd-float-b 5.5s ease-in-out 2.5s infinite',
        zIndex: 4, minWidth: 116,
      }}>
        <div style={{
          fontFamily: 'var(--font-barlow-cond)', fontSize: 8,
          letterSpacing: '0.14em', color: 'rgba(255,255,255,0.28)', marginBottom: 5,
        }}>SAVINGS VS RETAIL</div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 28, color: '#FF2800', letterSpacing: '-0.03em', lineHeight: 1,
        }}>−$340</div>
        <div style={{
          fontFamily: 'var(--font-barlow-cond)', fontSize: 8,
          color: 'rgba(255,255,255,0.22)', letterSpacing: '0.08em', marginTop: 4,
        }}>PER MONTH</div>
      </div>

      {/* ── Main deal card ── */}
      <div style={{
        width: 320,
        background: 'rgba(10,10,13,0.97)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 40px 100px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.07)',
        animation: 'hd-in 0.85s cubic-bezier(0.23,1,0.32,1) 0.15s both',
        position: 'relative', zIndex: 3,
      }}>

        {/* ── Car image zone ── */}
        <div style={{
          height: 195, position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(158deg, #0c1324 0%, #07080e 55%, #0f0608 100%)',
        }}>
          {/* Subtle grid texture — same pattern as HowItWorks step cards */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.038,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />

          {/* Underglow pulse */}
          <div style={{
            position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
            width: '72%', height: '48%',
            background: 'radial-gradient(ellipse, rgba(255,40,0,0.2) 0%, transparent 70%)',
            animation: 'hd-glow 3.5s ease-in-out 1s infinite',
          }} />

          {/* Drop shadow under car */}
          <div style={{
            position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)',
            width: '70%', height: 10, background: 'rgba(0,0,0,0.38)',
            filter: 'blur(7px)', borderRadius: '50%',
          }} />

          {/* Car SVG — clean luxury sedan matching site's illustration style */}
          <div style={{
            position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)',
            width: '84%',
          }}>
            <svg viewBox="0 0 280 88" width="100%" fill="none">
              {/* Body */}
              <path d="M26 62 L26 45 L48 28 L88 20 L188 20 L224 28 L252 45 L252 62 Z"
                fill="rgba(20,24,36,0.96)" stroke="rgba(255,255,255,0.11)" strokeWidth="1" />
              {/* Roof */}
              <path d="M66 20 L84 7 L190 7 L210 20"
                fill="rgba(14,17,27,0.98)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
              {/* Windshield */}
              <path d="M70 20 L86 8 L140 8 L140 20 Z"
                fill="rgba(100,160,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
              {/* Rear glass */}
              <path d="M148 8 L196 8 L206 20 L148 20 Z"
                fill="rgba(100,160,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
              {/* Body highlight stripe */}
              <path d="M50 42 L244 42" stroke="rgba(255,255,255,0.044)" strokeWidth="1.5" strokeLinecap="round" />
              {/* Front headlight */}
              <path d="M246 43 L260 49 L260 58 L246 60 Z"
                fill="rgba(255,220,180,0.88)"
                style={{ filter: 'drop-shadow(0 0 6px rgba(255,220,180,0.6))' }} />
              {/* Rear taillight */}
              <path d="M26 45 L14 50 L14 58 L26 60 Z"
                fill="rgba(255,40,0,0.82)"
                style={{ filter: 'drop-shadow(0 0 5px rgba(255,40,0,0.7))' }} />
              {/* Front wheel */}
              <circle cx="208" cy="70" r="18" fill="rgba(6,6,8,0.98)" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" />
              <circle cx="208" cy="70" r="10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              {[0,60,120,180,240,300].map(a => (
                <line key={a}
                  x1={208 + 7 * Math.cos(a * Math.PI / 180)} y1={70 + 7 * Math.sin(a * Math.PI / 180)}
                  x2={208 + 12 * Math.cos(a * Math.PI / 180)} y2={70 + 12 * Math.sin(a * Math.PI / 180)}
                  stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round"
                />
              ))}
              <circle cx="208" cy="70" r="2.5" fill="rgba(255,255,255,0.22)" />
              {/* Rear wheel */}
              <circle cx="76" cy="70" r="18" fill="rgba(6,6,8,0.98)" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" />
              <circle cx="76" cy="70" r="10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              {[0,60,120,180,240,300].map(a => (
                <line key={a}
                  x1={76 + 7 * Math.cos(a * Math.PI / 180)} y1={70 + 7 * Math.sin(a * Math.PI / 180)}
                  x2={76 + 12 * Math.cos(a * Math.PI / 180)} y2={70 + 12 * Math.sin(a * Math.PI / 180)}
                  stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round"
                />
              ))}
              <circle cx="76" cy="70" r="2.5" fill="rgba(255,255,255,0.22)" />
            </svg>
          </div>

          {/* LIVE DROP badge */}
          <div style={{
            position: 'absolute', top: 13, left: 13,
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,40,0,0.1)',
            border: '1px solid rgba(255,40,0,0.28)',
            borderRadius: 99, padding: '4px 10px',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%', background: '#FF2800', display: 'inline-block',
              animation: 'hd-blink 1.4s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-barlow-cond)', fontWeight: 700,
              fontSize: 9, letterSpacing: '0.12em', color: '#FF2800',
            }}>LIVE DROP</span>
          </div>

          {/* Countdown */}
          <div style={{
            position: 'absolute', top: 13, right: 13,
            background: 'rgba(0,0,0,0.52)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 8, padding: '4px 10px',
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{
              fontFamily: 'var(--font-barlow-cond)', fontWeight: 700,
              fontSize: 11, color: 'rgba(255,255,255,0.62)', letterSpacing: '0.04em',
            }}>04:22:18</span>
          </div>
        </div>

        {/* ── Info zone ── */}
        <div style={{ padding: '18px 22px 22px', position: 'relative' }}>
          <div style={{
            fontFamily: 'var(--font-barlow)', fontSize: 10,
            color: 'rgba(255,255,255,0.26)', letterSpacing: '0.07em', marginBottom: 4,
          }}>2024 · AWD · CALIFORNIA</div>

          <div style={{
            fontFamily: 'var(--font-barlow-cond)', fontWeight: 900,
            fontSize: 21, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.1,
          }}>BMW M3 Competition</div>

          {/* Price + CTA row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 900,
                  fontSize: 46, color: '#FF2800', letterSpacing: '-0.04em', lineHeight: 1,
                }}>$1,350</span>
                <span style={{
                  fontFamily: 'var(--font-barlow-cond)', fontWeight: 600,
                  fontSize: 13, color: 'rgba(255,255,255,0.28)', marginBottom: 5,
                }}>/MO</span>
              </div>
              <div style={{
                fontFamily: 'var(--font-barlow-cond)', fontSize: 9,
                color: 'rgba(255,255,255,0.2)', letterSpacing: '0.07em', marginTop: 4,
              }}>ZERO DOWN · 36 MO · 10K MI/YR</div>
            </div>

            <button style={{
              padding: '11px 20px',
              background: '#FF2800',
              border: '1px solid rgba(255,80,40,0.4)',
              borderRadius: 12,
              fontFamily: 'var(--font-barlow-cond)', fontWeight: 800,
              fontSize: 11, letterSpacing: '0.09em', color: '#fff',
              boxShadow: '0 4px 20px rgba(255,40,0,0.38), inset 0 1px 0 rgba(255,255,255,0.15)',
              cursor: 'pointer',
            }}>APPLY →</button>
          </div>

          {/* SIGNED stamp */}
          <div style={{
            position: 'absolute', bottom: 44, right: 18,
            border: '2px solid rgba(34,197,94,0.52)',
            borderRadius: 6, padding: '3px 9px',
            fontFamily: 'var(--font-barlow-cond)', fontWeight: 900,
            fontSize: 10, letterSpacing: '0.2em', color: 'rgba(34,197,94,0.78)',
            transform: 'rotate(-8deg)',
            animation: 'hd-stamp 3.8s cubic-bezier(0.23,1,0.32,1) 0.8s both',
            pointerEvents: 'none',
          }}>SIGNED ✓</div>
        </div>
      </div>
    </div>
  );
}
