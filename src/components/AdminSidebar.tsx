'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/admin', label: 'DASHBOARD', icon: '◈' },
  { href: '/admin/deals', label: 'DEALS', icon: '◐' },
  { href: '/admin/users', label: 'USERS', icon: '◉' },
  { href: '/admin/blogs', label: 'BLOGS', icon: '◷' },
  { href: '/admin/tickets', label: 'TICKETS', icon: '◫' },
  { href: '/admin/errors', label: 'ERRORS', icon: '◬' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside style={{
        width: 220,
        minHeight: '100vh',
        background: 'rgba(0,0,0,0.6)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
      }} className="r-admin-sidebar">
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: '0.04em',
            color: '#fff',
          }}>
            LEASED<span style={{ color: '#FF2800' }}>.</span>
          </div>
          <div style={{
            fontFamily: 'var(--font-barlow-cond)',
            fontWeight: 600,
            fontSize: 9,
            letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.3)',
            marginTop: 3,
          }}>
            ADMIN PANEL
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 16px' }} />

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  marginBottom: 2,
                  background: active ? 'rgba(255,40,0,0.1)' : 'transparent',
                  border: active ? '1px solid rgba(255,40,0,0.2)' : '1px solid transparent',
                  transition: 'all 0.15s',
                }}>
                  <span style={{
                    fontSize: 11,
                    color: active ? '#FF2800' : 'rgba(255,255,255,0.3)',
                  }}>{icon}</span>
                  <span style={{
                    fontFamily: 'var(--font-barlow-cond)',
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: '0.12em',
                    color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                  }}>
                    {label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 12px 24px' }}>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 16 }} />
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 10,
            }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>←</span>
              <span style={{
                fontFamily: 'var(--font-barlow-cond)',
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.3)',
              }}>
                BACK TO SITE
              </span>
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div style={{
        display: 'none',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(7,7,7,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        overflowX: 'auto',
      }} className="r-admin-mobile-nav">
        <div style={{ display: 'flex', padding: '0 12px', gap: 4, minWidth: 'max-content' }}>
          {NAV.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '12px 14px',
                  borderBottom: active ? '2px solid #FF2800' : '2px solid transparent',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-barlow-cond)',
                    fontWeight: 700,
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                    whiteSpace: 'nowrap',
                  }}>
                    {label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
