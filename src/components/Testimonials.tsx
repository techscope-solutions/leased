const A = 'oklch(0.55 0.22 18)';
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif';
const SFD = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';

const REVIEWS = [
  {
    name: 'Marcus T.',
    role: 'Leased a Model 3',
    avatar: 'MT',
    text: 'Found the lease in 10 minutes, applied, picked it up Saturday. The dealer never called me at dinner once. That alone is worth it.',
    stars: 5,
    highlight: false,
  },
  {
    name: 'Priya R.',
    role: 'Leased an i4',
    avatar: 'PR',
    text: 'I was quoted $580 by three BMW dealers. Found it on Leased for $449 with the same down. Same exact car, same trim.',
    stars: 5,
    highlight: true,
  },
  {
    name: 'James L.',
    role: 'Sales Manager · Audi BH',
    avatar: 'JL',
    text: 'We post our top 5 deals on Leased every week. About 30% of our applications now come through. Dead simple.',
    stars: 5,
    highlight: false,
  },
];

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(10,10,10,0.06)', color: 'rgba(10,10,10,0.7)',
          padding: '6px 12px', borderRadius: 999,
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
        }}>
          03 — Reviews
        </div>
        <h2 style={{
          fontSize: 'clamp(40px, 5vw, 64px)',
          lineHeight: 1,
          margin: '14px 0 0',
          letterSpacing: '-0.03em',
          fontWeight: 600,
          fontFamily: SFD,
          color: '#0a0a0a',
          maxWidth: 800,
        }}>
          What people say after they{' '}
          <span style={{ fontStyle: 'italic', color: A }}>actually</span> drive away.
        </h2>
      </div>

      {/* 3-card grid */}
      <div className="lz-testimonials-grid">
        {REVIEWS.map((r, i) => (
          <div key={i} style={{
            padding: 28,
            borderRadius: 22,
            background: r.highlight ? A : 'white',
            color: r.highlight ? 'white' : '#0a0a0a',
            border: r.highlight ? 'none' : '1px solid rgba(10,10,10,0.08)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: 280,
          }}>
            <div>
              {/* Stars */}
              <div style={{ display: 'flex', gap: 2, color: r.highlight ? 'white' : A, marginBottom: 16 }}>
                {Array.from({ length: r.stars }).map((_, k) => <StarIcon key={k} />)}
              </div>

              {/* Quote */}
              <p style={{
                fontFamily: SFD,
                fontSize: 24,
                lineHeight: 1.25,
                margin: 0,
                letterSpacing: '-0.015em',
                fontWeight: 400,
                fontStyle: 'italic',
                color: r.highlight ? 'white' : '#0a0a0a',
              }}>
                &ldquo;{r.text}&rdquo;
              </p>
            </div>

            {/* Author */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 24,
              paddingTop: 20,
              borderTop: `1px solid ${r.highlight ? 'rgba(255,255,255,0.2)' : 'rgba(10,10,10,0.08)'}`,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: r.highlight ? 'rgba(255,255,255,0.2)' : '#0a0a0a',
                color: 'white',
                fontSize: 12, fontWeight: 600,
                display: 'grid', placeItems: 'center',
                fontFamily: SF,
              }}>
                {r.avatar}
              </div>
              <div style={{ fontFamily: SF, fontSize: 13 }}>
                <div style={{ fontWeight: 500, color: r.highlight ? 'white' : '#0a0a0a' }}>{r.name}</div>
                <div style={{ opacity: 0.7, marginTop: 1 }}>{r.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
