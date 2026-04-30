import Nav from '@/components/Nav';
import Ticker from '@/components/Ticker';
import HeroSlideshow from '@/components/HeroSlideshow';
import HeroCTA from '@/components/HeroCTA';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import { DEALS_BY_CATEGORY, STATS, TICKER_DEALS } from '@/lib/data';

export default function Home() {
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
      <section style={{
        position: 'relative',
        minHeight: 'calc(100vh - 86px)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Bottom gradient — hero fades into the page */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
          background: 'linear-gradient(to top, #070707, transparent)',
          zIndex: 10, pointerEvents: 'none',
        }} />

        {/* Inner layout */}
        <div style={{
          maxWidth: 1320,
          width: '100%',
          margin: '0 auto',
          padding: '0 48px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 0,
          alignItems: 'center',
          position: 'relative',
          zIndex: 5,
        }}>

          {/* Left — text, overlaid above the fan */}
          <div style={{ paddingRight: 48, position: 'relative', zIndex: 6 }}>
            {/* Live pill */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
              borderRadius: 99, padding: '6px 16px', marginBottom: 36,
            }}>
              <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF2800', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.55)' }}>
                {STATS.liveDrops} LIVE DROPS
              </span>
            </div>

            {/* 2-line headline */}
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, lineHeight: 0.88, letterSpacing: '-0.025em', marginBottom: 28 }}>
              <div style={{ fontSize: 'clamp(60px, 7.5vw, 108px)', color: '#fff' }}>
                GET YOUR
              </div>
              <div style={{
                fontSize: 'clamp(60px, 7.5vw, 108px)',
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
              lineHeight: 1.7, color: 'rgba(255,255,255,0.35)',
              maxWidth: 380, marginBottom: 44, letterSpacing: '0.01em',
            }}>
              Vetted brokers. Live countdowns.<br/>Strike before the timer hits zero.
            </p>

            {/* CTA — sits in front of text visually (highest z) */}
            <HeroCTA />
          </div>

          {/* Right — fanned glass slideshow */}
          <div style={{ position: 'relative', height: 560, zIndex: 4 }}>
            <HeroSlideshow deals={heroDeals} />
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
