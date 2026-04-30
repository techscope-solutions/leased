const STEPS = [
  {
    n: '01',
    title: 'Brokers & dealers post deals',
    body: 'Vetted brokers and dealerships list their individual lease deals — new vehicles and Certified Pre-Owned. Every posting is tied to a real inventory unit.',
    icon: '◈',
  },
  {
    n: '02',
    title: 'Browse and find your match',
    body: 'Filter by budget, category, drivetrain, or location. Each deal has a live countdown — when the clock hits zero, the deal is gone.',
    icon: '◎',
  },
  {
    n: '03',
    title: 'Submit a credit app request',
    body: 'Found a price you like? Hit the button to submit a request. The seller receives your intent and reaches out to start the process.',
    icon: '◇',
  },
  {
    n: '04',
    title: 'Dealer reviews and approves',
    body: 'The dealership or broker reviews your request and confirms they can move forward. No approval — no credit pull. Your score stays intact until you\'re ready.',
    icon: '◉',
  },
  {
    n: '05',
    title: 'Fill out the credit application',
    body: 'Once approved to proceed, you complete the credit application directly with the seller. Standard process, nothing new.',
    icon: '◐',
  },
  {
    n: '06',
    title: 'We facilitate — flat $50 fee',
    body: 'If you\'re approved and ready to sign, LEASED charges a single flat $50 facilitation fee to coordinate delivery or pickup with the seller. We never retain your credit information — it passes directly to the dealership.',
    icon: '◑',
    trust: true,
  },
];

export default function HowItWorks() {
  return (
    <section style={{
      borderTop: '1px solid rgba(255,255,255,0.07)',
      padding: '72px 40px 80px',
      maxWidth: 1400,
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 52 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
        }}>
          <span style={{ color: '#FF2800', fontSize: 10 }}>◆</span>
          <span style={{
            fontFamily: 'var(--font-barlow-cond)', fontWeight: 700,
            fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)',
          }}>THE PROCESS</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '-0.02em',
          lineHeight: 0.92, color: '#fff',
        }}>
          HOW IT<br />
          <span style={{ color: '#FF2800' }}>WORKS.</span>
        </div>
        <p style={{
          fontFamily: 'var(--font-barlow)', fontWeight: 400,
          fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.4)',
          maxWidth: 440, marginTop: 16,
        }}>
          Six steps from browsing a drop to keys in hand.
          No hidden fees, no data games.
        </p>
      </div>

      {/* Steps grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1,
      }}>
        {STEPS.map((step, i) => (
          <div
            key={step.n}
            style={{
              padding: '28px 28px 32px',
              background: step.trust ? 'rgba(255,40,0,0.04)' : '#0e0e0e',
              border: step.trust
                ? '1px solid rgba(255,40,0,0.18)'
                : '1px solid rgba(255,255,255,0.05)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Step number — large background ghost */}
            <div style={{
              position: 'absolute', top: -8, right: 16,
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 96, color: 'rgba(255,255,255,0.03)',
              letterSpacing: '-0.04em', lineHeight: 1,
              pointerEvents: 'none', userSelect: 'none',
            }}>
              {step.n}
            </div>

            {/* Icon */}
            <div style={{
              fontFamily: 'var(--font-barlow-cond)',
              fontSize: 18,
              color: step.trust ? '#FF2800' : 'rgba(255,255,255,0.25)',
              marginBottom: 14,
            }}>
              {step.icon}
            </div>

            {/* Step label */}
            <div style={{
              fontFamily: 'var(--font-barlow-cond)', fontWeight: 700,
              fontSize: 10, letterSpacing: '0.14em',
              color: step.trust ? '#FF2800' : 'rgba(255,255,255,0.3)',
              marginBottom: 8,
            }}>
              STEP {step.n}
            </div>

            {/* Title */}
            <div style={{
              fontFamily: 'var(--font-barlow-cond)', fontWeight: 800,
              fontSize: 17, letterSpacing: '0.01em',
              color: '#fff', lineHeight: 1.25, marginBottom: 10,
              textTransform: 'uppercase',
            }}>
              {step.title}
            </div>

            {/* Body */}
            <p style={{
              fontFamily: 'var(--font-barlow)', fontWeight: 400,
              fontSize: 13, lineHeight: 1.7,
              color: 'rgba(255,255,255,0.45)',
              margin: 0,
            }}>
              {step.body}
            </p>

            {/* Trust badge on step 6 */}
            {step.trust && (
              <div style={{
                marginTop: 16,
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,40,0,0.1)',
                border: '1px solid rgba(255,40,0,0.25)',
                padding: '5px 12px',
              }}>
                <span style={{ fontSize: 9, color: '#FF2800' }}>◆</span>
                <span style={{
                  fontFamily: 'var(--font-barlow-cond)', fontWeight: 700,
                  fontSize: 10, letterSpacing: '0.1em', color: '#FF2800',
                }}>
                  CREDIT DATA NEVER RETAINED BY LEASED
                </span>
              </div>
            )}

            {/* Connector line (not on last row) */}
            {i < 3 && (
              <div style={{
                position: 'absolute', bottom: -1, left: '50%',
                width: 1, height: 1,
                background: 'rgba(255,255,255,0.06)',
              }} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
