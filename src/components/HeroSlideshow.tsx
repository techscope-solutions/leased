'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CarDeal, DealCategory } from '@/lib/types';
import CountdownTimer from './CountdownTimer';

const CATEGORY_STYLE: Record<DealCategory, { label: string; color: string; bg: string; border: string }> = {
  Daily:    { label: 'DAILY',    color: 'rgba(255,255,255,0.75)', bg: 'rgba(255,255,255,0.07)',  border: 'rgba(255,255,255,0.14)' },
  Luxury:   { label: 'LUXURY',   color: '#8b9ab8',               bg: 'rgba(139,154,184,0.1)',  border: 'rgba(139,154,184,0.25)' },
  Supercar: { label: 'SUPERCAR', color: '#c49a2e',               bg: 'rgba(196,154,46,0.1)',   border: 'rgba(196,154,46,0.28)' },
};

interface Props {
  deals: CarDeal[]; // exactly 3, one per category
}

export default function HeroSlideshow({ deals }: Props) {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((next: number) => {
    if (next === idx) return;
    setFading(true);
    setTimeout(() => {
      setIdx(next);
      setFading(false);
    }, 280);
  }, [idx]);

  useEffect(() => {
    const id = setInterval(() => goTo((idx + 1) % 3), 4500);
    return () => clearInterval(id);
  }, [idx, goTo]);

  const deal = deals[idx];
  const cat = CATEGORY_STYLE[deal.category];
  const isUrgent = (deal.expiresAt.getTime() - Date.now()) < 3 * 3600 * 1000;

  return (
    <div style={{ width: '100%', maxWidth: 440, flexShrink: 0 }}>
      {/* Glass card */}
      <div style={{
        borderRadius: 24,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.045)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.12)',
        opacity: fading ? 0 : 1,
        transform: fading ? 'translateY(6px) scale(0.99)' : 'translateY(0) scale(1)',
        transition: 'opacity 0.28s ease, transform 0.28s ease',
      }}>
        {/* Car visual */}
        <div style={{ height: 240, position: 'relative', overflow: 'hidden', background: deal.stripe }}>
          {/* Spotlight */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(255,255,255,0.07) 0%, transparent 70%)',
          }} />
          {/* Subtle grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
          {/* Ground glow */}
          <div style={{
            position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 28,
            background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(255,255,255,0.05), transparent)',
            filter: 'blur(8px)',
          }} />

          {/* Car SVG */}
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 32px' }}>
            <GlassCarSilhouette type={deal.carType} />
          </div>

          {/* Bottom fade into card body */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
            background: 'linear-gradient(to top, rgba(8,8,8,0.85), transparent)',
          }} />

          {/* Category badge */}
          <div style={{
            position: 'absolute', top: 16, left: 16,
            display: 'flex', alignItems: 'center', gap: 5,
            background: cat.bg,
            border: `1px solid ${cat.border}`,
            backdropFilter: 'blur(12px)',
            borderRadius: 99,
            padding: '4px 12px',
          }}>
            <span style={{
              fontFamily: 'var(--font-barlow-cond)', fontWeight: 800,
              fontSize: 10, letterSpacing: '0.12em', color: cat.color,
            }}>
              {cat.label}
            </span>
          </div>

          {/* Slots left */}
          {deal.slotsLeft !== null && (
            <div style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 99,
              padding: '4px 10px',
              fontFamily: 'var(--font-barlow-cond)', fontWeight: 700,
              fontSize: 10, letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.75)',
            }}>
              {deal.slotsLeft} LEFT
            </div>
          )}
        </div>

        {/* Info panel */}
        <div style={{ padding: '20px 24px 24px' }}>
          {/* Make + model */}
          <div style={{ marginBottom: 4 }}>
            <div style={{
              fontFamily: 'var(--font-barlow)', fontSize: 11,
              color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em', marginBottom: 3,
            }}>
              {deal.year} · {deal.drive} · {deal.state}
            </div>
            <div style={{
              fontFamily: 'var(--font-barlow-cond)', fontWeight: 900,
              fontSize: 24, letterSpacing: '-0.01em', color: '#fff', lineHeight: 1.1,
            }}>
              {deal.make}
            </div>
            <div style={{
              fontFamily: 'var(--font-barlow-cond)', fontWeight: 500,
              fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 1,
            }}>
              {deal.model} · {deal.trim}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '14px 0' }} />

          {/* Price row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-barlow-cond)', fontWeight: 600,
                fontSize: 9, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)',
                marginBottom: 2, textTransform: 'uppercase',
              }}>
                {deal.dueAtSigning === 0 ? 'Zero Down' : `$${deal.dueAtSigning.toLocaleString()} DAS`}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontWeight: 900,
                  fontSize: 48, color: '#FF2800', letterSpacing: '-0.04em', lineHeight: 1,
                }}>
                  ${deal.monthly.toLocaleString()}
                </span>
                <span style={{
                  fontFamily: 'var(--font-barlow-cond)', fontWeight: 600,
                  fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 4,
                }}>
                  /MO
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right', paddingBottom: 4 }}>
              <div style={{
                fontFamily: 'var(--font-barlow-cond)', fontSize: 9,
                letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', marginBottom: 4,
              }}>EXPIRES</div>
              <CountdownTimer expiresAt={deal.expiresAt} />
              <div style={{
                fontFamily: 'var(--font-barlow-cond)', fontSize: 10,
                color: 'rgba(255,255,255,0.3)', marginTop: 4,
              }}>
                {deal.term}MO · {(deal.milesPerYear / 1000).toFixed(0)}K/YR
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link href="/browse" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '13px',
              borderRadius: 14,
              background: 'rgba(255,40,0,0.85)',
              border: '1px solid rgba(255,40,0,0.5)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 24px rgba(255,40,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
              color: '#fff',
              fontFamily: 'var(--font-barlow-cond)', fontWeight: 800,
              fontSize: 13, letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,40,0,1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,40,0,0.45), inset 0 1px 0 rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,40,0,0.85)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(255,40,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'; }}
            >
              VIEW DROP →
            </button>
          </Link>
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 7, marginTop: 18 }}>
        {deals.map((d, i) => {
          const c = CATEGORY_STYLE[d.category];
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === idx ? 22 : 6,
                height: 6,
                borderRadius: 3,
                background: i === idx ? c.color : 'rgba(255,255,255,0.15)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.35s cubic-bezier(0.23,1,0.32,1)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* Cleaner car SVG using original design's glass style */
function GlassCarSilhouette({ type }: { type: string }) {
  const isSUV = type === 'SUV';
  const isTruck = type === 'Truck';
  const isCoupe = type === 'Coupe';
  const fill = 'rgba(255,255,255,0.1)';
  const sheen = 'rgba(255,255,255,0.07)';
  const win = 'rgba(255,255,255,0.07)';
  const wheel = { body: 'rgba(0,0,0,0.4)', rim: 'rgba(255,255,255,0.12)', hub: 'rgba(255,255,255,0.3)', stroke: 'rgba(255,255,255,0.2)' };

  return (
    <svg viewBox="0 0 320 130" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.55))' }} fill="none">
      {isTruck ? (
        <>
          <rect x="10" y="36" width="138" height="64" rx="6" fill={fill} />
          <rect x="24" y="16" width="110" height="46" rx="8" fill={fill} />
          <path d="M24 16 Q79 10 134 16 L134 28 Q79 20 24 28 Z" fill={sheen} />
          <rect x="36" y="22" width="44" height="32" rx="4" fill={win} />
          <rect x="88" y="22" width="32" height="32" rx="4" fill={win} />
          <rect x="148" y="52" width="162" height="48" rx="4" fill={fill} opacity="0.75" />
          <rect x="146" y="48" width="6" height="56" rx="2" fill="rgba(0,0,0,0.3)" />
          <rect x="148" y="52" width="162" height="5" rx="2" fill={sheen} />
          <circle cx="72" cy="100" r="22" fill={wheel.body} stroke={wheel.stroke} strokeWidth="2" />
          <circle cx="72" cy="100" r="11" fill={wheel.rim} stroke={wheel.stroke} strokeWidth="1.5" />
          <circle cx="72" cy="100" r="3.5" fill={wheel.hub} />
          <circle cx="260" cy="100" r="22" fill={wheel.body} stroke={wheel.stroke} strokeWidth="2" />
          <circle cx="260" cy="100" r="11" fill={wheel.rim} stroke={wheel.stroke} strokeWidth="1.5" />
          <circle cx="260" cy="100" r="3.5" fill={wheel.hub} />
          <rect x="10" y="56" width="14" height="8" rx="2" fill="rgba(255,40,0,0.7)" />
          <rect x="304" y="68" width="12" height="7" rx="2" fill="rgba(255,180,0,0.6)" />
        </>
      ) : isSUV ? (
        <>
          <rect x="16" y="34" width="288" height="66" rx="8" fill={fill} />
          <rect x="36" y="12" width="212" height="54" rx="10" fill={fill} />
          <path d="M36 12 Q142 8 248 12 L248 26 Q142 18 36 26 Z" fill={sheen} />
          <rect x="50" y="18" width="78" height="36" rx="5" fill={win} />
          <rect x="138" y="18" width="78" height="36" rx="5" fill={win} />
          <line x1="138" y1="34" x2="138" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx="78" cy="100" r="20" fill={wheel.body} stroke={wheel.stroke} strokeWidth="2" />
          <circle cx="78" cy="100" r="10" fill={wheel.rim} stroke={wheel.stroke} strokeWidth="1.5" />
          <circle cx="78" cy="100" r="3" fill={wheel.hub} />
          <circle cx="248" cy="100" r="20" fill={wheel.body} stroke={wheel.stroke} strokeWidth="2" />
          <circle cx="248" cy="100" r="10" fill={wheel.rim} stroke={wheel.stroke} strokeWidth="1.5" />
          <circle cx="248" cy="100" r="3" fill={wheel.hub} />
          <rect x="16" y="52" width="14" height="7" rx="2" fill="rgba(255,40,0,0.7)" />
          <rect x="290" y="52" width="14" height="7" rx="2" fill="rgba(255,180,0,0.6)" />
        </>
      ) : isCoupe ? (
        <>
          <path d="M12 82 L46 82 L76 28 L222 26 L268 82 L308 82 L308 96 L12 96 Z" fill={fill} />
          <path d="M76 28 Q149 18 222 26 L222 38 Q149 30 76 40 Z" fill={sheen} />
          <path d="M80 30 L104 30 L104 72 L80 72 Z" fill={win} />
          <path d="M172 27 L214 27 L214 70 L172 70 Z" fill={win} />
          <circle cx="74" cy="96" r="18" fill={wheel.body} stroke={wheel.stroke} strokeWidth="2" />
          <circle cx="74" cy="96" r="9" fill={wheel.rim} stroke={wheel.stroke} strokeWidth="1.5" />
          <circle cx="74" cy="96" r="3" fill={wheel.hub} />
          <circle cx="250" cy="96" r="18" fill={wheel.body} stroke={wheel.stroke} strokeWidth="2" />
          <circle cx="250" cy="96" r="9" fill={wheel.rim} stroke={wheel.stroke} strokeWidth="1.5" />
          <circle cx="250" cy="96" r="3" fill={wheel.hub} />
          <rect x="12" y="64" width="16" height="8" rx="2" fill="rgba(255,40,0,0.7)" />
          <rect x="292" y="64" width="16" height="8" rx="2" fill="rgba(255,180,0,0.6)" />
        </>
      ) : (
        /* Sedan / EV */
        <>
          <path d="M14 80 L48 80 L68 34 L232 32 L272 80 L306 80 L306 94 L14 94 Z" fill={fill} />
          <path d="M68 34 Q150 24 232 32 L232 44 Q150 36 68 46 Z" fill={sheen} />
          <path d="M72 36 L98 36 L98 74 L72 74 Z" fill={win} />
          <path d="M108 33 L192 33 L192 74 L108 74 Z" fill="rgba(255,255,255,0.05)" />
          <path d="M200 33 L226 33 L226 74 L200 74 Z" fill={win} />
          <circle cx="74" cy="94" r="18" fill={wheel.body} stroke={wheel.stroke} strokeWidth="2" />
          <circle cx="74" cy="94" r="9" fill={wheel.rim} stroke={wheel.stroke} strokeWidth="1.5" />
          <circle cx="74" cy="94" r="3" fill={wheel.hub} />
          <circle cx="248" cy="94" r="18" fill={wheel.body} stroke={wheel.stroke} strokeWidth="2" />
          <circle cx="248" cy="94" r="9" fill={wheel.rim} stroke={wheel.stroke} strokeWidth="1.5" />
          <circle cx="248" cy="94" r="3" fill={wheel.hub} />
          <rect x="14" y="62" width="16" height="8" rx="2" fill="rgba(255,40,0,0.7)" />
          <rect x="290" y="62" width="16" height="8" rx="2" fill="rgba(255,180,0,0.6)" />
        </>
      )}
    </svg>
  );
}
