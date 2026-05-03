import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Profile } from '@/lib/supabase/types';
import { getSellerDeals } from '@/lib/deals';

const STATUS_COLOR: Record<string, string> = {
  live: '#22c55e',
  pending: '#f59e0b',
  rejected: '#FF2800',
};

const STATUS_BG: Record<string, string> = {
  live: 'rgba(34,197,94,0.1)',
  pending: 'rgba(245,158,11,0.1)',
  rejected: 'rgba(255,40,0,0.1)',
};

export default async function SellerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  const profile = profileData as Profile | null;

  if (!profile || !['seller', 'moderator'].includes(profile.role)) {
    redirect('/onboarding');
  }

  const deals = await getSellerDeals(user.id);
  const liveDeals = deals.filter(d => d.status === 'live');
  const pendingDeals = deals.filter(d => d.status === 'pending');
  const rejectedDeals = deals.filter(d => d.status === 'rejected');

  const name = profile?.full_name ?? user.email ?? 'Seller';

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 2, padding: '48px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF2800' }} />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>SELLER PORTAL</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-0.025em', lineHeight: 0.92, marginBottom: 8 }}>
          <span style={{ color: '#fff' }}>WELCOME, </span>
          <span style={{ background: 'linear-gradient(135deg, #FF2800 20%, #cc1f00 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {name.split(' ')[0].toUpperCase()}.
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
          Manage your drops, track applications, and set pricing.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
        {[
          { label: 'ACTIVE DROPS', value: liveDeals.length || '—', sub: liveDeals.length ? `${liveDeals.length} live` : 'Post your first deal', color: '#22c55e' },
          { label: 'PENDING REVIEW', value: pendingDeals.length || '—', sub: pendingDeals.length ? 'Awaiting moderator' : 'None pending', color: '#f59e0b' },
          { label: 'REJECTED', value: rejectedDeals.length || '—', sub: rejectedDeals.length ? 'Needs revision' : 'None rejected', color: 'rgba(255,255,255,0.4)' },
          { label: 'TOTAL DROPS', value: deals.length || '—', sub: deals.length ? 'All time' : 'No drops yet', color: '#4a7fd4' },
        ].map(s => (
          <div key={s.label} style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20 }}>
            <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 36, color: s.color, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
        <Link href="/seller/deals/new" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '14px 28px', borderRadius: 14, background: 'rgba(255,40,0,0.9)', border: '1px solid rgba(255,80,40,0.4)', boxShadow: '0 4px 24px rgba(255,40,0,0.3)', color: '#fff', fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 13, letterSpacing: '0.1em', cursor: 'pointer' }}>
            + POST A DROP
          </button>
        </Link>
        <Link href="/browse" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '14px 28px', borderRadius: 14, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', cursor: 'pointer' }}>
            VIEW MARKETPLACE
          </button>
        </Link>
      </div>

      {/* Deals list */}
      {deals.length > 0 && (
        <div>
          <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
            YOUR DROPS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {deals.map(deal => (
              <div key={deal.id} style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ padding: '3px 10px', background: STATUS_BG[deal.status], border: `1px solid ${STATUS_COLOR[deal.status]}40`, borderRadius: 99, fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.1em', color: STATUS_COLOR[deal.status] }}>
                    {deal.status.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 14, color: '#fff' }}>
                      {deal.year} {deal.make} {deal.model}
                    </div>
                    <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                      {deal.drop_id} · {deal.city}, {deal.state} · ${deal.monthly}/mo
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {deal.rejection_reason && (
                    <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 11, color: '#FF2800', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {deal.rejection_reason}
                    </div>
                  )}
                  <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
                    {new Date(deal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
