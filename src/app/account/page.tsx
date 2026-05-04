'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace('/login');
        return;
      }
      setEmail(data.user.email ?? null);
      setLoading(false);
    });
  }, [router]);

  const signOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return null;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(28px, 7vw, 40px)', letterSpacing: '-0.025em',
            lineHeight: 0.9, marginBottom: 12,
          }}>
            <span style={{ color: '#fff' }}>MY </span>
            <span style={{ background: 'linear-gradient(135deg, #FF2800 20%, #cc1f00 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ACCOUNT</span>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 20,
          padding: '24px 20px',
          marginBottom: 16,
        }}>
          <div style={{
            fontFamily: 'var(--font-barlow-cond)', fontWeight: 700,
            fontSize: 10, letterSpacing: '0.14em',
            color: 'rgba(255,255,255,0.3)', marginBottom: 6,
          }}>
            EMAIL
          </div>
          <div style={{
            fontFamily: 'var(--font-barlow)', fontSize: 15,
            color: 'rgba(255,255,255,0.85)',
          }}>
            {email}
          </div>
        </div>

        <button
          onClick={signOut}
          disabled={signingOut}
          style={{
            width: '100%', padding: '16px',
            borderRadius: 14,
            background: 'rgba(255,40,0,0.1)',
            border: '1px solid rgba(255,40,0,0.25)',
            color: signingOut ? 'rgba(255,255,255,0.3)' : '#FF2800',
            fontFamily: 'var(--font-barlow-cond)', fontWeight: 800,
            fontSize: 14, letterSpacing: '0.1em',
            cursor: signingOut ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {signingOut ? 'SIGNING OUT…' : 'SIGN OUT'}
        </button>
      </div>
    </div>
  );
}
