import { notFound } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/Nav';
import { getDealById, getSimilarDeals, dbRowToCarDeal } from '@/lib/deals';
import { createClient } from '@/lib/supabase/server';
import DealGallery from './DealGallery';
import InquiryApplyCard from './InquiryApplyCard';
import { CarDeal } from '@/lib/types';

export const dynamic = 'force-dynamic';

const A = 'oklch(0.55 0.22 18)';
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const SERIF = '"Instrument Serif", Georgia, serif';
const INK = '#0a0a0a';
const MUTED = 'rgba(10,10,10,0.4)';
const MUTED2 = 'rgba(10,10,10,0.6)';

function CheckIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.16 145)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z"/>
      <circle cx="12" cy="10" r="2.5"/>
    </svg>
  );
}


function SpecRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 0', borderTop: '1px solid rgba(10,10,10,0.06)' }}>
      <span style={{ fontSize: 13, color: MUTED2, fontFamily: SF }}>{label}</span>
      <span style={{ fontSize: 13, color: INK, fontFamily: mono ? MONO : SF }}>{value}</span>
    </div>
  );
}

function SimilarCard({ deal }: { deal: CarDeal }) {
  return (
    <Link href={`/browse/${deal.id}`} style={{ textDecoration: 'none' }}>
      <div className="lz-glass" style={{ borderRadius: 18, padding: 8, cursor: 'pointer', transition: 'transform 0.18s', color: INK }} onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')} onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
        <div style={{ aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden', background: 'rgba(10,10,10,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {deal.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={deal.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(10,10,10,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{deal.make}</span>
          )}
        </div>
        <div style={{ padding: '10px 8px 6px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em', fontFamily: SF, color: INK }}>{deal.model}</div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 2, fontFamily: SF }}>{deal.city}, {deal.state}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
            <span style={{ fontFamily: SERIF, fontSize: 24, lineHeight: 0.9, letterSpacing: '-0.02em', color: INK }}>${deal.monthly}</span>
            <span style={{ fontSize: 11, color: MUTED, fontFamily: SF }}>/mo</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

type Props = { params: Promise<{ id: string }> };

export default async function DealDetailPage({ params }: Props) {
  const { id } = await params;
  const raw = await getDealById(id);
  if (!raw || raw.status !== 'live') notFound();

  const deal = dbRowToCarDeal(raw);
  const similar = await getSimilarDeals(id, raw.category);

  // Auth + existing inquiry check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let existingInquiry: { status: 'sent' | 'viewed' | 'replied' | 'application_sent' | 'complete' } | null = null;
  if (user) {
    const { data } = await supabase
      .from('inquiries')
      .select('status')
      .eq('deal_id', raw.id)
      .eq('buyer_id', user.id)
      .maybeSingle();
    if (data) existingInquiry = data as { status: 'sent' | 'viewed' | 'replied' | 'application_sent' | 'complete' };
  }

  const milesLabel = deal.milesPerYear >= 1000
    ? `${(deal.milesPerYear / 1000).toFixed(0)}k`
    : String(deal.milesPerYear);

  // Build specs — only include fields that have real values
  const specs: { label: string; value: string; mono?: boolean }[] = [
    { label: 'Drivetrain', value: deal.drive },
    { label: 'Body type', value: deal.carType },
    { label: 'Category', value: deal.category },
  ];
  if (deal.color) specs.push({ label: 'Color', value: deal.color });
  specs.push({ label: 'Deal ID', value: deal.dropId, mono: true });

  // Included items — only shown if meaningful
  const included = [
    deal.dueAtSigning === 0 ? 'Zero due at signing' : null,
    deal.zeroDeal ? '$0 down' : null,
    deal.slotsLeft != null ? `${deal.slotsLeft} slots remaining` : 'Unlimited slots',
    `${deal.term}-month term`,
    `${milesLabel} miles/year`,
  ].filter(Boolean) as string[];

  return (
    <div style={{ background: '#f7f5f2', minHeight: '100vh', color: INK, fontFamily: SF, WebkitFontSmoothing: 'antialiased', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient blobs */}
      <div style={{ position: 'fixed', top: -200, left: -100, width: 700, height: 700, background: `radial-gradient(circle, ${A} 0%, transparent 65%)`, opacity: 0.12, filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: 600, right: -200, width: 800, height: 800, background: 'radial-gradient(circle, oklch(0.55 0.18 250) 0%, transparent 65%)', opacity: 0.08, filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav light />

        <main className="lz-deal-main">
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: MUTED, marginBottom: 20 }}>
            <Link href="/browse" style={{ color: MUTED, textDecoration: 'none' }}>Browse</Link>
            <span>/</span>
            <span style={{ color: MUTED }}>{deal.make}</span>
            <span>/</span>
            <span style={{ color: MUTED2 }}>{deal.model}</span>
          </div>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                {deal.tier === 'VERIFIED' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, background: A, color: 'white', fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'white', display: 'inline-block' }} />
                    Verified
                  </span>
                )}
                {deal.zeroDeal && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(10,10,10,0.08)', fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED2 }}>
                    $0 down
                  </span>
                )}
              </div>
              <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(36px, 5vw, 60px)', margin: 0, lineHeight: 1, letterSpacing: '-0.035em', fontWeight: 400 }}>
                {deal.year} {deal.make} <em style={{ color: A }}>{deal.model}</em>
              </h1>
              <div style={{ marginTop: 10, fontSize: 14, color: MUTED2, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                {deal.trim && <span>{deal.trim}</span>}
                {deal.trim && <span style={{ color: MUTED }}>·</span>}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <PinIcon /> {deal.city}, {deal.state}
                </span>
              </div>
            </div>
          </div>

          {/* Gallery + Apply card */}
          <div className="lz-deal-layout">
            <DealGallery images={deal.images} make={deal.make} model={deal.model} year={deal.year} />

            {/* Interactive inquiry/apply card */}
            <aside className="lz-deal-apply-aside">
              <InquiryApplyCard
                dealId={raw.id}
                sellerId={raw.seller_id}
                monthly={deal.monthly}
                dueAtSigning={deal.dueAtSigning}
                term={deal.term}
                milesLabel={milesLabel}
                msrp={deal.msrp}
                slotsLeft={deal.slotsLeft ?? null}
                dealType={raw.deal_type}
                userId={user?.id ?? null}
                existingInquiry={existingInquiry}
              />

              {/* Slots/urgency note */}
              {deal.slotsLeft != null && deal.slotsLeft <= 5 && (
                <div style={{ marginTop: 10, padding: '12px 14px', borderRadius: 14, background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(10,10,10,0.06)', fontSize: 12, color: MUTED2, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: A, fontSize: 14 }}>⚡</span>
                  <span><strong style={{ color: INK }}>Only {deal.slotsLeft} slot{deal.slotsLeft !== 1 ? 's' : ''} left</strong> — this deal is almost gone.</span>
                </div>
              )}
            </aside>
          </div>

          {/* About + Specs */}
          <div className="lz-deal-info-grid">
            {/* About */}
            <div className="lz-glass" style={{ borderRadius: 22, padding: 28 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: MUTED, textTransform: 'uppercase' }}>Deal overview</div>
              <div className="lz-deal-highlights" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 20, paddingBottom: 20, borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: MUTED, textTransform: 'uppercase' }}>Monthly</div>
                  <div style={{ fontFamily: SERIF, fontSize: 28, letterSpacing: '-0.02em', marginTop: 4, color: A }}>${deal.monthly.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: MUTED, textTransform: 'uppercase' }}>Due at signing</div>
                  <div style={{ fontFamily: SERIF, fontSize: 28, letterSpacing: '-0.02em', marginTop: 4 }}>${deal.dueAtSigning.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: MUTED, textTransform: 'uppercase' }}>MSRP</div>
                  <div style={{ fontFamily: SERIF, fontSize: 28, letterSpacing: '-0.02em', marginTop: 4 }}>${deal.msrp.toLocaleString()}</div>
                </div>
              </div>

              {included.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: MUTED, textTransform: 'uppercase', marginBottom: 12 }}>Deal includes</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {included.map(item => (
                      <div key={item} style={{ fontSize: 13, display: 'flex', gap: 8, alignItems: 'center', color: MUTED2, fontFamily: SF }}>
                        <CheckIcon /> {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Specs */}
            <div className="lz-glass" style={{ borderRadius: 22, padding: 28 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: MUTED, textTransform: 'uppercase', marginBottom: 4 }}>Specifications</div>
              {specs.map(s => <SpecRow key={s.label} {...s} />)}
            </div>
          </div>

          {/* Similar deals */}
          {similar.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: MUTED, textTransform: 'uppercase' }}>You might also like</div>
                  <h2 style={{ fontFamily: SERIF, fontSize: 32, margin: '4px 0 0', letterSpacing: '-0.025em', fontWeight: 400 }}>Similar deals</h2>
                </div>
                <Link href="/browse" style={{ fontSize: 13, color: A, textDecoration: 'none' }}>Browse all →</Link>
              </div>
              <div className="lz-deal-similar-grid">
                {similar.map(s => <SimilarCard key={s.id} deal={s} />)}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
