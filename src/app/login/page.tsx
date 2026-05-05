'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';
const A = 'oklch(0.55 0.22 18)';
const INK = '#0a0a0a';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const signInOAuth = async (provider: 'google' | 'apple') => {
    setOauthLoading(provider);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError('Something went wrong. Please try again.');
      setOauthLoading(null);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setEmailLoading(true);
    setError(null);

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        setError(error.message);
        setEmailLoading(false);
      } else {
        setEmailSent(true);
        setEmailLoading(false);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message === 'Invalid login credentials' ? 'Incorrect email or password.' : error.message);
        setEmailLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, onboarded')
        .eq('id', data.user.id)
        .maybeSingle();
      if (!profile?.onboarded) router.push('/onboarding');
      else if (profile.role === 'moderator') router.push('/admin');
      else if (profile.role === 'seller') router.push('/seller/dashboard');
      else router.push('/browse');
    }
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

      {/* Back link */}
      <Link href="/" style={{
        position: 'absolute', top: 24, left: 24,
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 13, fontWeight: 500, fontFamily: SF,
        color: 'rgba(10,10,10,0.4)', textDecoration: 'none',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </Link>

      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke={INK} strokeWidth="1.5"/>
              <path d="M9 9h10M9 14h10M9 19h6" stroke={INK} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <span style={{ fontStyle: 'italic', fontSize: 26, letterSpacing: '-0.02em', color: INK, fontWeight: 500, fontFamily: 'Georgia, serif' }}>Leased</span>
          </Link>
          <p style={{ fontSize: 14, color: 'rgba(10,10,10,0.45)', margin: 0 }}>
            {mode === 'signin' ? 'Welcome back.' : 'Create your account.'}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          border: '1px solid rgba(255,255,255,0.9)',
          borderRadius: 24,
          padding: '28px 24px',
          boxShadow: '0 4px 40px rgba(10,10,10,0.07), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}>

          {emailSent ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${A}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={A} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: INK, marginBottom: 8 }}>Check your email</div>
              <p style={{ fontSize: 13, color: 'rgba(10,10,10,0.45)', lineHeight: 1.6, margin: 0 }}>
                We sent a confirmation link to <strong style={{ color: INK }}>{email}</strong>. Click it to activate your account.
              </p>
              <button
                onClick={() => { setEmailSent(false); setMode('signin'); }}
                style={{ marginTop: 20, background: 'none', border: 'none', color: 'rgba(10,10,10,0.4)', fontFamily: SF, fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              {/* Mode tabs */}
              <div style={{ display: 'flex', background: 'rgba(10,10,10,0.05)', borderRadius: 12, padding: 3, marginBottom: 24, gap: 3 }}>
                {(['signin', 'signup'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(null); }}
                    style={{
                      flex: 1, padding: '9px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
                      background: mode === m ? 'white' : 'transparent',
                      color: mode === m ? INK : 'rgba(10,10,10,0.4)',
                      fontFamily: SF, fontSize: 13, fontWeight: mode === m ? 600 : 400,
                      boxShadow: mode === m ? '0 1px 4px rgba(10,10,10,0.08)' : 'none',
                      transition: 'all 0.15s',
                    }}
                  >
                    {m === 'signin' ? 'Sign in' : 'Create account'}
                  </button>
                ))}
              </div>

              {/* Email form */}
              <form onSubmit={handleEmail} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '13px 16px',
                    background: 'white',
                    border: '1px solid rgba(10,10,10,0.12)',
                    borderRadius: 12, color: INK, fontFamily: SF, fontSize: 14,
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: '100%', padding: '13px 16px',
                    background: 'white',
                    border: '1px solid rgba(10,10,10,0.12)',
                    borderRadius: 12, color: INK, fontFamily: SF, fontSize: 14,
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
                {error && (
                  <div style={{
                    padding: '10px 14px',
                    background: 'rgba(220,60,60,0.08)', border: '1px solid rgba(220,60,60,0.2)',
                    borderRadius: 10, fontSize: 12, color: 'rgba(180,40,40,0.9)',
                  }}>
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={emailLoading || !email || !password}
                  style={{
                    width: '100%', padding: '13px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: INK, border: 'none', borderRadius: 12,
                    color: 'white', fontFamily: SF, fontWeight: 600, fontSize: 14,
                    cursor: emailLoading || !email || !password ? 'not-allowed' : 'pointer',
                    opacity: (!email || !password) ? 0.5 : 1,
                    transition: 'opacity 0.15s',
                  }}
                >
                  {emailLoading ? <Spinner /> : (mode === 'signin' ? 'Sign in' : 'Create account')}
                </button>
              </form>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(10,10,10,0.08)' }} />
                <span style={{ fontSize: 11, color: 'rgba(10,10,10,0.3)' }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(10,10,10,0.08)' }} />
              </div>

              {/* OAuth buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  onClick={() => signInOAuth('google')}
                  disabled={oauthLoading !== null}
                  style={{
                    width: '100%', padding: '13px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: 'white', border: '1px solid rgba(10,10,10,0.12)',
                    borderRadius: 12, color: INK, fontFamily: SF, fontWeight: 500, fontSize: 13,
                    cursor: oauthLoading !== null ? 'not-allowed' : 'pointer',
                    opacity: oauthLoading !== null && oauthLoading !== 'google' ? 0.5 : 1,
                    transition: 'opacity 0.15s',
                  }}
                >
                  {oauthLoading === 'google' ? <Spinner dark /> : <GoogleIcon />}
                  Continue with Google
                </button>

                <button
                  onClick={() => signInOAuth('apple')}
                  disabled={oauthLoading !== null}
                  style={{
                    width: '100%', padding: '13px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: 'white', border: '1px solid rgba(10,10,10,0.12)',
                    borderRadius: 12, color: INK, fontFamily: SF, fontWeight: 500, fontSize: 13,
                    cursor: oauthLoading !== null ? 'not-allowed' : 'pointer',
                    opacity: oauthLoading !== null && oauthLoading !== 'apple' ? 0.5 : 1,
                    transition: 'opacity 0.15s',
                  }}
                >
                  {oauthLoading === 'apple' ? <Spinner dark /> : <AppleIconDark />}
                  Continue with Apple
                </button>
              </div>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'rgba(10,10,10,0.25)', lineHeight: 1.7 }}>
          By continuing you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIconDark() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
      <path d="M14.05 9.36c-.02-2.07 1.69-3.07 1.77-3.12-1.0-1.4-2.48-1.58-3.01-1.6-1.27-.13-2.52.76-3.17.76-.66 0-1.65-.75-2.72-.72-1.38.02-2.67.81-3.38 2.05-1.46 2.53-.37 6.26 1.03 8.31.7 1 1.52 2.12 2.6 2.08 1.05-.04 1.44-.67 2.71-.67 1.27 0 1.63.67 2.73.65 1.12-.02 1.84-.99 2.52-2 .8-1.14 1.12-2.25 1.14-2.31-.03-.01-2.19-.84-2.22-3.43z" fill="#0a0a0a"/>
      <path d="M11.9 3.17c.57-.7.96-1.66.85-2.63-.82.03-1.82.55-2.41 1.24-.53.61-.99 1.59-.87 2.53.92.07 1.86-.47 2.43-1.14z" fill="#0a0a0a"/>
    </svg>
  );
}

function Spinner({ dark = false }: { dark?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="9" cy="9" r="7" stroke={dark ? 'rgba(10,10,10,0.12)' : 'rgba(255,255,255,0.15)'} strokeWidth="2"/>
      <path d="M9 2a7 7 0 0 1 7 7" stroke={dark ? 'rgba(10,10,10,0.6)' : 'rgba(255,255,255,0.7)'} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
