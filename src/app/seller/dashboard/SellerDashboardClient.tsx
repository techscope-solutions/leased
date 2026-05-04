'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DbDeal } from '@/lib/deals';

const A = 'oklch(0.55 0.22 18)';
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const SERIF = '"Instrument Serif", Georgia, serif';
const INK = '#0a0a0a';
const MUTED = 'rgba(10,10,10,0.4)';
const MUTED2 = 'rgba(10,10,10,0.6)';

function SparkIcon({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"/></svg>;
}
function BoltIcon({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>;
}
function DocIcon({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>;
}
function ChartIcon({ size = 14 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h14M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>;
}

type Props = {
  profile: { full_name: string | null; email: string | null; role: string };
  deals: DbDeal[];
};

type Tab = 'overview' | 'listings';

const STATUS_COLOR: Record<string, string> = {
  live: 'oklch(0.55 0.16 145)',
  pending: 'oklch(0.65 0.14 70)',
  rejected: A,
};
const STATUS_BG: Record<string, string> = {
  live: 'rgba(34,197,94,0.12)',
  pending: 'rgba(200,140,40,0.10)',
  rejected: 'rgba(180,30,20,0.08)',
};

export default function SellerDashboardClient({ profile, deals }: Props) {
  const [tab, setTab] = useState<Tab>('overview');

  const name = profile.full_name ?? profile.email ?? 'Seller';
  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const firstName = name.split(' ')[0];

  const live = deals.filter(d => d.status === 'live');
  const pending = deals.filter(d => d.status === 'pending');
  const rejected = deals.filter(d => d.status === 'rejected');

  const navItems: { id: Tab; label: string; icon: React.ReactNode; badge?: string; dot?: boolean }[] = [
    { id: 'overview', label: 'Overview', icon: <SparkIcon /> },
    { id: 'listings', label: 'My Listings', icon: <BoltIcon />, badge: String(deals.length) },
  ];

  return (
    <div style={{ background: '#f7f5f2', minHeight: '100vh', color: INK, fontFamily: SF, WebkitFontSmoothing: 'antialiased', position: 'relative', overflow: 'hidden', display: 'grid', gridTemplateColumns: '240px 1fr' }} className="lz-seller-grid">
      {/* Ambient blobs */}
      <div style={{ position: 'fixed', top: -200, right: -100, width: 700, height: 700, background: `radial-gradient(circle, ${A} 0%, transparent 65%)`, opacity: 0.10, filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: -100, left: 200, width: 700, height: 700, background: 'radial-gradient(circle, oklch(0.55 0.18 250) 0%, transparent 65%)', opacity: 0.08, filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* SIDEBAR */}
      <aside style={{ background: 'rgba(247,245,242,0.8)', backdropFilter: 'blur(24px) saturate(140%)', WebkitBackdropFilter: 'blur(24px) saturate(140%)', borderRight: '1px solid rgba(10,10,10,0.06)', padding: '24px 16px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', zIndex: 10, display: 'flex', flexDirection: 'column' }} className="lz-seller-sidebar">
        {/* Logo */}
        <div style={{ padding: '8px 12px 20px' }}>
          <Link href="/" style={{ textDecoration: 'none', color: INK, display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 18, letterSpacing: '-0.03em', fontFamily: SERIF, fontStyle: 'italic' }}>
            Leased
          </Link>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', color: MUTED, marginTop: 4, textTransform: 'uppercase' }}>Seller · partner</div>
        </div>

        {/* Profile chip */}
        <div style={{ padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(10,10,10,0.06)', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: INK, color: 'white', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600, letterSpacing: '-0.02em', flexShrink: 0 }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
            <div style={{ fontSize: 11, color: MUTED }}>{live.length} active listing{live.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', color: MUTED, textTransform: 'uppercase', padding: '0 12px 8px' }}>Manage</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 20 }}>
          {navItems.map(item => {
            const isActive = tab === item.id;
            return (
              <button key={item.id} onClick={() => setTab(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left', background: isActive ? 'rgba(255,255,255,0.7)' : 'transparent', boxShadow: isActive ? '0 1px 0 rgba(255,255,255,0.8) inset, 0 1px 2px rgba(10,10,10,0.04)' : 'none', color: isActive ? INK : MUTED2, fontFamily: SF, fontSize: 14, fontWeight: isActive ? 600 : 400, width: '100%' }}>
                <span style={{ color: isActive ? A : MUTED, display: 'inline-flex' }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{ fontSize: 11, color: MUTED, fontFamily: MONO, fontVariantNumeric: 'tabular-nums' }}>{item.badge}</span>
                )}
              </button>
            );
          })}
          <Link href="/seller/deals/new" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, color: MUTED2, fontSize: 14, cursor: 'pointer' }}>
              <span style={{ color: MUTED, display: 'inline-flex' }}><DocIcon /></span>
              Post a deal
            </div>
          </Link>
          <Link href="/browse" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, color: MUTED2, fontSize: 14, cursor: 'pointer' }}>
              <span style={{ color: MUTED, display: 'inline-flex' }}><ChartIcon /></span>
              Browse marketplace
            </div>
          </Link>
        </nav>

        {/* Boost promo card */}
        <div style={{ padding: 16, borderRadius: 14, background: 'rgba(18,18,18,0.92)', color: 'white', marginBottom: 'auto' }}>
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', marginBottom: 6 }}>Pro tip</div>
          <div style={{ fontFamily: SERIF, fontSize: 16, lineHeight: 1.25, letterSpacing: '-0.015em' }}>Add photos to get 5× more views</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 6, lineHeight: 1.5 }}>Listings with images convert at 3× higher rate.</div>
          <Link href="/seller/deals/new" style={{ textDecoration: 'none' }}>
            <button style={{ marginTop: 10, width: '100%', padding: '8px 12px', borderRadius: 999, background: A, color: 'white', border: 'none', fontSize: 12, cursor: 'pointer', fontFamily: SF, fontWeight: 500 }}>Post a deal →</button>
          </Link>
        </div>

        {/* Sign out */}
        <div style={{ borderTop: '1px solid rgba(10,10,10,0.06)', marginTop: 16, paddingTop: 16 }}>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: 12, color: MUTED, cursor: 'pointer', padding: '4px 12px' }}>Sign out</div>
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ padding: '32px 40px 60px', position: 'relative', minWidth: 0, zIndex: 1 }} className="lz-seller-main">
        {tab === 'overview' ? (
          <OverviewTab firstName={firstName} deals={deals} live={live} pending={pending} rejected={rejected} />
        ) : (
          <ListingsTab deals={deals} />
        )}
      </main>
    </div>
  );
}

function OverviewTab({ firstName, deals, live, pending, rejected }: { firstName: string; deals: DbDeal[]; live: DbDeal[]; pending: DbDeal[]; rejected: DbDeal[] }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const stats = [
    { label: 'Active listings', value: String(live.length || '—'), sub: live.length ? `${live.length} live now` : 'Post your first deal', tone: live.length ? 'up' : 'neutral' },
    { label: 'Pending review', value: String(pending.length || '—'), sub: pending.length ? 'Awaiting approval' : 'None pending', tone: 'neutral' },
    { label: 'Rejected', value: String(rejected.length || '—'), sub: rejected.length ? 'Needs revision' : 'None rejected', tone: rejected.length ? 'down' : 'neutral' },
    { label: 'Total listings', value: String(deals.length || '—'), sub: 'All time', tone: 'neutral' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.65 0.18 145)', display: 'inline-block' }} />
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', color: MUTED, textTransform: 'uppercase' }}>{greeting}, {firstName}</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(36px, 5vw, 56px)', margin: 0, lineHeight: 1, letterSpacing: '-0.035em', fontWeight: 400 }}>
            Your <em style={{ color: A }}>dashboard.</em>
          </h1>
          {pending.length > 0 && (
            <div style={{ marginTop: 8, fontSize: 13, color: MUTED }}>
              You have <strong style={{ color: INK }}>{pending.length} deal{pending.length !== 1 ? 's' : ''} pending review</strong>
              {rejected.length > 0 && <> and <strong style={{ color: A }}>{rejected.length} rejected</strong></>}
            </div>
          )}
        </div>
        <Link href="/seller/deals/new" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '11px 20px', borderRadius: 999, background: INK, color: 'white', border: 'none', cursor: 'pointer', fontFamily: SF, fontWeight: 500, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            + Post a deal
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="lz-seller-stats">
        {stats.map((s) => (
          <div key={s.label} className="lz-glass" style={{ borderRadius: 18, padding: 18 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', color: MUTED, textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ fontFamily: SERIF, fontSize: 42, lineHeight: 1, margin: '10px 0 6px', letterSpacing: '-0.03em', color: INK }}>{s.value}</div>
            <div style={{ fontSize: 11, color: s.tone === 'up' ? 'oklch(0.55 0.16 145)' : s.tone === 'down' ? A : MUTED, display: 'flex', alignItems: 'center', gap: 4 }}>
              {s.tone === 'up' ? '↗ ' : s.tone === 'down' ? '↘ ' : '· '}{s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Listings */}
      <div className="lz-glass" style={{ borderRadius: 22, padding: 24, marginTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18, gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: MUTED, textTransform: 'uppercase' }}>Your listings</div>
            <div style={{ fontFamily: SERIF, fontSize: 22, marginTop: 4, letterSpacing: '-0.02em' }}>
              {deals.length ? `${deals.length} total · ${live.length} live` : 'No listings yet'}
            </div>
          </div>
          <Link href="/seller/deals/new" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '8px 16px', borderRadius: 999, background: INK, color: 'white', border: 'none', fontFamily: SF, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>+ New listing</button>
          </Link>
        </div>

        {deals.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <div style={{ fontFamily: SERIF, fontSize: 20, color: MUTED, marginBottom: 8 }}>No listings yet</div>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 20 }}>Post your first deal to start reaching buyers.</div>
            <Link href="/seller/deals/new" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '12px 24px', borderRadius: 999, background: A, color: 'white', border: 'none', fontFamily: SF, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Post a deal →</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {deals.slice(0, 5).map((deal, i) => (
              <div key={deal.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderTop: i === 0 ? 'none' : '1px solid rgba(10,10,10,0.06)', flexWrap: 'wrap' }}>
                {/* Thumb */}
                <div style={{ width: 56, height: 40, borderRadius: 8, background: 'rgba(10,10,10,0.05)', flexShrink: 0, overflow: 'hidden' }}>
                  {deal.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={deal.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: MONO, fontSize: 8, color: MUTED, textTransform: 'uppercase' }}>{deal.make[0]}</span>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deal.year} {deal.make} {deal.model}</div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{deal.drop_id} · {deal.city}, {deal.state} · ${deal.monthly}/mo</div>
                </div>
                {/* Status */}
                <span style={{ padding: '4px 10px', borderRadius: 999, background: STATUS_BG[deal.status], border: `1px solid ${STATUS_COLOR[deal.status]}35`, fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em', color: STATUS_COLOR[deal.status], textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: STATUS_COLOR[deal.status] }} />
                  {deal.status}
                </span>
                {/* Date */}
                <span style={{ fontFamily: MONO, fontSize: 10, color: MUTED, flexShrink: 0 }}>{new Date(deal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                {/* Rejection reason */}
                {deal.rejection_reason && (
                  <div style={{ width: '100%', fontSize: 11, color: A, paddingLeft: 70, marginTop: -8 }}>{deal.rejection_reason}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ListingsTab({ deals }: { deals: DbDeal[] }) {
  const [filter, setFilter] = useState<'all' | 'live' | 'pending' | 'rejected'>('all');
  const filtered = filter === 'all' ? deals : deals.filter(d => d.status === filter);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', color: MUTED, textTransform: 'uppercase', marginBottom: 8 }}>Seller portal</div>
        <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(36px, 5vw, 56px)', margin: 0, lineHeight: 1, letterSpacing: '-0.035em', fontWeight: 400 }}>
          My <em style={{ color: A }}>listings.</em>
        </h1>
      </div>

      <div className="lz-glass" style={{ borderRadius: 22, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'live', 'pending', 'rejected'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 14px', borderRadius: 999, border: 'none', background: filter === f ? INK : 'rgba(255,255,255,0.5)', color: filter === f ? 'white' : MUTED2, fontFamily: SF, fontSize: 12, cursor: 'pointer', fontWeight: filter === f ? 500 : 400, textTransform: 'capitalize' }}>{f}</button>
            ))}
          </div>
          <Link href="/seller/deals/new" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '8px 16px', borderRadius: 999, background: A, color: 'white', border: 'none', fontFamily: SF, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>+ New listing</button>
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: MUTED, fontFamily: SF, fontSize: 14 }}>
            No {filter === 'all' ? '' : filter} listings yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 110px 90px', gap: 16, padding: '6px 0 10px', borderBottom: '1px solid rgba(10,10,10,0.08)' }}>
              {['Vehicle', 'Payment', 'Miles/yr', 'Status', 'Posted'].map(h => (
                <span key={h} style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', color: MUTED, textTransform: 'uppercase' }}>{h}</span>
              ))}
            </div>
            {filtered.map((deal, i) => (
              <div key={deal.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 110px 90px', gap: 16, padding: '14px 0', borderTop: i === 0 ? 'none' : '1px solid rgba(10,10,10,0.05)', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div style={{ width: 52, height: 36, borderRadius: 7, background: 'rgba(10,10,10,0.05)', flexShrink: 0, overflow: 'hidden' }}>
                    {deal.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={deal.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : null}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{deal.year} {deal.make} {deal.model}</div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>{deal.trim} · {deal.city}, {deal.state}</div>
                    {deal.rejection_reason && <div style={{ fontSize: 11, color: A, marginTop: 2 }}>{deal.rejection_reason}</div>}
                  </div>
                </div>
                <span style={{ fontSize: 13, color: INK, fontVariantNumeric: 'tabular-nums' }}>${deal.monthly}<span style={{ fontSize: 11, color: MUTED }}>/mo</span></span>
                <span style={{ fontSize: 12, color: MUTED2, fontFamily: MONO }}>{(deal.miles_per_year / 1000).toFixed(0)}k</span>
                <span style={{ padding: '4px 10px', borderRadius: 999, background: STATUS_BG[deal.status], border: `1px solid ${STATUS_COLOR[deal.status]}35`, fontFamily: MONO, fontSize: 10, letterSpacing: '0.07em', color: STATUS_COLOR[deal.status], textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 5, width: 'fit-content' }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: STATUS_COLOR[deal.status] }} />
                  {deal.status}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 10, color: MUTED }}>{new Date(deal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
