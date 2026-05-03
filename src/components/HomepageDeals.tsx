'use client';

import { useState } from 'react';
import { CarDeal } from '@/lib/types';
import CarSilhouette from './CarSilhouette';
import CountdownTimer from './CountdownTimer';

export default function HomepageDeals({ dealsByCategory }: {
  dealsByCategory: { Daily: CarDeal[]; Luxury: CarDeal[]; Supercar: CarDeal[] };
}) {
  const deals = [
    ...dealsByCategory.Daily.slice(0, 1),
    ...dealsByCategory.Luxury.slice(0, 1),
    ...dealsByCategory.Supercar.slice(0, 1),
  ];

  return (
    <section className="r-hp-deals" style={{ maxWidth: 1400, margin: '0 auto' }}>

      {/* Cards */}
      <div className="r-hp-deals-grid" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        {deals.map(deal => (
          <HomepageDealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  );
}

function HomepageDealCard({ deal }: { deal: CarDeal }) {
  const [hov, setHov] = useState(false);
  const isUrgent = (deal.expiresAt.getTime() - Date.now()) < 3 * 3600 * 1000;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#0e0e0e',
        border: `1px solid ${hov ? 'rgba(255,255,255,0.14)' : 'transparent'}`,
        cursor: 'pointer',
        transition: 'border-color 0.2s',
        overflow: 'hidden',
      }}
    >
      {/* Image */}
      <div style={{ height: 160, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          transform: hov ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
        }}>
          <CarSilhouette type={deal.carType} stripe={deal.stripe} />
        </div>
        {deal.zeroDeal && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: '#FF2800', padding: '3px 8px',
            fontFamily: 'var(--font-barlow-cond)', fontWeight: 800,
            fontSize: 9, letterSpacing: '0.1em', color: '#fff',
          }}>
            ◆ ZERO DOWN
          </div>
        )}
        {deal.slotsLeft !== null && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)',
            padding: '3px 8px', backdropFilter: 'blur(8px)',
            fontFamily: 'var(--font-barlow-cond)', fontWeight: 700,
            fontSize: 9, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.8)',
          }}>
            {deal.slotsLeft} LEFT
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{
          fontFamily: 'var(--font-barlow)', fontSize: 10,
          color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', marginBottom: 2,
        }}>
          {deal.year} · {deal.drive} · {deal.state}
        </div>
        <div style={{
          fontFamily: 'var(--font-barlow-cond)', fontWeight: 900,
          fontSize: 18, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.1,
        }}>
          {deal.make}
        </div>
        <div style={{
          fontFamily: 'var(--font-barlow-cond)', fontWeight: 500,
          fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 1, marginBottom: 10,
        }}>
          {deal.model}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 32, color: '#FF2800', letterSpacing: '-0.03em', lineHeight: 1,
            }}>
              ${deal.monthly.toLocaleString()}
            </span>
            <span style={{
              fontFamily: 'var(--font-barlow-cond)', fontWeight: 600,
              fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 3,
            }}>/MO</span>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: isUrgent ? '#FF2800' : 'rgba(255,255,255,0.4)',
          }}>
            <span style={{
              fontFamily: 'var(--font-barlow-cond)', fontWeight: 600,
              fontSize: 9, letterSpacing: '0.08em',
            }}>ENDS</span>
            <CountdownTimer expiresAt={deal.expiresAt} />
          </div>
        </div>
      </div>
    </div>
  );
}
