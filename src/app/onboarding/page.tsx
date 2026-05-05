'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';
const INK = '#0a0a0a';
const A = 'oklch(0.55 0.22 18)';

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<'user' | 'seller' | null>(null);
  const [saving, setSaving] = useState(false);

  const confirm = async () => {
    if (!selected || saving) return;
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    await supabase.from('profiles').update({ role: selected, onboarded: true }).eq('id', user.id);
    router.push(selected === 'seller' ? '/seller/dashboard' : '/browse');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f7f5f2',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px 48px',
      position: 'relative',
      zIndex: 2,
      fontFamily: SF,
      color: INK,
    }}>

      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
        <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" stroke={INK} strokeWidth="1.5"/>
          <path d="M9 9h10M9 14h10M9 19h6" stroke={INK} strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <span style={{ fontStyle: 'italic', fontSize: 24, letterSpacing: '-0.02em', color: INK, fontWeight: 500, fontFamily: 'Georgia, serif' }}>Leased</span>
      </Link>

      <div style={{ width: '100%', maxWidth: 560 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 16, background: `${A}12`, border: `1px solid ${A}30`, borderRadius: 99, padding: '5px 14px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: A, display: 'inline-block' }} />
            <span style={{ fontFamily: SF, fontWeight: 600, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: A }}>One last step</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 6vw, 44px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, margin: '0 0 12px', color: INK, fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            How will you use Leased?
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(10,10,10,0.45)', margin: 0, lineHeight: 1.6 }}>
            Choose your role. You can only pick one.
          </p>
        </div>

        {/* Role cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
          <RoleCard
            active={selected === 'user'}
            onClick={() => setSelected('user')}
            icon={
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="10" r="5" fill="currentColor"/>
                <path d="M4 26C4 20 8.5 15.5 14 15.5C19.5 15.5 24 20 24 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            }
            label="Buyer"
            headline="I'm looking to lease"
            perks={['Browse live drops', 'Apply to brokers directly', 'Track deal history']}
            accent="#4a7fd4"
          />
          <RoleCard
            active={selected === 'seller'}
            onClick={() => setSelected('seller')}
            icon={
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="8" width="22" height="16" rx="2" fill="currentColor" opacity="0.8"/>
                <rect x="1" y="6" width="26" height="5" rx="1.5" fill="currentColor"/>
                <rect x="10" y="17" width="4" height="7" fill="white"/>
                <rect x="14" y="17" width="4" height="7" fill="white"/>
              </svg>
            }
            label="Broker / Dealer"
            headline="I'm posting deals"
            perks={['Post lease drops', 'Set your own pricing', 'Get verified badge']}
            accent={A}
          />
        </div>

        {/* Confirm button */}
        <button
          onClick={confirm}
          disabled={!selected || saving}
          style={{
            width: '100%', padding: '15px',
            borderRadius: 14, border: 'none',
            background: selected ? INK : 'rgba(10,10,10,0.08)',
            color: selected ? 'white' : 'rgba(10,10,10,0.25)',
            fontFamily: SF, fontWeight: 600, fontSize: 15,
            cursor: selected && !saving ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          {saving ? 'Setting up your account…' : selected ? `Continue as ${selected === 'user' ? 'Buyer' : 'Broker / Dealer'} →` : 'Select a role above'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: 'rgba(10,10,10,0.25)', lineHeight: 1.7 }}>
          Moderators are invited directly — contact the team.
        </p>
      </div>
    </div>
  );
}

function RoleCard({
  active, onClick, icon, label, headline, perks, accent,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  headline: string;
  perks: string[];
  accent: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        padding: '22px 18px', borderRadius: 20, textAlign: 'left', width: '100%',
        background: active ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(20px) saturate(140%)',
        WebkitBackdropFilter: 'blur(20px) saturate(140%)',
        border: `1.5px solid ${active ? accent + '60' : 'rgba(255,255,255,0.8)'}`,
        boxShadow: active
          ? `0 8px 32px ${accent}18, inset 0 1px 0 rgba(255,255,255,0.9)`
          : '0 2px 12px rgba(10,10,10,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.23,1,0.32,1)',
        position: 'relative', overflow: 'hidden',
        fontFamily: SF,
      }}
    >
      {active && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          width: 20, height: 20, borderRadius: '50%',
          background: accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      <div style={{ color: active ? accent : 'rgba(10,10,10,0.25)', marginBottom: 14, transition: 'color 0.2s' }}>
        {icon}
      </div>

      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: active ? accent : 'rgba(10,10,10,0.35)', marginBottom: 5, transition: 'color 0.2s' }}>
        {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: active ? INK : 'rgba(10,10,10,0.55)', lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.01em', transition: 'color 0.2s' }}>
        {headline}
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {perks.map(perk => (
          <li key={perk} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" fill={active ? accent : 'rgba(10,10,10,0.08)'}/>
              <path d="M4.5 7L6 8.5L9.5 5" stroke={active ? 'white' : 'rgba(10,10,10,0.3)'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: 12, color: active ? 'rgba(10,10,10,0.65)' : 'rgba(10,10,10,0.35)', transition: 'color 0.2s' }}>{perk}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}
