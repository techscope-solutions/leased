import Link from 'next/link';
import SupportForm from '@/components/SupportForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support — LEASED',
  description: 'Get help with your lease, account, or anything else.',
};

export default function SupportPage() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
      {/* Nav */}
      <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, letterSpacing: '0.04em', color: '#fff' }}>
            LEASED<span style={{ color: '#FF2800' }}>.</span>
          </span>
        </Link>
        <Link href="/browse" style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
          BROWSE DEALS
        </Link>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '60px 24px 100px' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
            HELP & SUPPORT
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-0.025em', lineHeight: 0.93, color: '#fff', marginBottom: 14 }}>
            HOW CAN WE <span style={{ color: '#FF2800' }}>HELP?</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
            Having an issue with a deal, your account, or anything else? Fill out the form below and we&apos;ll get back to you within 24 hours.
          </p>
        </div>

        <SupportForm />
      </div>
    </div>
  );
}
