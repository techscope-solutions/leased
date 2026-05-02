'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

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

    await supabase
      .from('profiles')
      .update({ role: selected, onboarded: true })
      .eq('id', user.id);

    router.push(selected === 'seller' ? '/seller/dashboard' : '/browse');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px', position: 'relative', zIndex: 2,
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 99, padding: '6px 16px' }}>
            <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF2800', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.55)' }}>ONE LAST STEP</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px, 7vw, 52px)', letterSpacing: '-0.025em', lineHeight: 0.9, marginBottom: 14 }}>
            <span style={{ color: '#fff' }}>WHO ARE </span>
            <span style={{ background: 'linear-gradient(135deg, #FF2800 20%, #cc1f00 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>YOU?</span>
          </div>
          <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
            Choose how you want to use LEASED. You can only pick one.
          </p>
        </div>

        {/* Role cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
          <RoleCard
            active={selected === 'user'}
            onClick={() => setSelected('user')}
            icon={
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="10" r="5" fill="currentColor" opacity="0.9"/>
                <path d="M4 26C4 20 8.5 15.5 14 15.5C19.5 15.5 24 20 24 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            }
            label="USER"
            headline="I'm Looking to Lease"
            perks={['Browse live drops', 'Apply directly to brokers', 'Saved searches & alerts', 'Deal history']}
            accentColor="#4a7fd4"
          />
          <RoleCard
            active={selected === 'seller'}
            onClick={() => setSelected('seller')}
            icon={
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="8" width="22" height="16" rx="2" fill="currentColor" opacity="0.7"/>
                <rect x="1" y="6" width="26" height="5" rx="1.5" fill="currentColor"/>
                <rect x="10" y="17" width="4" height="7" fill="#080808"/>
                <rect x="14" y="17" width="4" height="7" fill="#080808"/>
              </svg>
            }
            label="SELLER"
            headline="I'm a Broker or Dealer"
            perks={['Post lease drops', 'Set your own pricing', 'Timer-driven urgency', 'Verified badge']}
            accentColor="#FF2800"
          />
        </div>

        {/* Confirm */}
        <button
          onClick={confirm}
          disabled={!selected || saving}
          style={{
            width: '100%', padding: '16px',
            borderRadius: 14,
            background: selected ? 'rgba(255,40,0,0.9)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${selected ? 'rgba(255,80,40,0.4)' : 'rgba(255,255,255,0.1)'}`,
            boxShadow: selected ? '0 4px 28px rgba(255,40,0,0.3)' : 'none',
            color: selected ? '#fff' : 'rgba(255,255,255,0.25)',
            fontFamily: 'var(--font-barlow-cond)', fontWeight: 800,
            fontSize: 14, letterSpacing: '0.1em',
            cursor: selected && !saving ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          {saving ? 'SETTING UP YOUR ACCOUNT…' : selected ? `ENTER AS ${selected.toUpperCase()} →` : 'SELECT A ROLE ABOVE'}
        </button>

        <p style={{ textAlign: 'center', marginTop: 16, fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
          Moderators are invited directly — contact the team.
        </p>
      </div>
    </div>
  );
}

function RoleCard({
  active, onClick, icon, label, headline, perks, accentColor,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  headline: string;
  perks: string[];
  accentColor: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        padding: '24px 20px', borderRadius: 20, textAlign: 'left',
        background: active ? `${accentColor}12` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${active ? accentColor + '50' : 'rgba(255,255,255,0.09)'}`,
        boxShadow: active ? `0 0 40px ${accentColor}18, inset 0 1px 0 ${accentColor}20` : 'none',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.23,1,0.32,1)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {active && (
        <div style={{
          position: 'absolute', top: 14, right: 14,
          width: 18, height: 18, borderRadius: '50%',
          background: accentColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      <div style={{ color: active ? accentColor : 'rgba(255,255,255,0.35)', marginBottom: 14, transition: 'color 0.2s' }}>
        {icon}
      </div>

      <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', color: active ? accentColor : 'rgba(255,255,255,0.3)', marginBottom: 6, transition: 'color 0.2s' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 16, color: active ? '#fff' : 'rgba(255,255,255,0.65)', lineHeight: 1.2, marginBottom: 16, transition: 'color 0.2s' }}>
        {headline}
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {perks.map(perk => (
          <li key={perk} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4" fill={active ? accentColor : 'rgba(255,255,255,0.12)'} style={{ transition: 'fill 0.2s' }}/>
              <path d="M3 5L4.5 6.5L7 3.5" stroke={active ? '#fff' : 'rgba(255,255,255,0.4)'} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s' }}/>
            </svg>
            <span style={{ fontFamily: 'var(--font-barlow)', fontSize: 11, color: active ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.35)', transition: 'color 0.2s' }}>{perk}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}
