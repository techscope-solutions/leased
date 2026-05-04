'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CarDeal } from '@/lib/types';
import CountdownTimer from './CountdownTimer';

const A = 'oklch(0.55 0.22 18)';
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif';
const SFD = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';

const FILTERS = ['All', 'Under $400', 'EV', 'SUV', 'Luxury', 'Zero Down'];

function matchesFilter(deal: CarDeal, filter: string): boolean {
  if (filter === 'All') return true;
  if (filter === 'Under $400') return deal.monthly < 400;
  if (filter === 'EV') return deal.carType === 'EV';
  if (filter === 'SUV') return deal.carType === 'SUV';
  if (filter === 'Luxury') return deal.category === 'Luxury';
  if (filter === 'Zero Down') return deal.zeroDeal;
  return true;
}

export default function HomepageDeals({ dealsByCategory }: {
  dealsByCategory: { Daily: CarDeal[]; Luxury: CarDeal[]; Supercar: CarDeal[] };
}) {
  const [filter, setFilter] = useState('All');

  const allDeals = [
    ...dealsByCategory.Daily,
    ...dealsByCategory.Luxury,
    ...dealsByCategory.Supercar,
  ].slice(0, 9);

  const filtered = allDeals.filter(d => matchesFilter(d, filter));

  return (
    <section className="lz-deals-section">
      {/* Header row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 32,
        gap: 24,
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(10,10,10,0.06)', color: 'rgba(10,10,10,0.7)',
            padding: '6px 12px', borderRadius: 999,
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
          }}>
            01 — Browse
          </div>
          <h2 style={{
            fontSize: 'clamp(40px, 5vw, 64px)',
            lineHeight: 1,
            margin: '14px 0 0',
            letterSpacing: '-0.03em',
            fontWeight: 600,
            fontFamily: SFD,
            color: '#0a0a0a',
          }}>
            Hand-picked <span style={{ fontStyle: 'italic', color: A }}>this week</span>.
          </h2>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                border: '1px solid rgba(10,10,10,0.16)',
                cursor: 'pointer',
                fontFamily: SF,
                background: filter === f ? '#0a0a0a' : 'transparent',
                color: filter === f ? 'white' : 'rgba(10,10,10,0.7)',
                padding: '8px 14px',
                fontSize: 13,
                fontWeight: 500,
                borderRadius: 999,
                transition: 'all 0.15s ease',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Deal grid */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center' as const, padding: '48px 24px',
          color: 'rgba(10,10,10,0.4)', fontFamily: SF, fontSize: 15,
        }}>
          No deals match this filter right now.
        </div>
      ) : (
        <div className="lz-deals-grid">
          {filtered.slice(0, 6).map(deal => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}

      {/* View all */}
      <div style={{ marginTop: 36, display: 'flex', justifyContent: 'center' }}>
        <Link href="/browse" style={{ textDecoration: 'none' }}>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 22px', borderRadius: 999,
            fontFamily: SF, fontWeight: 500, fontSize: 15,
            background: 'transparent', color: '#0a0a0a',
            border: '1px solid rgba(10,10,10,0.16)',
            cursor: 'pointer',
          }}>
            View all deals
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
          </button>
        </Link>
      </div>
    </section>
  );
}

function DealCard({ deal }: { deal: CarDeal }) {
  const [hov, setHov] = useState(false);
  const isUrgent = (deal.expiresAt.getTime() - Date.now()) < 3 * 3600 * 1000;
  const img = deal.images?.[0];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'white',
        borderRadius: 22,
        overflow: 'hidden',
        border: '1px solid rgba(10,10,10,0.08)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hov ? '0 30px 60px -30px rgba(10,10,10,0.18)' : 'none',
        cursor: 'pointer',
      }}
    >
      {/* Image area */}
      <div style={{ padding: '12px 12px 0' }}>
        <div style={{
          height: 180, borderRadius: 14, overflow: 'hidden', position: 'relative',
          background: img ? undefined : `repeating-linear-gradient(135deg, rgba(10,10,10,0.04) 0 1px, transparent 1px 12px), linear-gradient(180deg, #e8e5df 0%, #d8d4cc 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={`${deal.year} ${deal.make} ${deal.model}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: 10, textTransform: 'uppercase' as const, letterSpacing: '0.08em',
              color: 'rgba(10,10,10,0.4)',
              background: 'rgba(247,245,242,0.8)', padding: '4px 8px', borderRadius: 4,
            }}>
              {deal.year} · {deal.make.toLowerCase()} · {deal.model.toLowerCase()}
            </span>
          )}
          {deal.zeroDeal && (
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: A, color: 'white',
              padding: '4px 10px', borderRadius: 999,
              fontSize: 11, fontWeight: 500, fontFamily: SF,
            }}>Zero down</div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
          <span style={{ fontSize: 12, color: 'rgba(10,10,10,0.5)', fontFamily: SF }}>
            {deal.year} · {deal.make}
          </span>
          <span style={{ fontSize: 11, color: 'rgba(10,10,10,0.45)', fontFamily: SF }}>
            {deal.city}, {deal.state}
          </span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.015em', fontFamily: SFD, color: '#0a0a0a' }}>
          {deal.model}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(10,10,10,0.45)', marginTop: 2, fontFamily: SF }}>
          {deal.trim}
        </div>

        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 4,
          marginTop: 14, paddingTop: 14,
          borderTop: '1px solid rgba(10,10,10,0.07)',
        }}>
          <span style={{ fontFamily: SFD, fontSize: 38, lineHeight: 0.9, letterSpacing: '-0.02em', fontWeight: 600, color: '#0a0a0a' }}>
            ${deal.monthly}
          </span>
          <span style={{ fontSize: 13, color: 'rgba(10,10,10,0.45)', fontFamily: SF }}>/mo</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(10,10,10,0.45)', fontFamily: SF, textAlign: 'right' as const }}>
            ${deal.dueAtSigning.toLocaleString()} due<br />
            {deal.term}mo · {Math.round(deal.milesPerYear / 1000)}k mi
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <div style={{ fontSize: 11, color: 'rgba(10,10,10,0.4)', fontFamily: SF, display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5z" /><path d="m9 12 2 2 4-4" /></svg>
            Verified {deal.category.toLowerCase()}
          </div>
          <div style={{ color: isUrgent ? A : 'rgba(10,10,10,0.35)', fontSize: 11, fontFamily: SF }}>
            <CountdownTimer expiresAt={deal.expiresAt} />
          </div>
        </div>
      </div>
    </div>
  );
}
