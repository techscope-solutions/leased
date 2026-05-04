export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { getAllDeals, getPendingDeals, DealWithSeller } from '@/lib/deals';
import { approveDeal, rejectDeal } from './actions';
import { DeleteDealButton, DeleteDealButtonSmall } from './DeleteDealButton';
import { createAdminClient } from '@/lib/supabase/admin';

const A = 'oklch(0.55 0.22 18)';
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const SERIF = '"Instrument Serif", Georgia, serif';
const INK = '#0a0a0a';
const MUTED = 'rgba(10,10,10,0.4)';

const STATUS_COLOR: Record<string, string> = {
  live: 'oklch(0.55 0.16 145)',
  pending: 'oklch(0.65 0.14 70)',
  rejected: A,
};
const STATUS_BG: Record<string, string> = {
  live: 'rgba(34,197,94,0.10)',
  pending: 'rgba(200,140,40,0.10)',
  rejected: 'rgba(180,30,20,0.08)',
};

function Lbl({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED, marginBottom: 4 }}>
      {children}
    </div>
  );
}

export default async function AdminDealsPage() {
  const supabase = createAdminClient();
  const liveQ = supabase.from('deals').select('*', { count: 'exact', head: true }).eq('status', 'live');
  const rejQ = supabase.from('deals').select('*', { count: 'exact', head: true }).eq('status', 'rejected');
  const [allDeals, pending, liveResult, rejectedResult] = await Promise.all([
    getAllDeals(),
    getPendingDeals(),
    liveQ,
    rejQ,
  ]);
  const liveCount = liveResult.count ?? 0;
  const rejectedCount = rejectedResult.count ?? 0;

  return (
    <div style={{ padding: '32px 40px 80px', maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: A, display: 'inline-block' }} />
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED }}>Deal management</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(36px, 4vw, 52px)', margin: 0, lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400, color: INK }}>
            Manage <em style={{ color: A }}>deals.</em>
          </h1>
        </div>
        <Link href="/admin/deals/new" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '11px 22px', borderRadius: 999,
            background: INK, color: 'white', border: 'none', cursor: 'pointer',
            fontFamily: SF, fontWeight: 500, fontSize: 14,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            + New deal
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
        {[
          { label: 'Pending review', value: pending.length, color: STATUS_COLOR.pending },
          { label: 'Live', value: liveCount ?? 0, color: STATUS_COLOR.live },
          { label: 'Rejected', value: rejectedCount ?? 0, color: MUTED },
          { label: 'Total', value: allDeals.length, color: INK },
        ].map(s => (
          <div key={s.label} className="lz-glass" style={{ padding: '14px 20px', borderRadius: 14 }}>
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: MUTED, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: SERIF, fontSize: 32, color: s.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Pending review */}
      {pending.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: STATUS_COLOR.pending, marginBottom: 14 }}>
            Pending review — {pending.length}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {pending.map(deal => {
              const sellerLabel = deal.profiles?.full_name ?? deal.profiles?.email ?? deal.seller_id.slice(0, 8) + '…';
              return (
                <div key={deal.id} style={{
                  background: 'rgba(255,255,255,0.5)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: `1px solid rgba(200,140,40,0.2)`,
                  borderRadius: 16, overflow: 'hidden',
                }}>
                  {/* Top bar */}
                  <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(10,10,10,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: SF, fontWeight: 600, fontSize: 15, color: INK }}>{deal.year} {deal.make} {deal.model}</span>
                      <span style={{ fontFamily: MONO, fontSize: 10, color: MUTED }}>{deal.drop_id}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: SF, fontSize: 12, color: MUTED }}>{sellerLabel}</span>
                      <Link href={`/admin/deals/${deal.id}/edit`} style={{ textDecoration: 'none' }}>
                        <button style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(10,10,10,0.06)', border: '1px solid rgba(10,10,10,0.1)', color: MUTED, fontFamily: SF, fontWeight: 500, fontSize: 12, cursor: 'pointer' }}>Edit</button>
                      </Link>
                      <DeleteDealButtonSmall dealId={deal.id} />
                    </div>
                  </div>
                  {/* Info + actions */}
                  <div style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
                    <div>
                      <Lbl>Pricing</Lbl>
                      <div style={{ fontFamily: SERIF, fontSize: 24, color: A, letterSpacing: '-0.02em' }}>${deal.monthly.toLocaleString()}<span style={{ fontFamily: SF, fontSize: 12, fontWeight: 400, color: MUTED }}>/mo</span></div>
                      <div style={{ fontFamily: SF, fontSize: 11, color: MUTED, marginTop: 2 }}>${deal.due_at_signing.toLocaleString()} DAS · {deal.term}mo</div>
                    </div>
                    <div>
                      <Lbl>Vehicle</Lbl>
                      <div style={{ fontFamily: SF, fontWeight: 500, fontSize: 13, color: INK }}>{deal.trim}</div>
                      <div style={{ fontFamily: SF, fontSize: 11, color: MUTED, marginTop: 2 }}>{deal.drive} · {deal.car_type} · {deal.deal_type}</div>
                    </div>
                    <div>
                      <Lbl>Location</Lbl>
                      <div style={{ fontFamily: SF, fontWeight: 500, fontSize: 13, color: INK }}>{deal.city}, {deal.state}</div>
                      <div style={{ fontFamily: SF, fontSize: 11, color: MUTED, marginTop: 2 }}>{deal.slots_left != null ? `${deal.slots_left} slots` : '∞ slots'}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <form action={approveDeal} style={{ display: 'flex', gap: 6 }}>
                        <input type="hidden" name="dealId" value={deal.id} />
                        <input type="hidden" name="tier" value="VERIFIED" />
                        <input type="hidden" name="expiresDays" value="7" />
                        <button type="submit" style={{ flex: 1, padding: '8px', borderRadius: 10, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: STATUS_COLOR.live, fontFamily: SF, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>✓ Approve</button>
                      </form>
                      <form action={rejectDeal}>
                        <input type="hidden" name="dealId" value={deal.id} />
                        <input type="hidden" name="reason" value="Does not meet listing standards." />
                        <button type="submit" style={{ width: '100%', padding: '8px', borderRadius: 10, background: 'rgba(180,30,20,0.07)', border: `1px solid ${A}35`, color: A, fontFamily: SF, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>✕ Reject</button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All deals table */}
      <div>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED, marginBottom: 14 }}>
          All deals — {allDeals.length}
        </div>

        {allDeals.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', fontFamily: SF, fontSize: 15, color: MUTED }}>
            No deals yet — create one above
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {allDeals.map(deal => (
              <div key={deal.id} className="lz-glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                  <span style={{
                    padding: '3px 9px', borderRadius: 999,
                    background: STATUS_BG[deal.status] ?? 'rgba(10,10,10,0.05)',
                    border: `1px solid ${STATUS_COLOR[deal.status] ?? MUTED}30`,
                    fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em',
                    color: STATUS_COLOR[deal.status] ?? MUTED,
                    flexShrink: 0, textTransform: 'uppercase' as const,
                  }}>
                    {deal.status}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: SF, fontWeight: 600, fontSize: 14, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {deal.year} {deal.make} {deal.model} {deal.trim}
                    </div>
                    <div style={{ fontFamily: SF, fontSize: 12, color: MUTED, marginTop: 1 }}>
                      {deal.drop_id} · ${deal.monthly}/mo · {deal.city}, {deal.state} · {deal.profiles?.full_name ?? deal.profiles?.email ?? 'Unknown'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: MUTED }}>{deal.tier}</span>
                  <Link href={`/admin/deals/${deal.id}/edit`} style={{ textDecoration: 'none' }}>
                    <button style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(10,10,10,0.06)', border: '1px solid rgba(10,10,10,0.10)', color: 'rgba(10,10,10,0.6)', fontFamily: SF, fontWeight: 500, fontSize: 12, cursor: 'pointer' }}>Edit</button>
                  </Link>
                  <DeleteDealButton dealId={deal.id} label={`${deal.make} ${deal.model}`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
