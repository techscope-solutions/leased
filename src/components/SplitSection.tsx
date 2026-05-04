import Link from 'next/link';

const A = 'oklch(0.55 0.22 18)';
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif';
const SFD = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export default function SplitSection() {
  return (
    <section style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto' }}>
      <div className="lz-split-grid">
        {/* For shoppers — dark */}
        <div style={{
          padding: 36, borderRadius: 28,
          background: '#0a0a0a', color: 'white',
          minHeight: 460, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
              padding: '6px 12px', borderRadius: 999,
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            }}>
              For shoppers
            </div>
            <h3 style={{
              fontSize: 48, lineHeight: 1, margin: '20px 0 28px',
              letterSpacing: '-0.03em', fontWeight: 600,
              fontFamily: SFD, color: 'white',
            }}>
              Skip the dealership{' '}
              <span style={{ fontStyle: 'italic', color: A }}>dance.</span>
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'See real monthly payments, not "starting at" teasers',
                'Apply on dealer portal or one Leased application',
                'No spam calls. Ever. We don\'t sell your info.',
                'Side-by-side comparisons across dealers',
              ].map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, fontSize: 15, lineHeight: 1.4, color: 'rgba(255,255,255,0.85)', fontFamily: SF }}>
                  <span style={{ flexShrink: 0, marginTop: 2, color: A }}><CheckIcon /></span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <Link href="/browse" style={{ textDecoration: 'none', alignSelf: 'flex-start', marginTop: 32 }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 22px', borderRadius: 999, fontWeight: 500, fontSize: 15,
              border: 'none', cursor: 'pointer',
              background: 'white', color: '#0a0a0a', fontFamily: SF,
              transition: 'transform 0.15s ease',
            }}>
              Browse deals <ArrowIcon />
            </button>
          </Link>
        </div>

        {/* For dealers — light */}
        <div style={{
          padding: 36, borderRadius: 28,
          background: '#efece6', color: '#0a0a0a',
          minHeight: 460, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(10,10,10,0.06)', color: 'rgba(10,10,10,0.7)',
              padding: '6px 12px', borderRadius: 999,
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            }}>
              For dealers & brokers
            </div>
            <h3 style={{
              fontSize: 48, lineHeight: 1, margin: '20px 0 28px',
              letterSpacing: '-0.03em', fontWeight: 600,
              fontFamily: SFD, color: '#0a0a0a',
            }}>
              Post once, reach{' '}
              <span style={{ fontStyle: 'italic' }}>real</span> buyers.
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                'Free to post. Free to publish multiple deals.',
                'Buyers apply on YOUR portal — you keep the relationship',
                'Or use our application form, get pre-qualified leads',
                '90-second listing flow. Update inventory daily.',
              ].map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, fontSize: 15, lineHeight: 1.4, color: 'rgba(10,10,10,0.8)', fontFamily: SF }}>
                  <span style={{ flexShrink: 0, marginTop: 2, color: A }}><CheckIcon /></span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <Link href="/seller/deals/new" style={{ textDecoration: 'none', alignSelf: 'flex-start', marginTop: 32 }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 22px', borderRadius: 999, fontWeight: 500, fontSize: 15,
              border: 'none', cursor: 'pointer',
              background: '#0a0a0a', color: 'white', fontFamily: SF,
              transition: 'transform 0.15s ease',
            }}>
              Post a deal <ArrowIcon />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
