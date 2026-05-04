import Link from 'next/link';

const A = 'oklch(0.55 0.22 18)';
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif';
const SFD = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';

const STEPS = [
  {
    n: '01',
    title: 'Browse real deals',
    body: 'Every deal is posted by a verified dealer or broker. Monthly payments are real, not click-bait teasers.',
    accent: true,
  },
  {
    n: '02',
    title: 'Find your match',
    body: 'Filter by make, payment, term, location. Save favorites and compare side-by-side.',
    accent: false,
  },
  {
    n: '03',
    title: 'Apply directly',
    body: 'Submit your credit application on the dealer\'s portal — or through Leased. One short form, no spam.',
    accent: false,
  },
  {
    n: '04',
    title: 'Drive it home',
    body: 'Get approved, sign the paperwork at the dealership, drive away in your new car. That\'s it.',
    accent: false,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '80px 24px', background: '#0a0a0a', color: 'white' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)',
            padding: '6px 12px', borderRadius: 999,
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
          }}>
            02 — How it works
          </div>
          <h2 className="lz-hiw-h2" style={{
            fontSize: 'clamp(28px, 5vw, 72px)',
            lineHeight: 1,
            margin: '16px 0 12px',
            letterSpacing: '-0.03em',
            fontWeight: 600,
            fontFamily: SFD,
            color: 'white',
          }}>
            From browsing to driving in <span style={{ fontStyle: 'italic', color: A }}>four steps</span>.
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, maxWidth: 560, fontFamily: SF, margin: 0 }}>
            We sit between shoppers and dealers — never in the way. The numbers you see are the numbers you pay.
          </p>
        </div>

        {/* 4-step grid */}
        <div className="lz-hiw-grid">
          {STEPS.map((s, i) => (
            <div key={s.n} style={{
              padding: 24,
              borderRadius: 22,
              background: i === 0 ? A : 'rgba(255,255,255,0.04)',
              border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)',
              minHeight: 240,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div style={{
                fontFamily: SFD,
                fontSize: 60,
                lineHeight: 0.9,
                letterSpacing: '-0.02em',
                opacity: i === 0 ? 0.95 : 0.4,
                fontStyle: 'italic',
                color: 'white',
                fontWeight: 600,
              }}>
                {s.n}
              </div>
              <div>
                <div style={{
                  fontSize: 19, fontWeight: 600, marginBottom: 8,
                  letterSpacing: '-0.015em', fontFamily: SFD, color: 'white',
                }}>
                  {s.title}
                </div>
                <div style={{
                  fontSize: 13,
                  color: i === 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.6)',
                  lineHeight: 1.5,
                  fontFamily: SF,
                }}>
                  {s.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
