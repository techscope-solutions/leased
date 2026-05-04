import Link from 'next/link';

const A = 'oklch(0.55 0.22 18)';
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif';
const SFD = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';

export default function CTASection() {
  return (
    <section style={{ padding: '40px 24px 80px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{
        position: 'relative',
        borderRadius: 28,
        overflow: 'hidden',
        padding: '72px 56px',
        background: `linear-gradient(135deg, ${A} 0%, color-mix(in oklab, ${A} 75%, black) 100%)`,
        color: 'white',
      }}>
        {/* Diagonal lines texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.4,
          background: `repeating-linear-gradient(135deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 18px)`,
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: 48,
          alignItems: 'end',
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.18)', color: 'white',
              backdropFilter: 'blur(10px)',
              padding: '6px 12px', borderRadius: 999,
              fontFamily: SF, fontSize: 12, fontWeight: 500,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'white', display: 'inline-block' }} />
              Free to start
            </div>
            <h2 style={{
              fontSize: 'clamp(48px, 6vw, 88px)',
              lineHeight: 0.95,
              margin: '20px 0 0',
              letterSpacing: '-0.03em',
              fontWeight: 600,
              fontFamily: SFD,
              color: 'white',
            }}>
              Your next car<br />
              is <span style={{ fontStyle: 'italic' }}>posted</span> already.
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link href="/browse" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%',
                padding: '16px 24px', borderRadius: 999,
                border: 'none', cursor: 'pointer',
                background: 'white', color: '#0a0a0a',
                fontFamily: SF, fontWeight: 500, fontSize: 16,
                transition: 'transform 0.15s ease',
              }}>
                Browse all deals
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </button>
            </Link>
            <Link href="/seller/deals/new" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%',
                padding: '16px 24px', borderRadius: 999,
                cursor: 'pointer',
                background: 'rgba(255,255,255,0.15)', color: 'white',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.25)',
                fontFamily: SF, fontWeight: 500, fontSize: 16,
              }}>
                I&rsquo;m a dealer — post for free
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
