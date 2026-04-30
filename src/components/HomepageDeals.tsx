'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CarDeal, DealCategory } from '@/lib/types';
import CarSilhouette from './CarSilhouette';
import CountdownTimer from './CountdownTimer';

const TABS: { label: DealCategory; tag: string; color: string }[] = [
  { label: 'Daily',    tag: 'Practical · Affordable · Everyday',   color: 'rgba(255,255,255,0.7)' },
  { label: 'Luxury',   tag: 'Premium comfort · Status · Refined',   color: '#8b9ab8' },
  { label: 'Supercar', tag: 'Performance · Exotic · Rare',          color: '#b8932a' },
];

export default function HomepageDeals({ dealsByCategory }: {
  dealsByCategory: { Daily: CarDeal[]; Luxury: CarDeal[]; Supercar: CarDeal[] };
}) {
  const [active, setActive] = useState<DealCategory>('Daily');
  const deals = dealsByCategory[active].slice(0, 3);
  const tab = TABS.find(t => t.label === active)!;

  return (
    <section style={{ padding: '0 40px 80px', maxWidth: 1400, margin: '0 auto' }}>

      {/* Section header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: 28,
      }}>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 10,
          }}>
            <span style={{ color: '#FF2800', fontSize: 10 }}>◆</span>
            <span style={{
              fontFamily: 'var(--font-barlow-cond)',
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.4)',
            }}>LIVE DROPS</span>
          </div>

          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 0 }}>
            {TABS.map(t => (
              <button
                key={t.label}
                onClick={() => setActive(t.label)}
                style={{
                  padding: '8px 24px 8px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${active === t.label ? '#FF2800' : 'transparent'}`,
                  color: active === t.label ? '#fff' : 'rgba(255,255,255,0.3)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: 28,
                  letterSpacing: '-0.01em',
                  transition: 'color 0.2s, border-color 0.2s',
                  marginRight: 8,
                  cursor: 'pointer',
                }}
              >
                {t.label.toUpperCase()}
              </button>
            ))}
          </div>
          <div style={{
            fontFamily: 'var(--font-barlow-cond)',
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: '0.08em',
            color: tab.color,
            marginTop: 6,
            opacity: 0.8,
          }}>
            {tab.tag}
          </div>
        </div>

        <Link href="/browse" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '9px 20px',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'transparent',
            color: 'rgba(255,255,255,0.5)',
            fontFamily: 'var(--font-barlow-cond)',
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,40,0,0.4)'; e.currentTarget.style.color = '#FF2800'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >
            VIEW ALL DROPS →
          </button>
        </Link>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1,
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
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
