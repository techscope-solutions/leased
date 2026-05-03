import Nav from '@/components/Nav';
import Ticker from '@/components/Ticker';
import HeroCTA from '@/components/HeroCTA';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import { getLiveDeals } from '@/lib/deals';

export default async function Home() {
  const deals = await getLiveDeals();
  const tickerDeals = deals.slice(0, 6);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
      <Nav />
      <Ticker deals={tickerDeals} />

      {/* ── Hero ── */}
      <section className="r-hero-section" style={{ position: 'relative' }}>
        {/* Bottom gradient */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
          background: 'linear-gradient(to top, #070707, transparent)',
          zIndex: 10, pointerEvents: 'none',
        }} />

        {/* Inner layout */}
        <div className="r-hero-inner" style={{ maxWidth: 1320, width: '100%', margin: '0 auto', position: 'relative', zIndex: 5 }}>

          {/* Left */}
          <div className="r-hero-left" style={{ position: 'relative', zIndex: 6 }}>
            {/* 2-line headline */}
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, lineHeight: 0.88, letterSpacing: '-0.025em', marginBottom: 24 }}>
              <div style={{ fontSize: 'clamp(44px, 7.5vw, 108px)', color: '#fff' }}>
                GET YOUR
              </div>
              <div style={{
                fontSize: 'clamp(44px, 7.5vw, 108px)',
                background: 'linear-gradient(135deg, #FF2800 20%, #cc1f00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                DREAM LEASE.
              </div>
            </h1>

            {/* Tagline */}
            <p style={{
              fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 15,
              lineHeight: 1.7, color: 'rgba(255,255,255,0.5)',
              maxWidth: 380, marginBottom: 36, letterSpacing: '0.01em',
            }}>
              Vetted brokers. Live countdowns.<br/>Strike before the timer hits zero.
            </p>

            <HeroCTA />
          </div>

        </div>
      </section>

      {/* ── How It Works ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <HowItWorks />
      </div>

      {/* ── Testimonials ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Testimonials />
      </div>

      {/* ── Footer ── */}
      <footer className="r-footer" style={{
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontFamily: 'var(--font-barlow)', fontWeight: 300,
        fontSize: 11, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.18)',
      }}>
        LEASED · Prices reflect estimated monthly payments. Terms vary by dealer. ©2025
      </footer>
    </div>
  );
}
