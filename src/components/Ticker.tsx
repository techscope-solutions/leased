'use client';

import { CarDeal } from '@/lib/types';

export default function Ticker({ deals }: { deals: CarDeal[] }) {
  const items = [...deals, ...deals]; // doubled for seamless loop

  return (
    <div style={{
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(0,0,0,0.5)',
      overflow: 'hidden',
      height: 34,
      display: 'flex',
      alignItems: 'center',
    }}>
      <div className="ticker-track" style={{ gap: 0 }}>
        {items.map((deal, i) => (
          <TickerItem key={`${deal.id}-${i}`} deal={deal} />
        ))}
      </div>
    </div>
  );
}

function TickerItem({ deal }: { deal: CarDeal }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 20px',
      whiteSpace: 'nowrap',
      borderRight: '1px solid rgba(255,255,255,0.07)',
    }}>
      <span style={{
        fontFamily: 'var(--font-barlow-cond)',
        fontWeight: 600,
        fontSize: 11,
        letterSpacing: '0.06em',
        color: 'rgba(255,255,255,0.55)',
      }}>
        {deal.year} {deal.make} {deal.model}
      </span>
      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>///</span>
      <span style={{
        fontFamily: 'var(--font-barlow-cond)',
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: '0.04em',
        color: 'rgba(255,255,255,0.75)',
      }}>
        ${deal.monthly.toLocaleString()}/MO
      </span>
      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>///</span>
      <span style={{
        fontFamily: 'var(--font-barlow-cond)',
        fontWeight: 600,
        fontSize: 11,
        letterSpacing: '0.04em',
        color: 'rgba(255,255,255,0.4)',
      }}>
        {deal.state} · {deal.city}
      </span>
      {deal.zeroDeal && (
        <>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>///</span>
          <span style={{
            fontFamily: 'var(--font-barlow-cond)',
            fontWeight: 800,
            fontSize: 10,
            letterSpacing: '0.1em',
            color: '#FF2800',
          }}>
            ◆ ZERO DOWN
          </span>
        </>
      )}
    </div>
  );
}
