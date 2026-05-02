import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Profile } from '@/lib/supabase/types';

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
          { label: 'ACTIVE DROPS', value: '—', sub: 'Post your first deal' },
          { label: 'APPLICATIONS', value: '—', sub: 'No applications yet' },
          { label: 'VIEWS THIS WEEK', value: '—', sub: 'Publish to track' },
          { label: 'CONVERSION RATE', value: '—', sub: 'Based on views vs. applies' },
        ].map(s => (
          <div key={s.label} style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20 }}>
            <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 36, color: '#FF2800', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button style={{ padding: '14px 28px', borderRadius: 14, background: 'rgba(255,40,0,0.9)', border: '1px solid rgba(255,80,40,0.4)', boxShadow: '0 4px 24px rgba(255,40,0,0.3)', color: '#fff', fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 13, letterSpacing: '0.1em', cursor: 'pointer' }}>
          + POST A DROP
        </button>
        <Link href="/browse" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '14px 28px', borderRadius: 14, background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', cursor: 'pointer' }}>
            VIEW MARKETPLACE
          </button>
        </Link>
      </div>
    </div>
  );
}
