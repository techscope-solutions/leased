'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CarDeal, DealCategory } from '@/lib/types';
import CountdownTimer from './CountdownTimer';
import { useIsMobile } from '@/hooks/useIsMobile';

const CAT: Record<DealCategory, { pill: string; pillBg: string; pillBorder: string; glow: string }> = {
  Daily:    { pill: 'rgba(255,255,255,0.75)', pillBg: 'rgba(255,255,255,0.08)', pillBorder: 'rgba(255,255,255,0.18)', glow: 'rgba(255,255,255,0.04)' },
  Luxury:   { pill: '#8baed4',               pillBg: 'rgba(139,174,212,0.1)',   pillBorder: 'rgba(139,174,212,0.28)', glow: 'rgba(139,174,212,0.05)' },
  Supercar: { pill: '#d4aa50',               pillBg: 'rgba(212,170,80,0.1)',    pillBorder: 'rgba(212,170,80,0.28)',  glow: 'rgba(212,170,80,0.06)' },
};

export default function HeroSlideshow({ deals }: { deals: CarDeal[] }) {
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const isMobile = useIsMobile();

  const goTo = useCallback((next: number) => {
    if (animating || next === idx) return;
    setAnimating(true);
    setPrev(idx);
    setIdx(next);
    setTimeout(() => { setPrev(null); setAnimating(false); }, 600);
  }, [idx, animating]);

  useEffect(() => {
    const id = setInterval(() => goTo((idx + 1) % 3), 5000);
    return () => clearInterval(id);
  }, [idx, goTo]);

  const frontWidth = isMobile ? '88%' : 340;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: isMobile ? 'hidden' : 'visible' }}>
      {/* Fanned background cards — desktop only */}
      {!isMobile && deals.map((deal, i) => {
        if (i === idx) return null;
        const isLeft = (i < idx) || (idx === 2 && i === 0);
        const offset = isLeft ? -1 : 1;
        return (
          <div
            key={deal.id}
            onClick={() => goTo(i)}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 320,
              cursor: 'pointer',
              borderRadius: 24,
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px) saturate(140%)',
              WebkitBackdropFilter: 'blur(20px) saturate(140%)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
              transform: `translate(-50%, -50%) translateX(${offset * 200}px) rotate(${offset * 10}deg) scale(0.78)`,
              transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
              zIndex: 1,
              opacity: 0.55,
              pointerEvents: animating ? 'none' : 'auto',
            }}
          >
            <BackCard deal={deal} />
          </div>
        );
      })}

      {/* Active front card */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: frontWidth,
        transform: 'translate(-50%, -50%) scale(1)',
        transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
        zIndex: 3,
        borderRadius: 24,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.055)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.13)',
        boxShadow: `0 40px 80px rgba(0,0,0,0.7), 0 0 60px ${CAT[deals[idx].category].glow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
      }}>
        <FrontCard deal={deals[idx]} animating={animating} />
      </div>

      {/* Dot indicators */}
      <div style={{
        position: 'absolute',
        bottom: -36,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 8,
        zIndex: 10,
      }}>
        {deals.map((d, i) => {
          const c = CAT[d.category];
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === idx ? 24 : 7,
                height: 7,
                borderRadius: 4,
                background: i === idx ? c.pill : 'rgba(255,255,255,0.15)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.4s cubic-bezier(0.23,1,0.32,1)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* Compact background card — just silhouette + make + price */
function BackCard({ deal }: { deal: CarDeal }) {
  return (
    <div>
      <div style={{ height: 160, background: deal.stripe, position: 'relative' }}>
        <MiniSilhouette type={deal.carType} />
      </div>
      <div style={{ padding: '12px 16px 16px' }}>
        <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 900, fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>{deal.make}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, color: '#FF2800', letterSpacing: '-0.03em' }}>${deal.monthly.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.35)', marginLeft: 3 }}>/mo</span></div>
      </div>
    </div>
  );
}

/* Full front card */
function FrontCard({ deal, animating }: { deal: CarDeal; animating: boolean }) {
  const cat = CAT[deal.category];
  return (
    <div style={{ opacity: animating ? 0.6 : 1, transition: 'opacity 0.3s ease' }}>
      {/* Visual */}
      <div style={{ height: 220, background: deal.stripe, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 55% at 50% -5%, rgba(255,255,255,0.08) 0%, transparent 65%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '38px 38px' }} />
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 28px' }}>
          <FullSilhouette type={deal.carType} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to top, rgba(8,8,8,0.9), transparent)' }} />
        {/* Category pill */}
        <div style={{ position: 'absolute', top: 14, left: 14, background: cat.pillBg, border: `1px solid ${cat.pillBorder}`, backdropFilter: 'blur(12px)', borderRadius: 99, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 10, letterSpacing: '0.12em', color: cat.pill }}>{deal.category.toUpperCase()}</span>
        </div>
        {deal.zeroDeal && (
          <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,40,0,0.85)', borderRadius: 99, padding: '4px 10px' }}>
            <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 9, letterSpacing: '0.1em', color: '#fff' }}>ZERO DOWN</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '18px 22px 22px' }}>
        <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em', marginBottom: 3 }}>{deal.year} · {deal.drive} · {deal.state}</div>
        <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 900, fontSize: 22, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.1 }}>{deal.make}</div>
        <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 400, fontSize: 13, color: 'rgba(255,255,255,0.38)', marginBottom: 14 }}>{deal.model}</div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 46, color: '#FF2800', letterSpacing: '-0.04em', lineHeight: 1 }}>${deal.monthly.toLocaleString()}</span>
            <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 600, fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>/MO</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-barlow-cond)', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.22)', marginBottom: 3 }}>EXPIRES</div>
            <CountdownTimer expiresAt={deal.expiresAt} />
          </div>
        </div>

        <Link href="/browse" style={{ textDecoration: 'none' }}>
          <button style={{
            width: '100%', padding: '13px', borderRadius: 14,
            background: 'rgba(255,40,0,0.88)', border: '1px solid rgba(255,80,40,0.4)',
            boxShadow: '0 4px 24px rgba(255,40,0,0.32), inset 0 1px 0 rgba(255,255,255,0.15)',
            color: '#fff', fontFamily: 'var(--font-barlow-cond)', fontWeight: 800,
            fontSize: 13, letterSpacing: '0.1em', cursor: 'pointer',
          }}>VIEW DROP →</button>
        </Link>
      </div>
    </div>
  );
}

function MiniSilhouette({ type }: { type: string }) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
      <FullSilhouette type={type} />
    </div>
  );
}

function FullSilhouette({ type }: { type: string }) {
  const f = 'rgba(255,255,255,0.1)';
  const s = 'rgba(255,255,255,0.07)';
  const w = 'rgba(255,255,255,0.07)';
  const wb = 'rgba(0,0,0,0.4)';
  const ws = 'rgba(255,255,255,0.2)';
  const wr = 'rgba(255,255,255,0.12)';
  const wh = 'rgba(255,255,255,0.3)';
  const isSUV = type === 'SUV';
  const isTruck = type === 'Truck';
  const isCoupe = type === 'Coupe';

  return (
    <svg viewBox="0 0 320 130" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.55))' }} fill="none">
      {isTruck ? (<>
        <rect x="10" y="36" width="138" height="64" rx="6" fill={f}/>
        <rect x="24" y="16" width="110" height="46" rx="8" fill={f}/>
        <path d="M24 16 Q79 10 134 16 L134 28 Q79 20 24 28 Z" fill={s}/>
        <rect x="36" y="22" width="44" height="32" rx="4" fill={w}/>
        <rect x="88" y="22" width="32" height="32" rx="4" fill={w}/>
        <rect x="148" y="52" width="162" height="48" rx="4" fill={f} opacity=".75"/>
        <rect x="146" y="48" width="6" height="56" rx="2" fill="rgba(0,0,0,0.3)"/>
        <circle cx="72" cy="100" r="22" fill={wb} stroke={ws} strokeWidth="2"/>
        <circle cx="72" cy="100" r="11" fill={wr} stroke={ws} strokeWidth="1.5"/>
        <circle cx="72" cy="100" r="3.5" fill={wh}/>
        <circle cx="260" cy="100" r="22" fill={wb} stroke={ws} strokeWidth="2"/>
        <circle cx="260" cy="100" r="11" fill={wr} stroke={ws} strokeWidth="1.5"/>
        <circle cx="260" cy="100" r="3.5" fill={wh}/>
        <rect x="10" y="56" width="14" height="8" rx="2" fill="rgba(255,40,0,0.7)"/>
        <rect x="304" y="68" width="12" height="7" rx="2" fill="rgba(255,180,0,0.6)"/>
      </>) : isSUV ? (<>
        <rect x="16" y="34" width="288" height="66" rx="8" fill={f}/>
        <rect x="36" y="12" width="212" height="54" rx="10" fill={f}/>
        <path d="M36 12 Q142 8 248 12 L248 26 Q142 18 36 26 Z" fill={s}/>
        <rect x="50" y="18" width="78" height="36" rx="5" fill={w}/>
        <rect x="138" y="18" width="78" height="36" rx="5" fill={w}/>
        <circle cx="78" cy="100" r="20" fill={wb} stroke={ws} strokeWidth="2"/>
        <circle cx="78" cy="100" r="10" fill={wr} stroke={ws} strokeWidth="1.5"/>
        <circle cx="78" cy="100" r="3" fill={wh}/>
        <circle cx="248" cy="100" r="20" fill={wb} stroke={ws} strokeWidth="2"/>
        <circle cx="248" cy="100" r="10" fill={wr} stroke={ws} strokeWidth="1.5"/>
        <circle cx="248" cy="100" r="3" fill={wh}/>
        <rect x="16" y="52" width="14" height="7" rx="2" fill="rgba(255,40,0,0.7)"/>
        <rect x="290" y="52" width="14" height="7" rx="2" fill="rgba(255,180,0,0.6)"/>
      </>) : isCoupe ? (<>
        <path d="M12 82 L46 82 L76 28 L222 26 L268 82 L308 82 L308 96 L12 96 Z" fill={f}/>
        <path d="M76 28 Q149 18 222 26 L222 38 Q149 30 76 40 Z" fill={s}/>
        <path d="M80 30 L104 30 L104 72 L80 72 Z" fill={w}/>
        <path d="M172 27 L214 27 L214 70 L172 70 Z" fill={w}/>
        <circle cx="74" cy="96" r="18" fill={wb} stroke={ws} strokeWidth="2"/>
        <circle cx="74" cy="96" r="9" fill={wr} stroke={ws} strokeWidth="1.5"/>
        <circle cx="74" cy="96" r="3" fill={wh}/>
        <circle cx="250" cy="96" r="18" fill={wb} stroke={ws} strokeWidth="2"/>
        <circle cx="250" cy="96" r="9" fill={wr} stroke={ws} strokeWidth="1.5"/>
        <circle cx="250" cy="96" r="3" fill={wh}/>
        <rect x="12" y="64" width="16" height="8" rx="2" fill="rgba(255,40,0,0.7)"/>
        <rect x="292" y="64" width="16" height="8" rx="2" fill="rgba(255,180,0,0.6)"/>
      </>) : (<>
        <path d="M14 80 L48 80 L68 34 L232 32 L272 80 L306 80 L306 94 L14 94 Z" fill={f}/>
        <path d="M68 34 Q150 24 232 32 L232 44 Q150 36 68 46 Z" fill={s}/>
        <path d="M72 36 L98 36 L98 74 L72 74 Z" fill={w}/>
        <path d="M108 33 L192 33 L192 74 L108 74 Z" fill="rgba(255,255,255,0.05)"/>
        <path d="M200 33 L226 33 L226 74 L200 74 Z" fill={w}/>
        <circle cx="74" cy="94" r="18" fill={wb} stroke={ws} strokeWidth="2"/>
        <circle cx="74" cy="94" r="9" fill={wr} stroke={ws} strokeWidth="1.5"/>
        <circle cx="74" cy="94" r="3" fill={wh}/>
        <circle cx="248" cy="94" r="18" fill={wb} stroke={ws} strokeWidth="2"/>
        <circle cx="248" cy="94" r="9" fill={wr} stroke={ws} strokeWidth="1.5"/>
        <circle cx="248" cy="94" r="3" fill={wh}/>
        <rect x="14" y="62" width="16" height="8" rx="2" fill="rgba(255,40,0,0.7)"/>
        <rect x="290" y="62" width="16" height="8" rx="2" fill="rgba(255,180,0,0.6)"/>
      </>)}
    </svg>
  );
}
