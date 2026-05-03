'use client';

import { useState } from 'react';
import { CarDeal } from '@/lib/types';
import CarSilhouette from './CarSilhouette';
import CountdownTimer from './CountdownTimer';
import { trackDealClick } from '@/lib/analytics';

const TIER_COLORS: Record<string, string> = {
  GOLD: '#b8932a',
  PLATINUM: '#8b9ab8',
  VERIFIED: '#4a7c59',
};

const TIER_BG: Record<string, string> = {
  GOLD: 'rgba(184,147,42,0.12)',
  PLATINUM: 'rgba(139,154,184,0.12)',
  VERIFIED: 'rgba(74,124,89,0.12)',
};

export default function DealCard({ deal }: { deal: CarDeal }) {
  const [hovered, setHovered] = useState(false);
  const isUrgent = (deal.expiresAt.getTime() - Date.now()) < 3 * 3600 * 1000;

  return (
    <div
      onClick={() => trackDealClick(deal.dropId)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(12,12,12,0.95)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 20,
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.25s cubic-bezier(0.23,1,0.32,1), box-shadow 0.25s',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)'
          : '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        overflow: 'hidden',
        position: 'relative',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Car image */}
      <div className="r-deal-card-img">
        <div style={{
          position: 'absolute',
          inset: 0,
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
        }}>
          <CarSilhouette type={deal.carType} stripe={deal.stripe} />
        </div>

        {/* Top-left: slots left or zero down badge */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
          {deal.zeroDeal && (
            <div style={{
              background: '#FF2800',
              padding: '4px 10px',
              borderRadius: 99,
              fontFamily: 'var(--font-barlow-cond)',
              fontWeight: 800,
              fontSize: 10,
              letterSpacing: '0.1em',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: '0 2px 12px rgba(255,40,0,0.4)',
            }}>
              <span style={{ fontSize: 7 }}>◆</span> ZERO DOWN
            </div>
          )}
          {deal.slotsLeft !== null && (
            <div style={{
              background: 'rgba(0,0,0,0.75)',
              border: '1px solid rgba(255,255,255,0.18)',
              padding: '4px 10px',
              borderRadius: 99,
              fontFamily: 'var(--font-barlow-cond)',
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(8px)',
            }}>
              {deal.slotsLeft} LEFT
            </div>
          )}
        </div>

        {/* Bottom-left: LEASE type badge */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          background: 'rgba(0,0,0,0.75)',
          border: '1px solid rgba(255,255,255,0.14)',
          padding: '4px 10px',
          borderRadius: 8,
          fontFamily: 'var(--font-barlow-cond)',
          fontWeight: 700,
          fontSize: 10,
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
        }}>
          {deal.type}
        </div>
      </div>

      {/* Card body */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>

        {/* Make / Model */}
        <div style={{ padding: '14px 16px 8px' }}>
          <div style={{
            fontFamily: 'var(--font-barlow)',
            fontWeight: 400,
            fontSize: 11,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.06em',
            marginBottom: 2,
          }}>
            {deal.year} · {deal.drive}
          </div>
          <div style={{
            fontFamily: 'var(--font-barlow-cond)',
            fontWeight: 900,
            fontSize: 22,
            color: '#fff',
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
          }}>
            {deal.make}
          </div>
          <div style={{
            fontFamily: 'var(--font-barlow-cond)',
            fontWeight: 500,
            fontSize: 13,
            color: 'rgba(255,255,255,0.65)',
            letterSpacing: '0.02em',
            marginTop: 1,
          }}>
            {deal.model} {deal.trim}
          </div>
        </div>

        {/* Price row */}
        <div style={{
          padding: '4px 16px 12px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 42,
              color: '#FF2800',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}>
              ${deal.monthly.toLocaleString()}
            </span>
            <span style={{
              fontFamily: 'var(--font-barlow-cond)',
              fontWeight: 600,
              fontSize: 12,
              color: 'rgba(255,255,255,0.55)',
              marginBottom: 4,
            }}>
              /MO
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: 'var(--font-barlow-cond)',
              fontWeight: 500,
              fontSize: 9,
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: 2,
            }}>
              DUE AT SIGNING
            </div>
            <div style={{
              fontFamily: 'var(--font-barlow-cond)',
              fontWeight: 700,
              fontSize: 13,
              color: 'rgba(255,255,255,0.85)',
            }}>
              ${deal.dueAtSigning === 0 ? '0' : deal.dueAtSigning.toLocaleString()} DAS
            </div>
          </div>
        </div>

        {/* Term / Miles / MSRP */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          {[
            { label: 'TERM', value: `${deal.term}MO` },
            { label: 'MILES/YR', value: `${(deal.milesPerYear / 1000).toFixed(1)}K` },
            { label: 'MSRP', value: `$${(deal.msrp / 1000).toFixed(0)}K` },
          ].map((item, i) => (
            <div
              key={item.label}
              style={{
                padding: '10px 12px',
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-barlow-cond)',
                fontWeight: 500,
                fontSize: 9,
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.5)',
                marginBottom: 2,
              }}>
                {item.label}
              </div>
              <div style={{
                fontFamily: 'var(--font-barlow-cond)',
                fontWeight: 700,
                fontSize: 12,
                color: 'rgba(255,255,255,0.85)',
                letterSpacing: '0.02em',
              }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Expires row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: isUrgent ? 'rgba(255,40,0,0.04)' : 'transparent',
          borderRadius: isUrgent ? 0 : 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontFamily: 'var(--font-barlow-cond)',
              fontWeight: 600,
              fontSize: 9,
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.5)',
            }}>
              EXPIRES
            </span>
            <CountdownTimer expiresAt={deal.expiresAt} />
          </div>

          {/* Tier badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 10px',
            borderRadius: 99,
            background: TIER_BG[deal.tier],
            border: `1px solid ${TIER_COLORS[deal.tier]}50`,
          }}>
            <span style={{ fontSize: 7, color: TIER_COLORS[deal.tier] }}>◈◈</span>
            <span style={{
              fontFamily: 'var(--font-barlow-cond)',
              fontWeight: 700,
              fontSize: 9,
              letterSpacing: '0.12em',
              color: TIER_COLORS[deal.tier],
            }}>
              {deal.tier}
            </span>
          </div>
        </div>

        {/* Drop ID / Location */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
        }}>
          <span style={{
            fontFamily: 'var(--font-barlow-cond)',
            fontWeight: 500,
            fontSize: 10,
            letterSpacing: '0.06em',
            color: 'rgba(255,255,255,0.45)',
          }}>
            DROP / {deal.dropId}
          </span>
          <span style={{
            fontFamily: 'var(--font-barlow-cond)',
            fontWeight: 500,
            fontSize: 10,
            letterSpacing: '0.06em',
            color: 'rgba(255,255,255,0.45)',
          }}>
            {deal.state} · {deal.city}
          </span>
        </div>
      </div>
    </div>
  );
}
