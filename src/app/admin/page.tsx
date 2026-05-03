import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const [
    { count: totalUsers },
    { count: liveUsers },
    { count: newToday },
    { count: pageViewsToday },
    { count: dealClicksToday },
    { count: openTickets },
    { count: totalErrors },
    { data: topDeals },
    { data: recentErrors },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true })
      .gte('last_seen', fiveMinutesAgo),
    supabase.from('profiles').select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString()),
    supabase.from('page_events').select('*', { count: 'exact', head: true })
      .eq('event_type', 'page_view')
      .gte('created_at', today.toISOString()),
    supabase.from('page_events').select('*', { count: 'exact', head: true })
      .eq('event_type', 'deal_click')
      .gte('created_at', today.toISOString()),
    supabase.from('support_tickets').select('*', { count: 'exact', head: true })
      .eq('status', 'open'),
    supabase.from('errors').select('*', { count: 'exact', head: true }),
    supabase.from('page_events').select('deal_id')
      .eq('event_type', 'deal_click')
      .not('deal_id', 'is', null)
      .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString())
      .limit(500),
    supabase.from('errors').select('message, page, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  // Count deal clicks by deal_id
  const dealClickMap: Record<string, number> = {};
  (topDeals ?? []).forEach((e: { deal_id: string | null }) => {
    if (e.deal_id) dealClickMap[e.deal_id] = (dealClickMap[e.deal_id] ?? 0) + 1;
  });
  const topDealsList = Object.entries(dealClickMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const stats = [
    { label: 'LIVE USERS', value: liveUsers ?? 0, color: '#22c55e', pulse: true },
    { label: 'TOTAL USERS', value: totalUsers ?? 0, color: '#4a7fd4' },
    { label: 'NEW TODAY', value: newToday ?? 0, color: '#c8922a' },
    { label: 'PAGE VIEWS TODAY', value: pageViewsToday ?? 0, color: 'rgba(255,255,255,0.6)' },
    { label: 'DEAL CLICKS TODAY', value: dealClicksToday ?? 0, color: '#FF2800' },
    { label: 'OPEN TICKETS', value: openTickets ?? 0, color: openTickets ? '#f59e0b' : 'rgba(255,255,255,0.4)' },
  ];

  return (
    <div style={{ padding: '40px 32px 80px', maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4a7fd4' }} />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>OVERVIEW</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em', lineHeight: 0.95 }}>
          <span style={{ color: '#fff' }}>ADMIN </span>
          <span style={{ color: '#4a7fd4' }}>DASHBOARD.</span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 40 }}>
        {stats.map(s => (
          <div key={s.label} style={{ padding: '20px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              {s.pulse && (
                <span className="pulse-dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
              )}
              <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)' }}>{s.label}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 36, color: s.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        {/* Top deals this week */}
        <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 }}>
          <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>TOP CLICKED DEALS — 7 DAYS</div>
          {topDealsList.length === 0 ? (
            <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>No deal clicks yet</div>
          ) : topDealsList.map(([dealId, count], i) => (
            <div key={dealId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < topDealsList.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, color: 'rgba(255,255,255,0.2)', width: 16 }}>#{i + 1}</span>
                <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{dealId}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: '#FF2800' }}>{count}</span>
            </div>
          ))}
        </div>

        {/* Recent errors */}
        <div style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${totalErrors ? 'rgba(255,40,0,0.15)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)' }}>RECENT ERRORS</div>
            {(totalErrors ?? 0) > 0 && (
              <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, color: '#FF2800', background: 'rgba(255,40,0,0.1)', padding: '2px 8px', borderRadius: 99 }}>{totalErrors} TOTAL</span>
            )}
          </div>
          {(recentErrors ?? []).length === 0 ? (
            <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>No errors logged</div>
          ) : (recentErrors ?? []).map((e: { message?: string; page?: string; created_at?: string }, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: i < (recentErrors?.length ?? 0) - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.message ?? 'Unknown error'}</div>
              <div style={{ fontFamily: 'var(--font-barlow-cond)', fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>{e.page ?? '—'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {[
          { label: 'MANAGE USERS', desc: 'View, export, manage all accounts', href: '/admin/users', accent: '#4a7fd4' },
          { label: 'MANAGE BLOGS', desc: 'Generate and edit SEO blog posts', href: '/admin/blogs', accent: '#22c55e' },
          { label: 'SUPPORT TICKETS', desc: 'View and respond to user tickets', href: '/admin/tickets', accent: '#f59e0b' },
          { label: 'ERROR LOG', desc: 'Investigate client-side errors', href: '/admin/errors', accent: '#FF2800' },
        ].map(a => (
          <a key={a.label} href={a.href} style={{ textDecoration: 'none' }}>
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, transition: 'border-color 0.15s' }}>
              <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 12, letterSpacing: '0.06em', color: a.accent, marginBottom: 6 }}>{a.label}</div>
              <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{a.desc}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
