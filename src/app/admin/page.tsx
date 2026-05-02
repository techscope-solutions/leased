import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Profile } from '@/lib/supabase/types';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  const profile = profileData as Profile | null;

  if (profile?.role !== 'moderator') redirect('/');

  // Fetch stats
  const [{ count: totalUsers }, { count: sellers }, { count: pendingReview }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'seller'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('onboarded', false),
  ]);

  const stats = [
    { label: 'TOTAL USERS', value: totalUsers ?? 0, color: '#4a7fd4' },
    { label: 'SELLERS', value: sellers ?? 0, color: '#FF2800' },
    { label: 'PENDING REVIEW', value: pendingReview ?? 0, color: '#c8922a' },
    { label: 'LIVE DROPS', value: '—', color: 'rgba(255,255,255,0.5)' },
  ];

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 2, padding: '48px 24px 80px', maxWidth: 1200, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4a7fd4' }} />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>MODERATOR PANEL</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-0.025em', lineHeight: 0.92, marginBottom: 8 }}>
          <span style={{ color: '#fff' }}>ADMIN </span>
          <span style={{ color: '#4a7fd4' }}>PANEL.</span>
        </div>
        <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
          Review drops, manage users, and keep the marketplace clean.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
        {stats.map(s => (
          <div key={s.label} style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20 }}>
            <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 42, color: s.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {[
          { label: 'REVIEW PENDING DROPS', desc: 'Approve or reject submissions from sellers', href: '#', accent: '#FF2800' },
          { label: 'MANAGE USERS', desc: 'View profiles, promote roles, ban accounts', href: '#', accent: '#4a7fd4' },
          { label: 'SELLER APPLICATIONS', desc: 'Review and approve new seller registrations', href: '#', accent: '#c8922a' },
        ].map(a => (
          <Link key={a.label} href={a.href} style={{ textDecoration: 'none' }}>
            <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, cursor: 'pointer', transition: 'border-color 0.2s' }}>
              <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 13, letterSpacing: '0.06em', color: a.accent, marginBottom: 8 }}>{a.label}</div>
              <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{a.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
