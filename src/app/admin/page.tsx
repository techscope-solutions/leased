import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

const A = 'oklch(0.55 0.22 18)';
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const SERIF = '"Instrument Serif", Georgia, serif';

function StatCard({ label, value, change, trend, live }: {
  label: string;
  value: number | string;
  change: string;
  trend: 'up' | 'down' | 'flat';
  live?: boolean;
}) {
  const trendColor = trend === 'up' ? 'oklch(0.55 0.16 145)' : trend === 'down' ? A : 'rgba(10,10,10,0.4)';
  const trendArrow = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';

  return (
    <div className="lz-glass" style={{ borderRadius: 18, padding: 18, position: 'relative', overflow: 'hidden' }}>
      {live && (
        <span style={{
          position: 'absolute', top: 14, right: 14,
          width: 7, height: 7, borderRadius: '50%',
          background: 'oklch(0.65 0.18 145)',
          boxShadow: '0 0 0 4px oklch(0.65 0.18 145 / 0.18)',
          animation: 'pulse-dot 1.4s ease-in-out infinite',
        }} />
      )}
      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)' }}>
        {label}
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 44, lineHeight: 1, margin: '10px 0 6px', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', color: '#0a0a0a' }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: trendColor, display: 'flex', alignItems: 'center', gap: 4, fontFamily: SF }}>
        <span>{trendArrow}</span>{change}
      </div>
    </div>
  );
}

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
    { data: topDealsRaw },
    { data: recentErrors },
    { data: ticketsRaw },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('last_seen', fiveMinutesAgo),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
    supabase.from('page_events').select('*', { count: 'exact', head: true }).eq('event_type', 'page_view').gte('created_at', today.toISOString()),
    supabase.from('page_events').select('*', { count: 'exact', head: true }).eq('event_type', 'deal_click').gte('created_at', today.toISOString()),
    supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('errors').select('*', { count: 'exact', head: true }),
    supabase.from('page_events').select('deal_id').eq('event_type', 'deal_click').not('deal_id', 'is', null).gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()).limit(500),
    supabase.from('errors').select('message, page, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('support_tickets').select('*').eq('status', 'open').order('created_at', { ascending: false }).limit(5),
  ]);

  const dealClickMap: Record<string, number> = {};
  (topDealsRaw ?? []).forEach((e: { deal_id: string | null }) => {
    if (e.deal_id) dealClickMap[e.deal_id] = (dealClickMap[e.deal_id] ?? 0) + 1;
  });
  const topDealsList = Object.entries(dealClickMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const tickets = (ticketsRaw ?? []) as Array<{
    id: string;
    subject?: string;
    user_email?: string;
    created_at?: string;
    priority?: string;
  }>;

  const stats = [
    { label: 'Live users', value: liveUsers ?? 0, change: 'active now', trend: 'flat' as const, live: true },
    { label: 'Total users', value: (totalUsers ?? 0).toLocaleString(), change: 'all time', trend: 'up' as const },
    { label: 'New today', value: newToday ?? 0, change: 'since midnight', trend: 'up' as const },
    { label: 'Page views', value: (pageViewsToday ?? 0).toLocaleString(), change: 'today', trend: 'up' as const },
    { label: 'Deal clicks', value: (dealClicksToday ?? 0).toLocaleString(), change: 'today', trend: (dealClicksToday ?? 0) > 0 ? 'up' as const : 'flat' as const },
    { label: 'Open tickets', value: openTickets ?? 0, change: openTickets ? 'need response' : 'all clear', trend: (openTickets ?? 0) > 0 ? 'down' as const : 'flat' as const },
  ];

  const quickActions = [
    { title: 'Manage users', sub: 'View, export, manage all accounts', href: '/admin/users', color: 'oklch(0.55 0.18 250)' },
    { title: 'Manage blogs', sub: 'Generate and edit SEO blog posts', href: '/admin/blogs', color: 'oklch(0.55 0.16 145)' },
    { title: 'Support tickets', sub: 'View and respond to user tickets', href: '/admin/tickets', color: A },
    { title: 'Error log', sub: 'Investigate client-side errors', href: '/admin/errors', color: 'oklch(0.7 0.15 70)' },
  ];

  return (
    <div style={{ padding: '32px 40px 60px', position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Ambient blobs */}
      <div style={{ position: 'absolute', top: -200, right: -100, width: 600, height: 600, background: `radial-gradient(circle, ${A} 0%, transparent 65%)`, opacity: 0.10, filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: -100, left: 200, width: 700, height: 700, background: `radial-gradient(circle, oklch(0.55 0.18 250) 0%, transparent 65%)`, opacity: 0.08, filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.65 0.18 145)', animation: 'pulse-dot 1.4s ease-in-out infinite', display: 'inline-block' }} />
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)' }}>Overview · live</span>
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(40px, 5vw, 60px)', margin: 0, lineHeight: 1, letterSpacing: '-0.035em', fontWeight: 400, color: '#0a0a0a' }}>
              Admin <em style={{ color: A }}>dashboard.</em>
            </h1>
            <div style={{ marginTop: 8, fontFamily: SF, fontSize: 13, color: 'rgba(10,10,10,0.4)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · auto-refresh every 30s
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="lz-glass" style={{ borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, fontFamily: SF, fontSize: 13, cursor: 'pointer', color: '#0a0a0a' }}>
              Last 7 days <span style={{ color: 'rgba(10,10,10,0.35)', fontSize: 10 }}>▼</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="lz-admin-stats-grid" style={{ marginBottom: 24 }}>
          {stats.map((s, i) => (
            <StatCard key={i} label={s.label} value={s.value} change={s.change} trend={s.trend} live={s.live} />
          ))}
        </div>

        {/* Two columns: top deals + errors */}
        <div className="lz-admin-two-col" style={{ marginBottom: 24 }}>
          {/* Top deals */}
          <div className="lz-glass" style={{ borderRadius: 22, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)' }}>Top clicked deals</div>
                <div style={{ fontFamily: SERIF, fontSize: 22, marginTop: 4, letterSpacing: '-0.02em', color: '#0a0a0a' }}>Last 7 days</div>
              </div>
              <Link href="/admin/deals" style={{ fontFamily: SF, fontSize: 12, color: A, textDecoration: 'none' }}>View all →</Link>
            </div>
            {topDealsList.length === 0 ? (
              <div style={{ fontFamily: SF, fontSize: 13, color: 'rgba(10,10,10,0.3)', padding: '20px 0' }}>No deal clicks yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {topDealsList.map(([dealId, count], i) => (
                  <div key={dealId} style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: 12, alignItems: 'center', padding: '13px 0', borderTop: i === 0 ? 'none' : '1px solid rgba(10,10,10,0.06)' }}>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(10,10,10,0.3)' }}>0{i + 1}</span>
                    <span style={{ fontFamily: SF, fontSize: 13, color: 'rgba(10,10,10,0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dealId}</span>
                    <span style={{ fontFamily: SF, fontSize: 13, fontWeight: 600, color: A, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent errors */}
          <div className="lz-glass" style={{ borderRadius: 22, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)' }}>Recent errors</div>
                <div style={{ fontFamily: SERIF, fontSize: 22, marginTop: 4, letterSpacing: '-0.02em', color: '#0a0a0a' }}>Last 24 hours</div>
              </div>
              <Link href="/admin/errors" style={{ fontFamily: SF, fontSize: 12, color: A, textDecoration: 'none' }}>Open log →</Link>
            </div>
            {(totalErrors ?? 0) === 0 ? (
              <div style={{ fontFamily: SF, fontSize: 13, color: 'rgba(10,10,10,0.3)', padding: '20px 0' }}>No errors logged</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(recentErrors ?? []).map((e: { message?: string; page?: string; created_at?: string }, i) => (
                  <div key={i} style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: i === 0 ? A : 'rgba(10,10,10,0.2)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: MONO, fontSize: 12, color: 'rgba(10,10,10,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {e.message ?? 'Unknown error'}
                      </div>
                      <div style={{ fontFamily: SF, fontSize: 11, color: 'rgba(10,10,10,0.4)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {e.page ?? '—'}
                      </div>
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(10,10,10,0.35)', flexShrink: 0 }}>
                      {e.created_at ? new Date(e.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tickets table */}
        <div className="lz-glass" style={{ borderRadius: 22, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)' }}>Open tickets</div>
              <div style={{ fontFamily: SERIF, fontSize: 22, marginTop: 4, letterSpacing: '-0.02em', color: '#0a0a0a' }}>Needs response</div>
            </div>
            <Link href="/admin/tickets" style={{ fontFamily: SF, fontSize: 12, color: A, textDecoration: 'none' }}>View all →</Link>
          </div>
          {tickets.length === 0 ? (
            <div style={{ fontFamily: SF, fontSize: 13, color: 'rgba(10,10,10,0.3)', padding: '12px 0' }}>All caught up — no open tickets</div>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 220px 80px 90px', gap: 16, padding: '6px 0 10px', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
                {['ID', 'Subject', 'User', 'Age', ''].map(h => (
                  <span key={h} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)' }}>{h}</span>
                ))}
              </div>
              {tickets.map(t => {
                const ageMs = t.created_at ? Date.now() - new Date(t.created_at).getTime() : 0;
                const ageStr = ageMs < 3600000 ? `${Math.round(ageMs / 60000)}m` : ageMs < 86400000 ? `${Math.round(ageMs / 3600000)}h` : `${Math.round(ageMs / 86400000)}d`;
                return (
                  <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 220px 80px 90px', gap: 16, padding: '13px 0', borderBottom: '1px solid rgba(10,10,10,0.06)', alignItems: 'center' }}>
                    <span style={{ fontFamily: MONO, fontSize: 12, color: 'rgba(10,10,10,0.5)' }}>#{t.id?.slice(-4) ?? '—'}</span>
                    <span style={{ fontFamily: SF, fontSize: 14, color: '#0a0a0a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject ?? 'No subject'}</span>
                    <span style={{ fontFamily: SF, fontSize: 12, color: 'rgba(10,10,10,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.user_email ?? '—'}</span>
                    <span style={{ fontFamily: MONO, fontSize: 12, color: 'rgba(10,10,10,0.4)' }}>{ageStr}</span>
                    <Link href="/admin/tickets" style={{ fontFamily: SF, fontSize: 12, color: A, textDecoration: 'none', textAlign: 'right' }}>Open →</Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="lz-admin-actions-grid">
          {quickActions.map(a => (
            <Link key={a.title} href={a.href} style={{ textDecoration: 'none' }}>
              <div
                className="lz-glass lz-action-card"
                style={{ borderRadius: 18, padding: 18, cursor: 'pointer', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 10, background: a.color, opacity: 0.15 }} />
                <div>
                  <div style={{ fontFamily: SF, fontWeight: 600, fontSize: 15, color: a.color, marginBottom: 4 }}>{a.title}</div>
                  <div style={{ fontFamily: SF, fontSize: 12, color: 'rgba(10,10,10,0.4)', lineHeight: 1.5 }}>{a.sub}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
