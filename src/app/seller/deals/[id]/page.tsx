import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { DbDeal } from '@/lib/deals';

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const SERIF = '"Instrument Serif", Georgia, serif';
const INK = '#0a0a0a';
const MUTED = 'rgba(10,10,10,0.4)';
const A = 'oklch(0.55 0.22 18)';

type Inquiry = {
  id: string;
  buyer_id: string;
  preferred_term: number;
  preferred_down: number;
  estimated_income: number;
  estimated_credit: string;
  message: string | null;
  status: string;
  created_at: string;
  buyer_email: string | null;
  buyer_name: string | null;
};

const STATUS_COLOR: Record<string, string> = {
  sent:             '#4a7fd4',
  viewed:           'oklch(0.65 0.14 70)',
  replied:          'oklch(0.55 0.16 145)',
  application_sent: A,
  complete:         'oklch(0.55 0.16 145)',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function DealInquiriesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const admin = createAdminClient();

  // Verify the seller owns this deal
  const { data: deal } = await admin
    .from('deals')
    .select('*')
    .eq('id', id)
    .eq('seller_id', user.id)
    .single();

  if (!deal) redirect('/seller/dashboard');

  const d = deal as DbDeal;

  // Fetch all inquiries for this deal
  const { data: inquiryRows } = await admin
    .from('inquiries')
    .select('id, buyer_id, preferred_term, preferred_down, estimated_income, estimated_credit, message, status, created_at')
    .eq('deal_id', id)
    .order('created_at', { ascending: false });

  // Fetch buyer profiles for name/email
  const buyerIds = [...new Set((inquiryRows ?? []).map((r: { buyer_id: string }) => r.buyer_id))];
  const buyerMap: Record<string, { email: string | null; full_name: string | null }> = {};
  if (buyerIds.length > 0) {
    const { data: buyerProfiles } = await admin
      .from('profiles')
      .select('id, email, full_name')
      .in('id', buyerIds);
    for (const p of buyerProfiles ?? []) {
      buyerMap[p.id] = { email: p.email, full_name: p.full_name };
    }
  }

  const inquiries: Inquiry[] = (inquiryRows ?? []).map((r: {
    id: string; buyer_id: string; preferred_term: number; preferred_down: number;
    estimated_income: number; estimated_credit: string; message: string | null;
    status: string; created_at: string;
  }) => ({
    ...r,
    buyer_email: buyerMap[r.buyer_id]?.email ?? null,
    buyer_name:  buyerMap[r.buyer_id]?.full_name ?? null,
  }));

  const newCount = inquiries.filter(i => i.status === 'sent').length;

  return (
    <div style={{
      background: '#f7f5f2', minHeight: '100vh',
      fontFamily: SF, color: INK,
      position: 'relative', zIndex: 2,
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(247,245,242,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(10,10,10,0.07)',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <Link href="/seller/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, color: MUTED, fontSize: 13 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Dashboard
        </Link>
        <span style={{ color: 'rgba(10,10,10,0.2)' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {d.year} {d.make} {d.model}
        </span>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 80px' }}>

        {/* Deal summary */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED, marginBottom: 6 }}>
            Inquiries
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 5vw, 44px)', margin: '0 0 6px', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400 }}>
            {d.year} {d.make} <em style={{ color: A }}>{d.model}</em>
          </h1>
          <div style={{ fontSize: 13, color: MUTED }}>
            ${d.monthly}/mo · {d.city}, {d.state} · {inquiries.length} {inquiries.length === 1 ? 'inquiry' : 'inquiries'}
            {newCount > 0 && <span style={{ marginLeft: 8, color: '#4a7fd4', fontWeight: 500 }}>{newCount} unread</span>}
          </div>
        </div>

        {inquiries.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', background: 'rgba(255,255,255,0.6)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.8)' }}>
            <div style={{ fontFamily: SERIF, fontSize: 20, color: MUTED, marginBottom: 8 }}>No inquiries yet</div>
            <div style={{ fontSize: 13, color: MUTED }}>When buyers express interest this deal, they'll appear here.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {inquiries.map(inq => (
              <div key={inq.id} style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${inq.status === 'sent' ? 'rgba(74,127,212,0.25)' : 'rgba(255,255,255,0.9)'}`,
                borderRadius: 18,
                padding: '20px 22px',
                boxShadow: inq.status === 'sent'
                  ? '0 2px 16px rgba(74,127,212,0.08)'
                  : '0 1px 6px rgba(10,10,10,0.04)',
              }}>
                {/* Buyer + status row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                      {inq.buyer_name ?? inq.buyer_email ?? 'Anonymous buyer'}
                    </div>
                    {inq.buyer_name && inq.buyer_email && (
                      <div style={{ fontSize: 12, color: MUTED }}>{inq.buyer_email}</div>
                    )}
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 2, fontFamily: MONO }}>{timeAgo(inq.created_at)}</div>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: 999,
                    background: `${STATUS_COLOR[inq.status] ?? MUTED}15`,
                    border: `1px solid ${STATUS_COLOR[inq.status] ?? MUTED}40`,
                    color: STATUS_COLOR[inq.status] ?? MUTED,
                    fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                    flexShrink: 0,
                  }}>
                    {inq.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Details grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: inq.message ? 16 : 0 }}>
                  {[
                    { label: 'Term', value: `${inq.preferred_term} mo` },
                    { label: 'Down', value: `$${inq.preferred_down.toLocaleString()}` },
                    { label: 'Income', value: `$${inq.estimated_income.toLocaleString()}` },
                    { label: 'Credit', value: inq.estimated_credit },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ background: 'rgba(10,10,10,0.03)', borderRadius: 10, padding: '10px 12px' }}>
                      <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Message */}
                {inq.message && (
                  <div style={{
                    borderLeft: '3px solid #c0392b',
                    paddingLeft: 14, marginTop: 4,
                    background: 'rgba(10,10,10,0.02)', borderRadius: '0 8px 8px 0',
                    padding: '10px 14px',
                  }}>
                    <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 5 }}>Message</div>
                    <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0, color: INK }}>{inq.message}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
