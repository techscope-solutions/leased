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
  const [showSheet, setShowSheet] = useState(false);

  const activeFilterCount = (typeFilter !== 'ALL' ? 1 : 0) + (driveFilter !== 'ALL' ? 1 : 0);

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
    <div className="r-browse-outer">

      {/* Filter bar */}
      <div
        className="r-filter-bar"
        style={{
          position: 'sticky',
          top: 52,
          zIndex: 90,
          background: 'rgba(8,8,8,0.9)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '12px 0',
        }}
      >

        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: `1px solid ${searchFocused ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
          background: searchFocused ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
          padding: '8px 14px',
          borderRadius: 12,
          minWidth: 220,
          flex: 1,
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
              flex: 1,
              minWidth: 0,
            }}
          />
        </div>

        {/* Desktop: type + drive filter chips */}
        <div className="r-filter-desktop-only">
          <div className="r-filter-chips">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                style={{
                  padding: '7px 14px',
                  border: `1px solid ${typeFilter === t ? 'rgba(255,40,0,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  background: typeFilter === t ? 'rgba(255,40,0,0.12)' : 'transparent',
                  color: typeFilter === t ? '#FF2800' : 'rgba(255,255,255,0.55)',
                  fontFamily: 'var(--font-barlow-cond)',
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  borderRadius: 99,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="r-filter-chips">
            {DRIVES.map(d => (
              <button
                key={d}
                onClick={() => setDriveFilter(d)}
                style={{
                  padding: '7px 12px',
                  border: `1px solid ${driveFilter === d ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  background: driveFilter === d ? 'rgba(255,255,255,0.07)' : 'transparent',
                  color: driveFilter === d ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
                  fontFamily: 'var(--font-barlow-cond)',
                  fontWeight: 600,
                  fontSize: 11,
                  letterSpacing: '0.06em',
                  borderRadius: 99,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: filter button */}
        <button
          className="r-filter-mobile-btn"
          onClick={() => setShowSheet(true)}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '8px 16px',
            border: `1px solid ${activeFilterCount > 0 ? 'rgba(255,40,0,0.5)' : 'rgba(255,255,255,0.12)'}`,
            background: activeFilterCount > 0 ? 'rgba(255,40,0,0.1)' : 'rgba(255,255,255,0.04)',
            borderRadius: 99,
            color: activeFilterCount > 0 ? '#FF2800' : 'rgba(255,255,255,0.7)',
            fontFamily: 'var(--font-barlow-cond)',
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.1em',
            cursor: 'pointer',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.7 }}>
            <path d="M1 2h12M3 7h8M5 12h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          FILTERS{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ''}
        </button>

        {/* Sort */}
        <div className="r-filter-sort">
          {SORTS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setSortIdx(i)}
              style={{
                padding: '7px 14px',
                border: `1px solid ${sortIdx === i ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
                background: sortIdx === i ? 'rgba(255,255,255,0.06)' : 'transparent',
                color: sortIdx === i ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-barlow-cond)',
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.06em',
                borderRadius: 99,
                cursor: 'pointer',
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
        <div className="r-deals-grid">
          {filtered.map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}
      {/* Filter bottom sheet — mobile */}
      {showSheet && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowSheet(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 300,
              background: 'rgba(0,0,0,0.72)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
          />

          {/* Sheet */}
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 301,
            background: '#0e0e0e',
            border: '1px solid rgba(255,255,255,0.1)',
            borderBottom: 'none',
            borderRadius: '24px 24px 0 0',
            padding: '12px 20px 80px',
            animation: 'sheet-up 0.3s cubic-bezier(0.23,1,0.32,1)',
          }}>
            {/* Handle */}
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.18)', margin: '0 auto 24px' }} />

            {/* Type */}
            <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>
              TYPE
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  style={{
                    padding: '9px 18px',
                    border: `1px solid ${typeFilter === t ? 'rgba(255,40,0,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    background: typeFilter === t ? 'rgba(255,40,0,0.12)' : 'transparent',
                    color: typeFilter === t ? '#FF2800' : 'rgba(255,255,255,0.6)',
                    fontFamily: 'var(--font-barlow-cond)',
                    fontWeight: 700, fontSize: 12, letterSpacing: '0.08em',
                    borderRadius: 99, cursor: 'pointer',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Drive */}
            <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>
              DRIVETRAIN
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
              {DRIVES.map(d => (
                <button
                  key={d}
                  onClick={() => setDriveFilter(d)}
                  style={{
                    padding: '9px 18px',
                    border: `1px solid ${driveFilter === d ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)'}`,
                    background: driveFilter === d ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: driveFilter === d ? '#fff' : 'rgba(255,255,255,0.6)',
                    fontFamily: 'var(--font-barlow-cond)',
                    fontWeight: 600, fontSize: 12, letterSpacing: '0.06em',
                    borderRadius: 99, cursor: 'pointer',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => { setTypeFilter('ALL'); setDriveFilter('ALL'); }}
                  style={{
                    padding: '14px 20px', borderRadius: 14,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.5)',
                    fontFamily: 'var(--font-barlow-cond)', fontWeight: 700,
                    fontSize: 12, letterSpacing: '0.08em', cursor: 'pointer',
                  }}
                >
                  RESET
                </button>
              )}
              <button
                onClick={() => setShowSheet(false)}
                style={{
                  flex: 1, padding: '14px', borderRadius: 14,
                  background: 'rgba(255,40,0,0.9)',
                  border: '1px solid rgba(255,80,40,0.4)',
                  boxShadow: '0 4px 24px rgba(255,40,0,0.3)',
                  color: '#fff',
                  fontFamily: 'var(--font-barlow-cond)', fontWeight: 800,
                  fontSize: 13, letterSpacing: '0.1em', cursor: 'pointer',
                }}
              >
                SHOW {filtered.length} DROP{filtered.length !== 1 ? 'S' : ''}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
