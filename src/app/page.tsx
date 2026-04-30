import Nav from '@/components/Nav';
import Ticker from '@/components/Ticker';
import { SearchBar, BudgetAndLane, FeaturedCardWrapper } from '@/components/HomepageInteractive';
import HomepageDeals from '@/components/HomepageDeals';
import HowItWorks from '@/components/HowItWorks';
import { DEALS, DEALS_BY_CATEGORY, STATS, TICKER_DEALS } from '@/lib/data';

export default function Home() {
  const featured = DEALS.find(d => d.featured) || DEALS[0];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <Nav />
      <Ticker deals={TICKER_DEALS} />

      {/* Hero */}
      <main style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '64px 40px 72px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 48,
      }}>
        {/* Left column */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 20 }}>
            <span
              className="pulse-dot"
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#FF2800', display: 'inline-block',
                marginTop: 3, flexShrink: 0,
              }}
            />
            <span style={{
              fontFamily: 'var(--font-barlow-cond)', fontWeight: 700,
              fontSize: 11, letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', lineHeight: 1.4,
            }}>
              {STATS.liveDrops} LIVE LEASE<br />DROPS
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            lineHeight: 0.88, letterSpacing: '-0.02em', marginBottom: 20,
          }}>
            <div style={{ fontSize: 'clamp(72px, 9vw, 130px)', color: '#fff' }}>GET YOUR</div>
            <div style={{ fontSize: 'clamp(72px, 9vw, 130px)', color: '#FF2800' }}>DREAM</div>
            <div style={{
              fontSize: 'clamp(72px, 9vw, 130px)',
              color: 'transparent',
              WebkitTextStroke: '2px rgba(255,255,255,0.25)',
            }}>
              LEASE.
            </div>
          </h1>

          <p style={{
            fontFamily: 'var(--font-barlow)', fontWeight: 400, fontSize: 15,
            lineHeight: 1.7, color: 'rgba(255,255,255,0.45)',
            maxWidth: 480, marginBottom: 36,
          }}>
            Vetted brokers post live lease drops. Filter by budget. Strike before
            the timer hits zero. No spam, no bait, no DM chains. Just the deal.
          </p>

          <SearchBar />

          <div style={{ display: 'flex', gap: 40 }}>
            {[
              { value: `${STATS.liveDrops}+`, label: 'LIVE\nDROPS', red: false },
              { value: String(STATS.zeroDown), label: 'ZERO\nDOWN', red: false },
              { value: `$${STATS.startingFrom}`, label: 'STARTING /\nMO', red: true },
            ].map(({ value, label, red }) => (
              <div key={label}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 36,
                  color: red ? '#FF2800' : '#fff', letterSpacing: '-0.03em',
                  lineHeight: 1, marginBottom: 4,
                }}>
                  {value}
                </div>
                <div style={{
                  fontFamily: 'var(--font-barlow-cond)', fontWeight: 600, fontSize: 10,
                  letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)',
                  whiteSpace: 'pre-line', lineHeight: 1.4,
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <FeaturedCardWrapper deal={featured} />
      </main>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />

      {/* Live deal categories */}
      <div style={{ padding: '56px 0 0' }}>
        <HomepageDeals dealsByCategory={DEALS_BY_CATEGORY} />
      </div>

      {/* How It Works */}
      <HowItWorks />

      {/* Budget + Lane */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <BudgetAndLane />
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '24px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontFamily: 'var(--font-barlow-cond)', fontWeight: 500,
        fontSize: 10, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.15)',
      }}>
        LEASED · Prices reflect estimated monthly payments. Terms vary by dealer. ©2025
      </footer>
    </div>
  );
}
