'use client';

import { useState, useMemo } from 'react';
import { CarDeal } from '@/lib/types';
import DealCard from './DealCard';

const TYPES = ['ALL', 'SEDAN', 'SUV', 'COUPE', 'TRUCK', 'EV'] as const;
const DRIVES = ['ALL', 'AWD', 'RWD', 'FWD', '4WD'] as const;
const SORTS = [
  { label: 'PRICE ↑', fn: (a: CarDeal, b: CarDeal) => a.monthly - b.monthly },
  { label: 'PRICE ↓', fn: (a: CarDeal, b: CarDeal) => b.monthly - a.monthly },
  { label: 'EXPIRING', fn: (a: CarDeal, b: CarDeal) => a.expiresAt.getTime() - b.expiresAt.getTime() },
];

export default function BrowseGrid({ deals }: { deals: CarDeal[] }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [driveFilter, setDriveFilter] = useState('ALL');
  const [sortIdx, setSortIdx] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = useMemo(() => {
    return deals
      .filter(d => {
        const matchType = typeFilter === 'ALL' || d.carType.toUpperCase() === typeFilter;
        const matchDrive = driveFilter === 'ALL' || d.drive === driveFilter;
        const matchSearch = search === '' ||
          `${d.make} ${d.model} ${d.trim} ${d.city} ${d.state}`.toLowerCase()
            .includes(search.toLowerCase());
        return matchType && matchDrive && matchSearch;
      })
      .sort(SORTS[sortIdx].fn);
  }, [deals, typeFilter, driveFilter, search, sortIdx]);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 32px 80px' }}>

      {/* Filter bar */}
      <div style={{
        position: 'sticky',
        top: 52,
        zIndex: 90,
        background: 'rgba(8,8,8,0.9)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '12px 0',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
      }}>

        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: `1px solid ${searchFocused ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
          background: searchFocused ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
          padding: '8px 14px',
          minWidth: 220,
          transition: 'all 0.2s',
        }}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
            <path d="M9 9 L12.5 12.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Make, model, city…"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.8)',
              fontFamily: 'var(--font-barlow)',
              fontSize: 12,
              width: 160,
            }}
          />
        </div>

        {/* Type filters */}
        <div style={{ display: 'flex', gap: 4 }}>
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                padding: '7px 12px',
                border: `1px solid ${typeFilter === t ? 'rgba(255,40,0,0.5)' : 'rgba(255,255,255,0.08)'}`,
                background: typeFilter === t ? 'rgba(255,40,0,0.12)' : 'transparent',
                color: typeFilter === t ? '#FF2800' : 'rgba(255,255,255,0.4)',
                fontFamily: 'var(--font-barlow-cond)',
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.08em',
                transition: 'all 0.15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Drive filters */}
        <div style={{ display: 'flex', gap: 4 }}>
          {DRIVES.map(d => (
            <button
              key={d}
              onClick={() => setDriveFilter(d)}
              style={{
                padding: '7px 10px',
                border: `1px solid ${driveFilter === d ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                background: driveFilter === d ? 'rgba(255,255,255,0.07)' : 'transparent',
                color: driveFilter === d ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
                fontFamily: 'var(--font-barlow-cond)',
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.06em',
                transition: 'all 0.15s',
              }}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {SORTS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setSortIdx(i)}
              style={{
                padding: '7px 12px',
                border: `1px solid ${sortIdx === i ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
                background: sortIdx === i ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: sortIdx === i ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                fontFamily: 'var(--font-barlow-cond)',
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.06em',
                transition: 'all 0.15s',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{
        padding: '20px 0 16px',
        fontFamily: 'var(--font-barlow-cond)',
        fontWeight: 600,
        fontSize: 11,
        letterSpacing: '0.12em',
        color: 'rgba(255,255,255,0.25)',
      }}>
        {filtered.length} DROP{filtered.length !== 1 ? 'S' : ''} LIVE
        {typeFilter !== 'ALL' && ` · ${typeFilter}`}
        {driveFilter !== 'ALL' && ` · ${driveFilter}`}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '100px 0',
          fontFamily: 'var(--font-barlow-cond)',
          fontSize: 16,
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.06em',
        }}>
          NO DROPS MATCH YOUR FILTERS
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1,
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          {filtered.map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </div>
  );
}
