import Link from 'next/link';
import { getAllDeals, getPendingDeals } from '@/lib/deals';
import { approveDeal, rejectDeal, deleteDeal } from './actions';
import { createClient } from '@/lib/supabase/server';

const STATUS_COLOR: Record<string, string> = {
  live: '#22c55e', pending: '#f59e0b', rejected: '#FF2800',
};
const STATUS_BG: Record<string, string> = {
  live: 'rgba(34,197,94,0.1)', pending: 'rgba(245,158,11,0.1)', rejected: 'rgba(255,40,0,0.08)',
};

export default async function AdminDealsPage() {
  const supabase = await createClient();
  const [allDeals, pending, { count: liveCount }, { count: rejectedCount }] = await Promise.all([
    getAllDeals(),
    getPendingDeals(),
    supabase.from('deals').select('*', { count: 'exact', head: true }).eq('status', 'live'),
    supabase.from('deals').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
  ]);

  return (
    <div style={{ padding: '40px 32px 80px', maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF2800' }} />
            <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>DEAL MANAGEMENT</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(24px, 3.5vw, 40px)', letterSpacing: '-0.02em', lineHeight: 0.95 }}>
            <span style={{ color: '#fff' }}>MANAGE </span>
            <span style={{ color: '#FF2800' }}>DEALS.</span>
          </div>
        </div>
        <Link href="/admin/deals/new" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '12px 24px', borderRadius: 12, background: 'rgba(255,40,0,0.9)', border: '1px solid rgba(255,80,40,0.4)', boxShadow: '0 4px 20px rgba(255,40,0,0.3)', color: '#fff', fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 13, letterSpacing: '0.1em', cursor: 'pointer' }}>
            + NEW DEAL
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
        {[
          { label: 'PENDING REVIEW', value: pending.length, color: '#f59e0b' },
          { label: 'LIVE', value: liveCount ?? 0, color: '#22c55e' },
          { label: 'REJECTED', value: rejectedCount ?? 0, color: 'rgba(255,255,255,0.3)' },
          { label: 'TOTAL', value: allDeals.length, color: '#4a7fd4' },
        ].map(s => (
          <div key={s.label} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>
            <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Pending review section */}
      {pending.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.16em', color: '#f59e0b', marginBottom: 16 }}>
            PENDING REVIEW — {pending.length}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {pending.map(deal => {
              const sellerLabel = deal.profiles?.full_name ?? deal.profiles?.email ?? deal.seller_id.slice(0, 8) + '…';
              return (
                <div key={deal.id} style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 16, overflow: 'hidden' }}>
                  {/* Top bar */}
                  <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 900, fontSize: 15, color: '#fff' }}>{deal.year} {deal.make} {deal.model}</span>
                      <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 600, fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{deal.drop_id}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{sellerLabel}</span>
                      <Link href={`/admin/deals/${deal.id}/edit`} style={{ textDecoration: 'none' }}>
                        <button style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', cursor: 'pointer' }}>EDIT</button>
                      </Link>
                      <form action={deleteDeal} onSubmit={(e) => { if (!confirm('Delete this deal?')) e.preventDefault(); }}>
                        <input type="hidden" name="dealId" value={deal.id} />
                        <button type="submit" style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(255,40,0,0.08)', border: '1px solid rgba(255,40,0,0.25)', color: '#FF2800', fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', cursor: 'pointer' }}>DELETE</button>
                      </form>
                    </div>
                  </div>
                  {/* Info + actions */}
                  <div style={{ padding: '16px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
                    <div>
                      <Lbl>PRICING</Lbl>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: '#FF2800' }}>${deal.monthly.toLocaleString()}<span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>/mo</span></div>
                      <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>${deal.due_at_signing.toLocaleString()} DAS · {deal.term}mo</div>
                    </div>
                    <div>
                      <Lbl>VEHICLE</Lbl>
                      <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{deal.trim} · {deal.drive} · {deal.car_type}</div>
                      <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{deal.category} · {deal.deal_type}</div>
                    </div>
                    <div>
                      <Lbl>LOCATION</Lbl>
                      <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{deal.city}, {deal.state}</div>
                      <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{deal.slots_left != null ? `${deal.slots_left} slots` : '∞ slots'}</div>
                    </div>
                    {/* Approve/reject */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <form action={approveDeal} style={{ display: 'flex', gap: 6 }}>
                        <input type="hidden" name="dealId" value={deal.id} />
                        <input type="hidden" name="tier" value="VERIFIED" />
                        <input type="hidden" name="expiresDays" value="7" />
                        <button type="submit" style={{ flex: 1, padding: '8px', borderRadius: 8, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)', color: '#22c55e', fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 11, letterSpacing: '0.08em', cursor: 'pointer' }}>✓ APPROVE</button>
                      </form>
                      <form action={rejectDeal}>
                        <input type="hidden" name="dealId" value={deal.id} />
                        <input type="hidden" name="reason" value="Does not meet listing standards." />
                        <button type="submit" style={{ width: '100%', padding: '8px', borderRadius: 8, background: 'rgba(255,40,0,0.08)', border: '1px solid rgba(255,40,0,0.25)', color: '#FF2800', fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 11, letterSpacing: '0.08em', cursor: 'pointer' }}>✕ REJECT</button>
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
        <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
          ALL DEALS — {allDeals.length}
        </div>

        {allDeals.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', fontFamily: 'var(--font-barlow-cond)', fontSize: 13, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>
            NO DEALS YET — CREATE ONE ABOVE
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {allDeals.map(deal => (
              <div key={deal.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                  <div style={{ padding: '2px 8px', background: STATUS_BG[deal.status], border: `1px solid ${STATUS_COLOR[deal.status]}40`, borderRadius: 99, fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 9, letterSpacing: '0.1em', color: STATUS_COLOR[deal.status], flexShrink: 0 }}>
                    {deal.status.toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 13, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {deal.year} {deal.make} {deal.model} {deal.trim}
                    </div>
                    <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                      {deal.drop_id} · ${deal.monthly}/mo · {deal.city}, {deal.state} · {deal.profiles?.full_name ?? deal.profiles?.email ?? 'Unknown'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', alignSelf: 'center' }}>{deal.tier}</div>
                  <Link href={`/admin/deals/${deal.id}/edit`} style={{ textDecoration: 'none' }}>
                    <button style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(74,127,212,0.1)', border: '1px solid rgba(74,127,212,0.3)', color: '#4a7fd4', fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', cursor: 'pointer' }}>EDIT</button>
                  </Link>
                  <form action={deleteDeal} onSubmit={(e) => { if (!confirm(`Delete ${deal.make} ${deal.model}?`)) e.preventDefault(); }}>
                    <input type="hidden" name="dealId" value={deal.id} />
                    <button type="submit" style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,40,0,0.06)', border: '1px solid rgba(255,40,0,0.2)', color: '#FF2800', fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.08em', cursor: 'pointer' }}>✕</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Lbl({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{children}</div>;
}
