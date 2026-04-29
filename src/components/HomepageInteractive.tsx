'use client';

import Link from 'next/link';
import { useState } from 'react';
import FeaturedDropCard from './FeaturedDropCard';
import { CarDeal } from '@/lib/types';

const btnStyle = (hov: boolean) => ({
  padding: '9px 18px',
  border: `1px solid ${hov ? 'rgba(255,40,0,0.5)' : 'rgba(255,255,255,0.1)'}`,
  background: 'transparent',
  color: hov ? '#FF2800' : 'rgba(255,255,255,0.6)',
  fontFamily: 'var(--font-barlow-cond)',
  fontWeight: 600,
  fontSize: 12,
  letterSpacing: '0.06em',
  transition: 'all 0.15s',
  cursor: 'pointer',
});

function HoverButton({ children, href }: { children: React.ReactNode; href: string }) {
  const [hov, setHov] = useState(false);
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <button
        style={btnStyle(hov)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        {children}
      </button>
    </Link>
  );
}

export function SearchBar() {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      display: 'flex',
      gap: 0,
      marginBottom: 40,
      maxWidth: 560,
      border: `1px solid ${focused ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.14)'}`,
      transition: 'border-color 0.2s',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flex: 1,
        padding: '0 16px',
        background: 'rgba(255,255,255,0.04)',
      }}>
        <span style={{
          fontFamily: 'var(--font-barlow-cond)',
          fontWeight: 600,
          fontSize: 10,
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.25)',
          flexShrink: 0,
        }}>
          SEARCH
        </span>
        <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />
        <input
          type="text"
          placeholder={`Make, model, region — try "M3" or "AWD under $700"`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            fontFamily: 'var(--font-barlow)',
            fontSize: 13,
            padding: '16px 0',
          }}
        />
      </div>
      <Link href="/browse" style={{ textDecoration: 'none' }}>
        <FindDropButton />
      </Link>
    </div>
  );
}

function FindDropButton() {
  const [hov, setHov] = useState(false);
  return (
    <button
      style={{
        padding: '0 24px',
        height: '100%',
        background: hov ? '#e01f00' : '#FF2800',
        border: 'none',
        color: '#fff',
        fontFamily: 'var(--font-barlow-cond)',
        fontWeight: 800,
        fontSize: 12,
        letterSpacing: '0.12em',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'background 0.15s',
        cursor: 'pointer',
        minHeight: 54,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <span style={{ fontSize: 9 }}>◆</span> FIND DROP
    </button>
  );
}

export function BudgetAndLane() {
  return (
    <section style={{
      borderTop: '1px solid rgba(255,255,255,0.07)',
      padding: '48px 40px',
      maxWidth: 1400,
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 8,
        }}>
          <span style={{ color: '#FF2800', fontSize: 10 }}>◆</span>
          <span style={{
            fontFamily: 'var(--font-barlow-cond)',
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.14em',
            color: 'rgba(255,255,255,0.5)',
          }}>
            SHOP BY BUDGET
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          {['Under $500', '$500–$800', '$800–$1,200', '$1,200+'].map(b => (
            <HoverButton key={b} href="/browse">{b}</HoverButton>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{
          fontFamily: 'var(--font-barlow-cond)',
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: '0.14em',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 16,
        }}>
          PICK A LANE
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {['SEDAN', 'SUV', 'COUPE', 'TRUCK', 'EV'].map(type => (
            <HoverButton key={type} href="/browse">{type}</HoverButton>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedCardWrapper({ deal }: { deal: CarDeal }) {
  return (
    <div style={{ paddingTop: 80 }}>
      <FeaturedDropCard deal={deal} />
    </div>
  );
}
