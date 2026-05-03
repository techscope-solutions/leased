import { createClient } from '@/lib/supabase/server';

type UserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  onboarded: boolean;
  created_at: string;
  last_seen: string | null;
};

export default async function AdminUsers() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, onboarded, created_at, last_seen')
    .order('created_at', { ascending: false });

  const ROLE_COLORS: Record<string, string> = {
    moderator: '#4a7fd4',
    seller: '#c8922a',
    user: 'rgba(255,255,255,0.4)',
  };

  return (
    <div style={{ padding: '40px 32px 80px', maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4a7fd4' }} />
            <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>USERS</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.02em', color: '#fff' }}>
            ALL USERS <span style={{ color: '#4a7fd4' }}>({users?.length ?? 0})</span>
          </div>
        </div>
        <a
          href="/api/admin/export-users"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            background: 'rgba(74,127,212,0.12)',
            border: '1px solid rgba(74,127,212,0.3)',
            borderRadius: 10,
            fontFamily: 'var(--font-barlow-cond)',
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.1em',
            color: '#4a7fd4',
            textDecoration: 'none',
          }}
        >
          ↓ EXPORT CSV
        </a>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['EMAIL', 'NAME', 'ROLE', 'JOINED', 'LAST SEEN'].map(h => (
                <th key={h} style={{
                  padding: '10px 12px',
                  fontFamily: 'var(--font-barlow-cond)',
                  fontWeight: 700,
                  fontSize: 9,
                  letterSpacing: '0.14em',
                  color: 'rgba(255,255,255,0.3)',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(users as UserRow[] ?? []).map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px', fontFamily: 'var(--font-barlow)', fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
                  {u.email ?? '—'}
                </td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-barlow)', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                  {u.full_name ?? '—'}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    fontFamily: 'var(--font-barlow-cond)',
                    fontWeight: 700,
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    color: ROLE_COLORS[u.role] ?? 'rgba(255,255,255,0.4)',
                    background: `${ROLE_COLORS[u.role]}18`,
                    padding: '3px 8px',
                    borderRadius: 6,
                  }}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-barlow-cond)', fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>
                  {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-barlow-cond)', fontSize: 11, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
                  {u.last_seen
                    ? new Date(u.last_seen).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(users?.length ?? 0) === 0 && (
          <div style={{ padding: '40px 0', textAlign: 'center', fontFamily: 'var(--font-barlow)', fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>
            No users yet
          </div>
        )}
      </div>
    </div>
  );
}
