import Link from 'next/link';

const A = 'oklch(0.55 0.22 18)';
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';

export default function HeroSpotlight() {
  return (
    <section style={{ padding: '24px', maxWidth: 1280, margin: '0 auto' }}>
      <div
        className="lz-spotlight-grid"
        style={{
          position: 'relative',
          borderRadius: 28,
          overflow: 'hidden',
          background: `repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 14px),
            linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 60%, #2a0a0a 100%)`,
        }}
      >
        {/* Left: text */}
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '28px 12px 28px 28px',
        }}>
          <div>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: A, color: 'white',
              padding: '6px 12px', borderRadius: 999,
              fontSize: 12, fontWeight: 500, fontFamily: SF,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', display: 'inline-block' }} />
              Featured · Deal of the day
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(40px, 4.6vw, 68px)',
              lineHeight: 1.02,
              margin: '24px 0 0',
              letterSpacing: '-0.035em',
              fontWeight: 600,
              color: 'white',
              fontFamily: SF,
              maxWidth: 520,
            }}>
              Lease this Model 3<br />
              for <span style={{ color: A }}>$429</span>/month.
            </h1>

            <p style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.65)',
              marginTop: 20,
              maxWidth: 420,
              lineHeight: 1.5,
              fontFamily: SF,
              fontWeight: 400,
            }}>
              2026 Long Range AWD · Pearl White · posted by Coastline EV in San Diego. Updated 2 hours ago.
            </p>
          </div>

          {/* Stats + CTAs */}
          <div style={{ marginTop: 32 }}>
            <div style={{
              display: 'flex',
              gap: 32,
              color: 'rgba(255,255,255,0.7)',
              fontSize: 13,
              marginBottom: 24,
              fontFamily: SF,
            }}>
              {[
                { val: '36 mo', label: 'term' },
                { val: '$2,999', label: 'due at signing' },
                { val: '10k', label: 'miles/yr' },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div style={{ fontSize: 28, color: 'white', lineHeight: 1, fontWeight: 600, letterSpacing: '-0.02em', fontFamily: SF }}>
                    {val}
                  </div>
                  <div style={{ marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/browse" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 22px', borderRadius: 999,
                  fontWeight: 500, fontSize: 15, border: 'none', cursor: 'pointer',
                  background: 'white', color: '#0a0a0a', fontFamily: SF,
                  transition: 'transform 0.15s ease',
                }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.transform = ''; }}
                >
                  Apply now
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                </button>
              </Link>
              <Link href="/browse" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 22px', borderRadius: 999,
                  fontWeight: 500, fontSize: 15, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.12)', color: 'white',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontFamily: SF,
                }}>
                  Browse all deals
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Tesla image card */}
        <div
          className="lz-spotlight-image"
          style={{ position: 'relative', borderRadius: 18, overflow: 'hidden' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-tesla.png"
            alt="2026 Tesla Model 3"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
            }}
          />
          <div style={{
            position: 'absolute', top: 16, left: 16, right: 16,
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 999,
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)',
              color: 'white', fontSize: 12, fontWeight: 500, fontFamily: SF,
            }}>⚡ EV</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 999,
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)',
              color: 'white', fontSize: 12, fontWeight: 500, fontFamily: SF,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: A, display: 'inline-block' }} />
              Posted 2h ago
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
