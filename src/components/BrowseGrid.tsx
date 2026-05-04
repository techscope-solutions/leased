'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CarDeal } from '@/lib/types';
import { trackDealClick } from '@/lib/analytics';

const A = 'oklch(0.55 0.22 18)';
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

const BODY_TYPES = ['All', 'Sedan', 'SUV', 'Coupe', 'Truck', 'EV'] as const;
const SORTS = [
  { label: 'Price ↑', fn: (a: CarDeal, b: CarDeal) => a.monthly - b.monthly },
  { label: 'Price ↓', fn: (a: CarDeal, b: CarDeal) => b.monthly - a.monthly },
  { label: 'Expiring', fn: (a: CarDeal, b: CarDeal) => a.expiresAt.getTime() - b.expiresAt.getTime() },
];

function GlassDealCard({ deal, compact = false }: { deal: CarDeal; compact?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    trackDealClick(deal.dropId);
    router.push(`/browse/${deal.id}`);
  };

  if (compact) {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
        style={{
          display: 'flex',
          gap: 0,
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow: hovered
            ? '0 8px 32px rgba(10,10,10,0.08), inset 0 1px 0 rgba(255,255,255,0.8)'
            : '0 2px 12px rgba(10,10,10,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
          borderRadius: 16,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'box-shadow 0.2s, transform 0.2s',
          transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        }}
      >
        <div style={{ width: 120, flexShrink: 0, position: 'relative', background: 'rgba(10,10,10,0.04)' }}>
          {deal.images && deal.images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={deal.images[0]}
              alt={`${deal.year} ${deal.make} ${deal.model}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'rgba(10,10,10,0.2)', textTransform: 'uppercase' }}>{deal.make}</span>
            </div>
          )}
        </div>
        <div style={{ flex: 1, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: SF, fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: '#0a0a0a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {deal.year} {deal.make} {deal.model}
            </div>
            <div style={{ fontFamily: SF, fontSize: 12, color: 'rgba(10,10,10,0.45)', marginTop: 2 }}>
              {deal.trim} · {deal.carType} · {deal.city}, {deal.state}
            </div>
          </div>
          <div style={{ fontFamily: SF, fontSize: 22, fontWeight: 700, color: A, letterSpacing: '-0.025em', flexShrink: 0 }}>
            ${deal.monthly}<span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(10,10,10,0.35)' }}>/mo</span>
          </div>
          <button
            style={{
              padding: '8px 16px', borderRadius: 999,
              background: '#0a0a0a', color: 'white', border: 'none', cursor: 'pointer',
              fontFamily: SF, fontSize: 13, fontWeight: 500, flexShrink: 0,
            }}
          >
            Apply
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(20px) saturate(140%)',
        WebkitBackdropFilter: 'blur(20px) saturate(140%)',
        border: '1px solid rgba(255,255,255,0.7)',
        boxShadow: hovered
          ? '0 12px 40px rgba(10,10,10,0.10), inset 0 1px 0 rgba(255,255,255,0.8)'
          : '0 4px 16px rgba(10,10,10,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
        borderRadius: 22,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, transform 0.25s cubic-bezier(0.23,1,0.32,1)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      <div style={{ height: 180, position: 'relative', overflow: 'hidden', background: 'rgba(10,10,10,0.04)' }}>
        {deal.images && deal.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={deal.images[0]}
            alt={`${deal.year} ${deal.make} ${deal.model}`}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
            }}
          />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(10,10,10,0.2)', letterSpacing: '0.06em' }}>{deal.make} {deal.model}</span>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
          <span style={{
            background: A, color: 'white',
            padding: '5px 11px', borderRadius: 999,
            fontFamily: SF, fontSize: 13, fontWeight: 600,
          }}>
            ${deal.monthly}/mo
          </span>
        </div>
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <span style={{
            background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            color: '#0a0a0a',
            padding: '4px 9px', borderRadius: 999,
            fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em',
          }}>
            {deal.carType}
          </span>
        </div>
      </div>

      <div style={{ padding: '14px 16px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SF, fontSize: 17, fontWeight: 600, letterSpacing: '-0.025em', color: '#0a0a0a', marginBottom: 3 }}>
            {deal.year} {deal.make} {deal.model}
          </div>
          <div style={{ fontFamily: SF, fontSize: 13, color: 'rgba(10,10,10,0.45)' }}>
            {deal.trim} · {deal.city}, {deal.state}
          </div>
        </div>
        <button
          title="View deal"
          style={{
            flexShrink: 0,
            width: 32, height: 32, borderRadius: 999,
            background: 'rgba(10,10,10,0.06)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(10,10,10,0.5)',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { const el = e.currentTarget; el.style.background = '#0a0a0a'; el.style.color = 'white'; }}
          onMouseLeave={e => { const el = e.currentTarget; el.style.background = 'rgba(10,10,10,0.06)'; el.style.color = 'rgba(10,10,10,0.5)'; }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 2H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9" />
            <path d="M8 1h5v5" />
            <path d="M13 1L6 8" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function BrowseGrid({ deals }: { deals: CarDeal[] }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [sortIdx, setSortIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [budget, setBudget] = useState(1500);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return deals
      .filter(d => {
        const matchType = typeFilter === 'All' || d.carType.toLowerCase() === typeFilter.toLowerCase();
        const matchBudget = budget >= 1500 || d.monthly <= budget;
        const matchSearch = !search ||
          `${d.make} ${d.model} ${d.trim} ${d.city} ${d.state}`.toLowerCase().includes(search.toLowerCase());
        return matchType && matchBudget && matchSearch;
      })
      .sort(SORTS[sortIdx].fn);
  }, [deals, typeFilter, budget, search, sortIdx]);

  const quickChips = [
    { label: 'All', active: typeFilter === 'All' && budget >= 1500, onClick: () => { setTypeFilter('All'); setBudget(1500); } },
    { label: 'Under $400', active: budget === 400, onClick: () => setBudget(budget === 400 ? 1500 : 400) },
    { label: 'EV', active: typeFilter === 'EV', onClick: () => setTypeFilter(typeFilter === 'EV' ? 'All' : 'EV') },
    { label: 'SUV', active: typeFilter === 'SUV', onClick: () => setTypeFilter(typeFilter === 'SUV' ? 'All' : 'SUV') },
    { label: 'Sedan', active: typeFilter === 'Sedan', onClick: () => setTypeFilter(typeFilter === 'Sedan' ? 'All' : 'Sedan') },
    { label: 'Truck', active: typeFilter === 'Truck', onClick: () => setTypeFilter(typeFilter === 'Truck' ? 'All' : 'Truck') },
  ];

  const hasActiveFilters = typeFilter !== 'All' || budget < 1500 || !!search;

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Ambient blobs */}
      <div style={{ position: 'absolute', top: -200, right: -100, width: 700, height: 700, background: `radial-gradient(circle, oklch(0.55 0.22 18) 0%, transparent 65%)`, opacity: 0.12, filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: 100, left: -100, width: 600, height: 600, background: `radial-gradient(circle, oklch(0.55 0.18 250) 0%, transparent 65%)`, opacity: 0.08, filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '40%', left: '30%', width: 500, height: 500, background: `radial-gradient(circle, oklch(0.65 0.18 60) 0%, transparent 65%)`, opacity: 0.07, filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Sticky search bar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(247,245,242,0.88)',
          backdropFilter: 'blur(24px) saturate(140%)',
          WebkitBackdropFilter: 'blur(24px) saturate(140%)',
          borderBottom: '1px solid rgba(10,10,10,0.06)',
          padding: '10px 24px',
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* Search input */}
            <div style={{
              flex: 1,
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.8)',
              borderRadius: 999, padding: '10px 16px',
              boxShadow: '0 2px 8px rgba(10,10,10,0.05)',
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="5.5" cy="5.5" r="4" stroke="rgba(10,10,10,0.35)" strokeWidth="1.5" />
                <path d="M9 9 L12.5 12.5" stroke="rgba(10,10,10,0.35)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                className="lz-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search make, model, city…"
                style={{
                  background: 'transparent', border: 'none',
                  color: '#0a0a0a', fontFamily: SF, fontSize: 14, flex: 1, minWidth: 0,
                }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(10,10,10,0.35)', fontFamily: SF, fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sortIdx}
              onChange={e => setSortIdx(Number(e.target.value))}
              style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.8)',
                borderRadius: 999, padding: '10px 16px',
                fontFamily: SF, fontSize: 13, color: '#0a0a0a', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(10,10,10,0.05)',
              }}
            >
              {SORTS.map((s, i) => <option key={i} value={i}>{s.label}</option>)}
            </select>

            {/* View toggle */}
            <div style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(255,255,255,0.8)',
              borderRadius: 999, overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(10,10,10,0.05)',
            }}>
              {(['grid', 'list'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    padding: '10px 14px', border: 'none', cursor: 'pointer',
                    background: viewMode === mode ? '#0a0a0a' : 'transparent',
                    color: viewMode === mode ? 'white' : 'rgba(10,10,10,0.45)',
                    transition: 'all 0.15s',
                    fontFamily: SF, fontSize: 15, lineHeight: 1,
                  }}
                >
                  {mode === 'grid' ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                      <rect x="0" y="0" width="6" height="6" rx="1" /><rect x="8" y="0" width="6" height="6" rx="1" />
                      <rect x="0" y="8" width="6" height="6" rx="1" /><rect x="8" y="8" width="6" height="6" rx="1" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M1 4h12M1 8h12M1 12h12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick chips */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 24px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Filters toggle — mobile only */}
          <button
            className="lz-browse-filters-btn"
            onClick={() => setFiltersOpen(o => !o)}
            style={{
              padding: '7px 14px', borderRadius: 999,
              background: filtersOpen ? '#0a0a0a' : 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${filtersOpen ? 'transparent' : 'rgba(255,255,255,0.75)'}`,
              color: filtersOpen ? 'white' : '#0a0a0a',
              fontFamily: SF, fontSize: 13, cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(10,10,10,0.04)',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}><path d="M4 6h16M7 12h10M10 18h4" /></svg>
            Filters{hasActiveFilters ? ' ·' : ''}
          </button>
          {quickChips.filter(c => c.label !== 'All').map(chip => (
            <button
              key={chip.label}
              onClick={chip.onClick}
              style={{
                padding: '7px 14px', borderRadius: 999,
                background: chip.active ? '#0a0a0a' : 'rgba(255,255,255,0.6)',
                backdropFilter: chip.active ? 'none' : 'blur(12px)',
                WebkitBackdropFilter: chip.active ? 'none' : 'blur(12px)',
                border: `1px solid ${chip.active ? 'transparent' : 'rgba(255,255,255,0.75)'}`,
                color: chip.active ? 'white' : '#0a0a0a',
                fontFamily: SF, fontSize: 13, cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(10,10,10,0.04)',
                transition: 'all 0.15s',
              }}
            >
              {chip.label}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em', color: 'rgba(10,10,10,0.4)', display: 'flex', alignItems: 'center' }}>
            {filtered.length} deal{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="lz-browse-layout" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
          {/* Sidebar — always visible on desktop, toggle on mobile */}
          <aside className={`lz-browse-sidebar${filtersOpen ? '' : ' lz-browse-sidebar-hidden'}`}>
            <div className="lz-glass" style={{ borderRadius: 20, padding: 20 }}>
              <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', marginBottom: 18 }}>Filters</div>

              {/* Budget */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)' }}>Budget</span>
                  <span style={{ fontFamily: SF, fontSize: 13, fontWeight: 600, color: '#0a0a0a' }}>
                    {budget >= 1500 ? 'Any' : `$${budget}/mo`}
                  </span>
                </div>
                <input
                  type="range" min="200" max="1500" step="50"
                  value={budget}
                  onChange={e => setBudget(Number(e.target.value))}
                  style={{ width: '100%', accentColor: A }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: MONO, fontSize: 10, color: 'rgba(10,10,10,0.3)' }}>
                  <span>$200</span><span>Any</span>
                </div>
              </div>

              {/* Body type */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)', marginBottom: 10 }}>Body type</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {BODY_TYPES.map(type => (
                    <label
                      key={type}
                      style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', fontFamily: SF, fontSize: 14, color: typeFilter === type ? '#0a0a0a' : 'rgba(10,10,10,0.6)', fontWeight: typeFilter === type ? 500 : 400 }}
                    >
                      <input
                        type="radio"
                        name="bodyType"
                        checked={typeFilter === type}
                        onChange={() => setTypeFilter(type)}
                        style={{ accentColor: A, cursor: 'pointer' }}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)', marginBottom: 10 }}>Sort by</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {SORTS.map((s, i) => (
                    <button
                      key={s.label}
                      onClick={() => setSortIdx(i)}
                      style={{
                        padding: '8px 12px', borderRadius: 10, border: 'none', textAlign: 'left', cursor: 'pointer',
                        background: sortIdx === i ? 'rgba(255,255,255,0.7)' : 'transparent',
                        color: sortIdx === i ? '#0a0a0a' : 'rgba(10,10,10,0.5)',
                        fontFamily: SF, fontSize: 13, fontWeight: sortIdx === i ? 500 : 400,
                        boxShadow: sortIdx === i ? '0 1px 2px rgba(10,10,10,0.04)' : 'none',
                        transition: 'all 0.15s',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={() => { setTypeFilter('All'); setBudget(1500); setSearch(''); }}
                  style={{
                    width: '100%', padding: '9px', borderRadius: 999,
                    background: 'transparent', border: '1px solid rgba(10,10,10,0.12)',
                    color: 'rgba(10,10,10,0.5)', fontFamily: SF, fontSize: 13, cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                >
                  Reset filters
                </button>
              )}
            </div>
          </aside>

          {/* Results */}
          <div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontFamily: SF, fontSize: 18, fontWeight: 500, color: 'rgba(10,10,10,0.3)', marginBottom: 8 }}>No deals match your filters</div>
                <button
                  onClick={() => { setTypeFilter('All'); setBudget(1500); setSearch(''); }}
                  style={{ padding: '10px 20px', borderRadius: 999, background: '#0a0a0a', color: 'white', border: 'none', cursor: 'pointer', fontFamily: SF, fontSize: 13 }}
                >
                  Reset filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="lz-browse-deals-grid">
                {filtered.map(deal => (
                  <GlassDealCard key={deal.dropId} deal={deal} compact={false} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.map(deal => (
                  <GlassDealCard key={deal.dropId} deal={deal} compact={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
