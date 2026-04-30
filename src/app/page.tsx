import Nav from '@/components/Nav';
import Ticker from '@/components/Ticker';
import HeroSlideshow from '@/components/HeroSlideshow';
import HomepageDeals from '@/components/HomepageDeals';
import HowItWorks from '@/components/HowItWorks';
import { BudgetAndLane } from '@/components/HomepageInteractive';
import { DEALS, DEALS_BY_CATEGORY, STATS, TICKER_DEALS } from '@/lib/data';

export default function Home() {
  // One representative deal per category for the hero slideshow
  const heroDeals = [
    DEALS_BY_CATEGORY.Daily[0],
    DEALS_BY_CATEGORY.Luxury[0],
    DEALS_BY_CATEGORY.Supercar[0],
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
      <Nav />
      <Ticker deals={TICKER_DEALS} />

      {/* ── Hero ── */}
      <main style={{
        maxWidth: 1320,
        margin: '0 auto',
        padding: '72px 48px 80px',
        display: 'flex',
        alignItems: 'center',
        gap: 64,
      }}>

        {/* Left — headline + stats */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Live pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 99,
            padding: '6px 14px',
            marginBottom: 32,
          }}>
            <span className="pulse-dot" style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#FF2800', display: 'inline-block', flexShrink: 0,
            }} />
            <span style={{
              fontFamily: 'var(--font-barlow-cond)', fontWeight: 700,
              fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)',
            }}>
              {STATS.liveDrops} LIVE DROPS
            </span>
          </div>

          {/* 2-line headline */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: '-0.025em',
            marginBottom: 28,
          }}>
            <div style={{ fontSize: 'clamp(68px, 8.5vw, 118px)', color: '#fff' }}>
              GET YOUR
            </div>
            <div style={{
              fontSize: 'clamp(68px, 8.5vw, 118px)',
              color: 'transparent',
              WebkitTextStroke: '2px #FF2800',
              // Solid red fill with stroke
              background: 'linear-gradient(135deg, #FF2800 0%, #cc1f00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              DREAM LEASE.
            </div>
          </h1>

          {/* Tagline */}
          <p style={{
            fontFamily: 'var(--font-barlow)',
            fontWeight: 300,
            fontSize: 16,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.38)',
            maxWidth: 400,
            marginBottom: 48,
            letterSpacing: '0.01em',
          }}>
            Vetted brokers. Live countdowns.
            Strike before the timer hits zero.
          </p>

          {/* Glass stat pills */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { value: `${STATS.liveDrops}`, label: 'Live Drops' },
              { value: `${STATS.zeroDown}`, label: 'Zero Down' },
              { value: `$${STATS.startingFrom}/mo`, label: 'Starting From', red: true },
            ].map(({ value, label, red }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,0.045)',
                backdropFilter: 'blur(24px) saturate(160%)',
                WebkitBackdropFilter: 'blur(24px) saturate(160%)',
                border: '1px solid rgba(255,255,255,0.09)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)',
                borderRadius: 14,
                padding: '14px 22px',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 900,
                  fontSize: 28, letterSpacing: '-0.03em', lineHeight: 1,
                  color: red ? '#FF2800' : '#fff',
                  marginBottom: 4,
                }}>
                  {value}
                </div>
                <div style={{
                  fontFamily: 'var(--font-barlow)', fontWeight: 400,
                  fontSize: 11, letterSpacing: '0.04em',
                  color: 'rgba(255,255,255,0.3)',
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — glass slideshow */}
        <HeroSlideshow deals={heroDeals} />
      </main>

      {/* ── Live Deal Categories ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 56 }}>
        <HomepageDeals dealsByCategory={DEALS_BY_CATEGORY} />
      </div>

      {/* ── How It Works ── */}
      <HowItWorks />

      {/* ── Budget + Lane ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <BudgetAndLane />
      </div>

      {/* ── Footer ── */}
      <footer style={{
        textAlign: 'center', padding: '24px 40px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontFamily: 'var(--font-barlow)', fontWeight: 300,
        fontSize: 11, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.18)',
      }}>
        LEASED · Prices reflect estimated monthly payments. Terms vary by dealer. ©2025
      </footer>
    </div>
  );
}
