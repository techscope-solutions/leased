'use client';

import { CarDeal } from '@/lib/types';
import CountdownTimer from './CountdownTimer';

export default function FeaturedDropCard({ deal }: { deal: CarDeal }) {
  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.12)',
      background: 'rgba(14,14,14,0.95)',
      padding: '20px',
      minWidth: 320,
      maxWidth: 360,
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
      }}>
        <div style={{
          fontFamily: 'var(--font-barlow-cond)',
          fontWeight: 600,
          fontSize: 10,
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.35)',
        }}>
          FEATURED DROP / {deal.dropId}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          color: '#FF2800',
          fontFamily: 'var(--font-barlow-cond)',
          fontWeight: 700,
          fontSize: 10,
          letterSpacing: '0.1em',
        }}>
          <span style={{ fontSize: 8 }}>◆</span> ENDS SOON
        </div>
      </div>

      {/* Location */}
      <div style={{
        fontFamily: 'var(--font-barlow-cond)',
        fontWeight: 500,
        fontSize: 11,
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: '0.06em',
        marginBottom: 8,
      }}>
        {deal.year} · {deal.state} · {deal.city}
      </div>

      {/* Make + Model */}
      <div style={{
        fontFamily: 'var(--font-barlow-cond)',
        fontWeight: 900,
        fontSize: 32,
        color: '#fff',
        letterSpacing: '-0.01em',
        lineHeight: 1,
        marginBottom: 4,
      }}>
        {deal.make} <span style={{ fontWeight: 400, opacity: 0.75 }}>{deal.model}</span>
      </div>
      <div style={{
        fontFamily: 'var(--font-barlow-cond)',
        fontWeight: 500,
        fontSize: 13,
        color: 'rgba(255,255,255,0.4)',
        marginBottom: 14,
      }}>
        {deal.trim}
      </div>

      {/* Lease type */}
      <div style={{
        display: 'inline-block',
        border: '1px solid rgba(255,255,255,0.18)',
        padding: '3px 10px',
        fontFamily: 'var(--font-barlow-cond)',
        fontWeight: 700,
        fontSize: 10,
        letterSpacing: '0.1em',
        color: 'rgba(255,255,255,0.65)',
        marginBottom: 16,
      }}>
        {deal.type}
      </div>

      {/* Price */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 52,
              color: '#FF2800',
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}>
              ${deal.monthly.toLocaleString()}
            </span>
            <span style={{
              fontFamily: 'var(--font-barlow-cond)',
              fontWeight: 600,
              fontSize: 14,
              color: 'rgba(255,255,255,0.35)',
              marginBottom: 5,
            }}>
              /MO
            </span>
          </div>
          <div style={{ textAlign: 'right', paddingBottom: 4 }}>
            <div style={{
              fontFamily: 'var(--font-barlow-cond)',
              fontWeight: 500,
              fontSize: 9,
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.25)',
              marginBottom: 2,
            }}>
              EXPIRES IN
            </div>
            <CountdownTimer expiresAt={deal.expiresAt} />
          </div>
        </div>
      </div>

      {/* CTA */}
      <button style={{
        width: '100%',
        padding: '14px',
        background: '#FF2800',
        border: 'none',
        color: '#fff',
        fontFamily: 'var(--font-barlow-cond)',
        fontWeight: 800,
        fontSize: 13,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        boxShadow: '0 4px 20px rgba(255,40,0,0.35)',
        transition: 'background 0.2s',
      }}
        onMouseEnter={e => (e.currentTarget.style.background = '#e01f00')}
        onMouseLeave={e => (e.currentTarget.style.background = '#FF2800')}
      >
        VIEW DROP →
      </button>
    </div>
  );
}
