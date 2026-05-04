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

function StatusPill({ status }: { status: string }) {
  return (
    <span style={{
      padding: '3px 9px', borderRadius: 999,
      background: STATUS_BG[status] ?? 'rgba(10,10,10,0.06)',
      border: `1px solid ${STATUS_COLOR[status] ?? 'rgba(10,10,10,0.12)'}35`,
      fontFamily: MONO, fontSize: 10, letterSpacing: '0.07em',
      color: STATUS_COLOR[status] ?? MUTED, textTransform: 'uppercase',
      display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
    }}>
      <span style={{ width: 4, height: 4, borderRadius: '50%', background: STATUS_COLOR[status] ?? MUTED }} />
      {status}
    </span>
  );
}

function Thumb({ deal }: { deal: DbDeal }) {
  return (
    <div style={{ width: 52, height: 36, borderRadius: 7, background: 'rgba(10,10,10,0.05)', flexShrink: 0, overflow: 'hidden' }}>
      {deal.images?.[0]
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={deal.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
            <span style={{ fontFamily: MONO, fontSize: 8, color: MUTED, textTransform: 'uppercase' }}>{deal.make[0]}</span>
          </div>
      }
    </div>
  );
}

type Tab = 'overview' | 'listings';

type Props = {
  profile: { full_name: string | null; email: string | null; role: string };
  deals: DbDeal[];
};

export default function SellerDashboardClient({ profile, deals }: Props) {
  const [tab, setTab] = useState<Tab>('overview');

  const name = profile.full_name ?? profile.email ?? 'Seller';
  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const firstName = name.split(' ')[0];

  const live = deals.filter(d => d.status === 'live');
  const pending = deals.filter(d => d.status === 'pending');
  const rejected = deals.filter(d => d.status === 'rejected');

  return (
    <div style={{ background: '#f7f5f2', minHeight: '100vh', color: INK, fontFamily: SF, WebkitFontSmoothing: 'antialiased', position: 'relative', zIndex: 2 }}>

      {/* ── MOBILE STICKY HEADER ─────────────────────────────── */}
      <div className="lz-seller-mobile-header" style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(247,245,242,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(10,10,10,0.07)',
        padding: '12px 16px',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: SERIF, fontStyle: 'italic', fontSize: 20, color: INK, letterSpacing: '-0.02em' }}>
          Leased
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/seller/deals/new" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '8px 14px', borderRadius: 999, background: INK, color: 'white', border: 'none', cursor: 'pointer', fontFamily: SF, fontSize: 13, fontWeight: 500 }}>
              + Post
            </button>
          </Link>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: INK, color: 'white', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600, letterSpacing: '-0.02em', flexShrink: 0 }}>
            {initials}
          </div>
        </div>
      </div>

      <div className="lz-seller-grid" style={{ position: 'relative' }}>

        {/* ── DESKTOP SIDEBAR ──────────────────────────────────── */}
        <aside className="lz-seller-sidebar" style={{
          background: 'rgba(247,245,242,0.85)',
          backdropFilter: 'blur(24px) saturate(140%)',
          WebkitBackdropFilter: 'blur(24px) saturate(140%)',
          borderRight: '1px solid rgba(10,10,10,0.06)',
          padding: '24px 16px',
          position: 'sticky', top: 0, height: '100vh',
          overflowY: 'auto', zIndex: 10,
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Logo */}
          <div style={{ padding: '8px 12px 20px' }}>
            <Link href="/" style={{ textDecoration: 'none', color: INK, fontFamily: SERIF, fontStyle: 'italic', fontSize: 20, letterSpacing: '-0.025em' }}>
              Leased
            </Link>
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.18em', color: MUTED, marginTop: 4, textTransform: 'uppercase' }}>Seller partner</div>
          </div>

          {/* Profile chip */}
          <div style={{ padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(10,10,10,0.06)', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: INK, color: 'white', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600, letterSpacing: '-0.02em', flexShrink: 0 }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
              <div style={{ fontSize: 11, color: MUTED }}>{live.length} active listing{live.length !== 1 ? 's' : ''}</div>
            </div>
          </div>

          {/* Nav */}
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', color: MUTED, textTransform: 'uppercase', padding: '0 12px 8px' }}>Manage</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
            {([
              { id: 'overview' as Tab, label: 'Overview', count: null },
              { id: 'listings' as Tab, label: 'My Listings', count: deals.length },
            ]).map(item => {
              const active = tab === item.id;
              return (
                <button key={item.id} onClick={() => setTab(item.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: active ? 'rgba(255,255,255,0.75)' : 'transparent',
                  boxShadow: active ? '0 1px 3px rgba(10,10,10,0.06)' : 'none',
                  color: active ? INK : MUTED2, fontFamily: SF, fontSize: 14,
                  fontWeight: active ? 600 : 400, width: '100%',
                }}>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.count !== null && (
                    <span style={{ fontSize: 11, color: MUTED, fontFamily: MONO }}>{item.count}</span>
                  )}
                </button>
              );
            })}
            <Link href="/seller/deals/new" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, color: MUTED2, fontSize: 14, cursor: 'pointer' }}>
                Post a deal
              </div>
            </Link>
            <Link href="/browse" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, color: MUTED2, fontSize: 14, cursor: 'pointer' }}>
                Browse marketplace
              </div>
            </Link>
          </nav>

          {/* Promo card */}
          <div style={{ padding: 16, borderRadius: 14, background: INK, color: 'white', marginBottom: 'auto' }}>
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 6 }}>Pro tip</div>
            <div style={{ fontFamily: SERIF, fontSize: 15, lineHeight: 1.3, letterSpacing: '-0.01em' }}>Add photos to get 5× more views</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 6, lineHeight: 1.5 }}>Listings with images convert at 3× the rate.</div>
            <Link href="/seller/deals/new" style={{ textDecoration: 'none' }}>
              <button style={{ marginTop: 12, width: '100%', padding: '9px 12px', borderRadius: 999, background: A, color: 'white', border: 'none', fontSize: 13, cursor: 'pointer', fontFamily: SF, fontWeight: 500 }}>
                Post a deal →
              </button>
            </Link>
          </div>

          {/* Sign out */}
          <div style={{ borderTop: '1px solid rgba(10,10,10,0.06)', marginTop: 16, paddingTop: 16 }}>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: 12, color: MUTED, cursor: 'pointer', padding: '4px 12px' }}>Sign out</div>
            </Link>
          </div>
        </aside>

        {/* ── MAIN ──────────────────────────────────────────────── */}
        <main className="lz-seller-main" style={{ padding: '32px 40px 60px', minWidth: 0 }}>
          {tab === 'overview'
            ? <OverviewTab firstName={firstName} deals={deals} live={live} pending={pending} rejected={rejected} setTab={setTab} />
            : <ListingsTab deals={deals} />
          }
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV ────────────────────────────────── */}
      <div className="lz-seller-mobile-nav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(247,245,242,0.95)',
        backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(10,10,10,0.08)',
        padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
        justifyContent: 'space-around', alignItems: 'center',
      }}>
        {([
          { id: 'overview' as Tab, label: 'Overview', icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          )},
          { id: 'listings' as Tab, label: 'Listings', icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/>
            </svg>
          )},
        ]).map(item => {
          const active = tab === item.id;
          return (
            <button key={item.id} onClick={() => setTab(item.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0',
              color: active ? INK : MUTED, fontFamily: SF, fontSize: 11, fontWeight: active ? 600 : 400,
            }}>
              <span style={{ color: active ? A : MUTED }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
        <Link href="/seller/deals/new" style={{ textDecoration: 'none', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: INK, color: 'white', display: 'grid', placeItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </div>
          <span style={{ fontFamily: SF, fontSize: 11, color: MUTED }}>Post deal</span>
        </Link>
      </div>
    </div>
  );
}

/* ─── Overview Tab ──────────────────────────────────────────────────── */
function OverviewTab({ firstName, deals, live, pending, rejected, setTab }: {
  firstName: string; deals: DbDeal[]; live: DbDeal[]; pending: DbDeal[]; rejected: DbDeal[];
  setTab: (t: Tab) => void;
}) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const stats = [
    { label: 'Active', value: live.length || '—', sub: live.length ? 'live now' : 'Post your first', tone: live.length ? 'up' : 'neutral' },
    { label: 'Pending', value: pending.length || '—', sub: pending.length ? 'In review' : 'None pending', tone: 'neutral' },
    { label: 'Rejected', value: rejected.length || '—', sub: rejected.length ? 'Needs revision' : 'None', tone: rejected.length ? 'down' : 'neutral' },
    { label: 'Total', value: deals.length || '—', sub: 'All time', tone: 'neutral' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: MUTED, textTransform: 'uppercase', marginBottom: 6 }}>
            {greeting}, {firstName}
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(30px, 5vw, 48px)', margin: 0, lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400 }}>
            Your <em style={{ color: A }}>dashboard.</em>
          </h1>
          {pending.length > 0 && (
            <div style={{ marginTop: 8, fontSize: 13, color: MUTED }}>
              {pending.length} deal{pending.length !== 1 ? 's' : ''} pending review
              {rejected.length > 0 && <> · <span style={{ color: A }}>{rejected.length} rejected</span></>}
            </div>
          )}
        </div>
        <Link href="/seller/deals/new" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <button style={{ padding: '10px 18px', borderRadius: 999, background: INK, color: 'white', border: 'none', cursor: 'pointer', fontFamily: SF, fontWeight: 500, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            + Post a deal
          </button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="lz-seller-stats">
        {stats.map(s => (
          <div key={s.label} style={{ borderRadius: 16, padding: '16px', background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', boxShadow: '0 1px 4px rgba(10,10,10,0.04)' }}>
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', color: MUTED, textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ fontFamily: SERIF, fontSize: 38, lineHeight: 1, margin: '8px 0 4px', letterSpacing: '-0.03em' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: s.tone === 'up' ? 'oklch(0.55 0.16 145)' : s.tone === 'down' ? A : MUTED }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Recent listings */}
      <div style={{ borderRadius: 20, background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', boxShadow: '0 1px 4px rgba(10,10,10,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(10,10,10,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', color: MUTED, textTransform: 'uppercase' }}>Your listings</div>
            <div style={{ fontFamily: SERIF, fontSize: 20, marginTop: 3, letterSpacing: '-0.02em' }}>
              {deals.length ? `${deals.length} total · ${live.length} live` : 'No listings yet'}
            </div>
          </div>
          {deals.length > 0 && (
            <button onClick={() => setTab('listings')} style={{ padding: '7px 14px', borderRadius: 999, background: 'rgba(10,10,10,0.06)', border: 'none', color: INK, fontFamily: SF, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
              View all →
            </button>
          )}
        </div>

        {deals.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontFamily: SERIF, fontSize: 18, color: MUTED, marginBottom: 6 }}>No listings yet</div>
            <div style={{ fontSize: 13, color: MUTED, marginBottom: 20 }}>Post your first deal to start reaching buyers.</div>
            <Link href="/seller/deals/new" style={{ textDecoration: 'none' }}>
              <button style={{ padding: '11px 22px', borderRadius: 999, background: A, color: 'white', border: 'none', fontFamily: SF, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Post a deal →</button>
            </Link>
          </div>
        ) : (
          <div style={{ padding: '0 4px' }}>
            {deals.slice(0, 5).map((deal, i) => (
              <div key={deal.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderTop: i === 0 ? 'none' : '1px solid rgba(10,10,10,0.05)', flexWrap: 'wrap' }}>
                <Thumb deal={deal} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {deal.year} {deal.make} {deal.model}
                  </div>
                  <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                    {deal.city}, {deal.state} · ${deal.monthly}/mo
                  </div>
                  {deal.rejection_reason && (
                    <div style={{ fontSize: 11, color: A, marginTop: 3 }}>{deal.rejection_reason}</div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <StatusPill status={deal.status} />
                  <span style={{ fontFamily: MONO, fontSize: 9, color: MUTED }}>
                    {new Date(deal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Listings Tab ──────────────────────────────────────────────────── */
function ListingsTab({ deals }: { deals: DbDeal[] }) {
  const [filter, setFilter] = useState<'all' | 'live' | 'pending' | 'rejected'>('all');
  const filtered = filter === 'all' ? deals : deals.filter(d => d.status === filter);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: MUTED, textTransform: 'uppercase', marginBottom: 6 }}>Seller portal</div>
        <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(30px, 5vw, 48px)', margin: 0, lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400 }}>
          My <em style={{ color: A }}>listings.</em>
        </h1>
      </div>

      <div style={{ borderRadius: 20, background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', boxShadow: '0 1px 4px rgba(10,10,10,0.04)', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(10,10,10,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['all', 'live', 'pending', 'rejected'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '6px 13px', borderRadius: 999, border: 'none',
                background: filter === f ? INK : 'rgba(10,10,10,0.06)',
                color: filter === f ? 'white' : MUTED2,
                fontFamily: SF, fontSize: 12, cursor: 'pointer',
                fontWeight: filter === f ? 500 : 400, textTransform: 'capitalize',
              }}>{f}</button>
            ))}
          </div>
          <Link href="/seller/deals/new" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <button style={{ padding: '8px 14px', borderRadius: 999, background: A, color: 'white', border: 'none', fontFamily: SF, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
              + New
            </button>
          </Link>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: MUTED, fontFamily: SF, fontSize: 14 }}>
            No {filter === 'all' ? '' : filter} listings yet
          </div>
        ) : (
          <div style={{ padding: '0 4px' }}>
            {/* Desktop table header */}
            <div className="lz-seller-table-head" style={{ padding: '8px 16px 6px', borderBottom: '1px solid rgba(10,10,10,0.07)' }}>
              {['Vehicle', 'Payment', 'Miles/yr', 'Status', 'Posted'].map(h => (
                <span key={h} style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', color: MUTED, textTransform: 'uppercase' }}>{h}</span>
              ))}
            </div>

            {filtered.map((deal, i) => (
              <div key={deal.id} className="lz-seller-table-row" style={{ padding: '12px 16px', borderTop: i === 0 ? 'none' : '1px solid rgba(10,10,10,0.05)' }}>
                {/* Vehicle (always shown) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <Thumb deal={deal} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {deal.year} {deal.make} {deal.model}
                    </div>
                    <div style={{ fontSize: 11, color: MUTED, marginTop: 1 }}>
                      {deal.trim ? `${deal.trim} · ` : ''}{deal.city}, {deal.state}
                    </div>
                    {deal.rejection_reason && (
                      <div style={{ fontSize: 11, color: A, marginTop: 2 }}>{deal.rejection_reason}</div>
                    )}
                    {/* Mobile-only inline summary */}
                    <div className="lz-seller-mobile-inline" style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>${deal.monthly}<span style={{ fontSize: 11, fontWeight: 400, color: MUTED }}>/mo</span></span>
                      <span style={{ fontSize: 11, color: MUTED2, fontFamily: MONO }}>{(deal.miles_per_year / 1000).toFixed(0)}k mi/yr</span>
                      <StatusPill status={deal.status} />
                      <span style={{ fontFamily: MONO, fontSize: 9, color: MUTED }}>
                        {new Date(deal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop-only columns */}
                <span className="lz-seller-desktop-col" style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
                  ${deal.monthly}<span style={{ fontSize: 11, color: MUTED }}>/mo</span>
                </span>
                <span className="lz-seller-desktop-col" style={{ fontSize: 12, color: MUTED2, fontFamily: MONO }}>
                  {(deal.miles_per_year / 1000).toFixed(0)}k
                </span>
                <span className="lz-seller-desktop-col"><StatusPill status={deal.status} /></span>
                <span className="lz-seller-desktop-col" style={{ fontFamily: MONO, fontSize: 10, color: MUTED }}>
                  {new Date(deal.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
