'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const A = 'oklch(0.55 0.22 18)';
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: SparkIcon },
  { href: '/admin/deals', label: 'Deals', icon: BoltIcon, badge: null as string | null },
  { href: '/admin/users', label: 'Users', icon: ShieldIcon },
  { href: '/admin/blogs', label: 'Blog posts', icon: DocIcon },
  { href: '/admin/tickets', label: 'Tickets', icon: TicketIcon },
  { href: '/admin/errors', label: 'Errors', icon: AlertIcon },
];

function SparkIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
}
function BoltIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>;
}
function ShieldIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function DocIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" /></svg>;
}
function TicketIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3l-4 4-4-4" /></svg>;
}
function AlertIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>;
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="r-admin-sidebar"
        style={{
          width: 240,
          minHeight: '100vh',
          background: 'rgba(247,245,242,0.75)',
          backdropFilter: 'blur(24px) saturate(140%)',
          WebkitBackdropFilter: 'blur(24px) saturate(140%)',
          borderRight: '1px solid rgba(10,10,10,0.06)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="#0a0a0a" strokeWidth="1.5" />
              <path d="M9 9h10M9 14h10M9 19h6" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: SF, fontSize: 20, fontWeight: 600, letterSpacing: '-0.03em', fontStyle: 'italic', color: '#0a0a0a' }}>Leased</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', marginTop: 6 }}>
            Admin · Internal
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.3)', padding: '0 8px 10px' }}>
            Manage
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 10,
                    background: isActive ? 'rgba(255,255,255,0.75)' : 'transparent',
                    boxShadow: isActive ? '0 1px 2px rgba(10,10,10,0.04), inset 0 1px 0 rgba(255,255,255,0.8)' : 'none',
                    transition: 'all 0.15s',
                  }}>
                    <span style={{ color: isActive ? A : 'rgba(10,10,10,0.35)', display: 'inline-flex' }}>
                      <Icon />
                    </span>
                    <span style={{
                      flex: 1,
                      fontFamily: SF, fontSize: 14,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#0a0a0a' : 'rgba(10,10,10,0.55)',
                    }}>
                      {label}
                    </span>
                    {isActive && <span style={{ width: 4, height: 4, borderRadius: '50%', background: A, flexShrink: 0 }} />}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 12px 24px', borderTop: '1px solid rgba(10,10,10,0.06)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#0a0a0a', color: 'white', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600, fontFamily: SF, flexShrink: 0 }}>A</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: SF, fontSize: 13, fontWeight: 500, color: '#0a0a0a' }}>Admin</div>
              <Link href="/" style={{ fontFamily: SF, fontSize: 11, color: 'rgba(10,10,10,0.4)', textDecoration: 'none' }}>← Back to site</Link>
            </div>
          </div>
          <button
            onClick={signOut}
            style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: SF, fontSize: 13, color: 'rgba(10,10,10,0.45)', textAlign: 'left' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div
        className="r-admin-mobile-nav"
        style={{
          display: 'none',
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(247,245,242,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(10,10,10,0.06)',
          overflowX: 'auto',
        }}
      >
        <div style={{ display: 'flex', padding: '0 12px', gap: 4, minWidth: 'max-content', alignItems: 'center' }}>
          {NAV.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '12px 14px',
                  borderBottom: isActive ? `2px solid ${A}` : '2px solid transparent',
                }}>
                  <span style={{
                    fontFamily: SF, fontSize: 13, fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#0a0a0a' : 'rgba(10,10,10,0.45)',
                    whiteSpace: 'nowrap',
                  }}>
                    {label}
                  </span>
                </div>
              </Link>
            );
          })}
          <button
            onClick={signOut}
            style={{ padding: '8px 14px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: SF, fontSize: 13, color: 'rgba(10,10,10,0.4)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
