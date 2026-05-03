import { getPendingDeals } from '@/lib/deals';
import { approveDeal, rejectDeal } from './actions';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDealsPage() {
  const supabase = await createClient();
  const [pending, { count: liveCount }, { count: rejectedCount }] = await Promise.all([
    getPendingDeals(),
    supabase.from('deals').select('*', { count: 'exact', head: true }).eq('status', 'live'),
    supabase.from('deals').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
  ]);

  return (
    <div style={{ padding: '40px 32px 80px', maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF2800' }} />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>DEAL QUEUE</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(24px, 3.5vw, 40px)', letterSpacing: '-0.02em', lineHeight: 0.95, marginBottom: 20 }}>
          <span style={{ color: '#fff' }}>MANAGE </span>
          <span style={{ color: '#FF2800' }}>DEALS.</span>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { label: 'PENDING REVIEW', value: pending.length, color: '#f59e0b' },
            { label: 'LIVE', value: liveCount ?? 0, color: '#22c55e' },
            { label: 'REJECTED', value: rejectedCount ?? 0, color: 'rgba(255,255,255,0.3)' },
          ].map(s => (
            <div key={s.label} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>
              <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, color: s.color, letterSpacing: '-0.02em' }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {pending.length === 0 ? (
        <div style={{ padding: '80px 0', textAlign: 'center', fontFamily: 'var(--font-barlow-cond)', fontSize: 14, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>
          ALL CAUGHT UP — NO PENDING DEALS
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {pending.map(deal => (
            <DealModerationCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </div>
  );
}

type PendingDeal = Awaited<ReturnType<typeof getPendingDeals>>[number];

function DealModerationCard({ deal }: { deal: PendingDeal }) {
  const seller = deal.profiles;
  const sellerLabel = seller?.full_name ?? seller?.email ?? deal.seller_id.slice(0, 8) + '…';
  const submittedAt = new Date(deal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ padding: '3px 10px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 99, fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', color: '#f59e0b' }}>
            PENDING
          </div>
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>
            {deal.drop_id}
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
          {sellerLabel} · {submittedAt}
        </div>
      </div>

      {/* Deal info */}
      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {/* Vehicle */}
        <div>
          <Label>VEHICLE</Label>
          <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 900, fontSize: 18, color: '#fff', lineHeight: 1.1 }}>
            {deal.year} {deal.make}
          </div>
          <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 500, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            {deal.model} {deal.trim}
          </div>
          <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Tag>{deal.drive}</Tag>
            <Tag>{deal.car_type}</Tag>
            <Tag>{deal.category}</Tag>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <Label>PRICING</Label>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, color: '#FF2800', letterSpacing: '-0.03em' }}>
            ${deal.monthly.toLocaleString()}<span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginLeft: 2 }}>/mo</span>
          </div>
          <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            ${deal.due_at_signing.toLocaleString()} DAS · {deal.term}mo · {(deal.miles_per_year / 1000).toFixed(0)}K mi/yr
          </div>
          <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
            MSRP ${deal.msrp.toLocaleString()} · {deal.deal_type}
          </div>
          {deal.zero_deal && <div style={{ marginTop: 6 }}><Tag accent="#FF2800">ZERO DOWN</Tag></div>}
        </div>

        {/* Location */}
        <div>
          <Label>LOCATION & INVENTORY</Label>
          <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.8)' }}>
            {deal.city}, {deal.state}
          </div>
          <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
            {deal.slots_left !== null ? `${deal.slots_left} slots` : 'Unlimited slots'}
          </div>
          {deal.images.length > 0 && (
            <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>
              {deal.images.length} image{deal.images.length > 1 ? 's' : ''} attached
            </div>
          )}
        </div>
      </div>

      {/* Moderation actions */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Approve form */}
          <form action={approveDeal} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="hidden" name="dealId" value={deal.id} />
            <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)' }}>
              APPROVE OPTIONS
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-barlow-cond)', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>TIER</div>
                <select name="tier" defaultValue="VERIFIED" style={{ width: '100%', background: 'rgba(20,20,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontFamily: 'var(--font-barlow)', fontSize: 12, outline: 'none' }}>
                  <option value="VERIFIED">VERIFIED</option>
                  <option value="PLATINUM">PLATINUM</option>
                  <option value="GOLD">GOLD</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-barlow-cond)', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>EXPIRES IN</div>
                <select name="expiresDays" defaultValue="7" style={{ width: '100%', background: 'rgba(20,20,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 10px', color: '#fff', fontFamily: 'var(--font-barlow)', fontSize: 12, outline: 'none' }}>
                  <option value="1">1 day</option>
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" name="featured" value="true" style={{ accentColor: '#FF2800' }} />
              <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 600, fontSize: 11, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.55)' }}>MARK AS FEATURED</span>
            </label>
            <button type="submit" style={{ padding: '11px', borderRadius: 10, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)', color: '#22c55e', fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 12, letterSpacing: '0.1em', cursor: 'pointer' }}>
              ✓ APPROVE &amp; GO LIVE
            </button>
          </form>

          {/* Reject form */}
          <form action={rejectDeal} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input type="hidden" name="dealId" value={deal.id} />
            <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)' }}>
              REJECT REASON
            </div>
            <textarea
              name="reason"
              placeholder="Reason for rejection…"
              rows={3}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 12px', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-barlow)', fontSize: 12, resize: 'vertical', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '11px', borderRadius: 10, background: 'rgba(255,40,0,0.08)', border: '1px solid rgba(255,40,0,0.3)', color: '#FF2800', fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 12, letterSpacing: '0.1em', cursor: 'pointer' }}>
              ✕ REJECT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
      {children}
    </div>
  );
}

function Tag({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 6,
      background: accent ? `${accent}18` : 'rgba(255,255,255,0.06)',
      border: `1px solid ${accent ? `${accent}40` : 'rgba(255,255,255,0.1)'}`,
      fontFamily: 'var(--font-barlow-cond)', fontWeight: 600, fontSize: 10, letterSpacing: '0.06em',
      color: accent ?? 'rgba(255,255,255,0.55)',
    }}>
      {children}
    </span>
  );
}
