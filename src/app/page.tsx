import Nav from '@/components/Nav';
import HeroSpotlight from '@/components/HeroSpotlight';
import BrandMarquee from '@/components/BrandMarquee';
import HomepageDeals from '@/components/HomepageDeals';
import HowItWorks from '@/components/HowItWorks';
import SplitSection from '@/components/SplitSection';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import { getLiveDealsByCategory } from '@/lib/deals';
import Link from 'next/link';

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif';

export default async function Home() {
  const dealsByCategory = await getLiveDealsByCategory();

  return (
    <div style={{
      background: '#f7f5f2',
      minHeight: '100vh',
      color: '#0a0a0a',
      fontFamily: SF,
      WebkitFontSmoothing: 'antialiased',
    }}>
      <Nav light />

      <HeroSpotlight />
      <BrandMarquee />
      <HomepageDeals dealsByCategory={dealsByCategory} />
      <HowItWorks />
      <SplitSection />
      <Testimonials />
      <CTASection />

      {/* Footer */}
      <footer style={{ padding: '48px 24px 32px', borderTop: '1px solid rgba(10,10,10,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="lz-footer-grid">
            <div>
              {/* Logo */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#0a0a0a', fontWeight: 600, fontSize: 22, letterSpacing: '-0.03em', fontFamily: SF }}>
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="13" stroke="#0a0a0a" strokeWidth="1.5" />
                  <path d="M9 9h10M9 14h10M9 19h6" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span style={{ fontStyle: 'italic', fontSize: 24, letterSpacing: '-0.02em' }}>Leased</span>
              </span>
              <p style={{ fontSize: 13, color: 'rgba(10,10,10,0.55)', marginTop: 12, maxWidth: 280, lineHeight: 1.5, fontFamily: SF }}>
                The lease marketplace where dealers post real deals and shoppers apply directly. No phone tag.
              </p>
            </div>
            {[
              { h: 'Shop', i: ['Browse deals', 'Get pre-qualified', 'Apply'] },
              { h: 'Dealers', i: ['Post a deal', 'Pricing', 'Dealer login'] },
              { h: 'Company', i: ['About', 'Careers', 'Contact'] },
              { h: 'Legal', i: ['Privacy', 'Terms', 'Cookies'] },
            ].map(col => (
              <div key={col.h}>
                <div style={{
                  fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                  fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                  color: 'rgba(10,10,10,0.45)', marginBottom: 14,
                }}>
                  {col.h}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {col.i.map(item => (
                    <li key={item} style={{ fontSize: 13, color: 'rgba(10,10,10,0.7)', fontFamily: SF }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 32, paddingTop: 20,
            borderTop: '1px solid rgba(10,10,10,0.08)',
            display: 'flex', justifyContent: 'space-between',
            fontSize: 12, color: 'rgba(10,10,10,0.4)',
            fontFamily: SF,
            flexWrap: 'wrap', gap: 8,
          }}>
            <span>© 2026 Leased, Inc.</span>
            <span style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontSize: 11 }}>
              Made for shoppers, not for spam.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
