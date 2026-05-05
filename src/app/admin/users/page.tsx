import { createAdminClient } from '@/lib/supabase/admin';

const A = 'oklch(0.55 0.22 18)';
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const SERIF = '"Instrument Serif", Georgia, serif';
const INK = '#0a0a0a';
const MUTED = 'rgba(10,10,10,0.4)';

const ROLE_COLOR: Record<string, string> = {
  moderator: 'oklch(0.55 0.18 250)',
  seller:    'oklch(0.65 0.14 70)',
  user:      MUTED,
  unregistered: 'rgba(10,10,10,0.25)',
};
const ROLE_BG: Record<string, string> = {
  moderator: 'rgba(60,80,220,0.08)',
  seller:    'rgba(200,140,40,0.10)',
  user:      'rgba(10,10,10,0.05)',
  unregistered: 'rgba(10,10,10,0.03)',
};

export default async function AdminUsers() {
  const admin = createAdminClient();

  // Fetch all auth users (includes email/password, OAuth, unconfirmed)
  const { data: authData } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const authUsers = authData?.users ?? [];

  // Fetch profiles for role/name data
  const { data: profiles } = await admin
    .from('profiles')
    .select('id, role, full_name, onboarded, last_seen');
  const profileMap = Object.fromEntries((profiles ?? []).map((p: { id: string; role: string; full_name: string | null; onboarded: boolean; last_seen: string | null }) => [p.id, p]));

  // Merge auth users with profile data
  const users = authUsers
    .map(u => ({
      id: u.id,
      email: u.email ?? null,
      full_name: profileMap[u.id]?.full_name ?? (u.user_metadata?.full_name as string | undefined) ?? (u.user_metadata?.name as string | undefined) ?? null,
      role: profileMap[u.id]?.role ?? 'unregistered',
      onboarded: profileMap[u.id]?.onboarded ?? false,
      created_at: u.created_at,
      last_seen: profileMap[u.id]?.last_seen ?? u.last_sign_in_at ?? null,
      confirmed: !!u.email_confirmed_at,
    }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="lz-admin-page" style={{ maxWidth: 1100, fontFamily: SF, color: INK }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.55 0.18 250)', display: 'inline-block' }} />
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED }}>Users</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(32px, 4vw, 48px)', margin: 0, lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400 }}>
            All <em style={{ color: A }}>users.</em>
          </h1>
          <p style={{ fontFamily: SF, fontSize: 13, color: MUTED, marginTop: 8 }}>{users.length} accounts total</p>
        </div>
      </div>

      {/* Table */}
      <div className="lz-glass" style={{ borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
                {['Email', 'Name', 'Role', 'Joined', 'Last seen'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontFamily: MONO, fontWeight: 400, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, textAlign: 'left', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid rgba(10,10,10,0.05)' : 'none' }}>
                  <td style={{ padding: '13px 16px', fontFamily: SF, fontSize: 13, color: INK }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      {u.email ?? '—'}
                      {!u.confirmed && (
                        <span style={{ fontSize: 9, fontFamily: MONO, letterSpacing: '0.08em', color: 'rgba(180,120,0,0.8)', background: 'rgba(200,140,0,0.1)', padding: '2px 6px', borderRadius: 999 }}>
                          unconfirmed
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', fontFamily: SF, fontSize: 13, color: MUTED }}>{u.full_name ?? '—'}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: ROLE_COLOR[u.role] ?? MUTED,
                      background: ROLE_BG[u.role] ?? 'rgba(10,10,10,0.05)',
                      padding: '3px 9px', borderRadius: 999,
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', fontFamily: MONO, fontSize: 11, color: MUTED, whiteSpace: 'nowrap' }}>
                    {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '13px 16px', fontFamily: MONO, fontSize: 11, color: MUTED, whiteSpace: 'nowrap' }}>
                    {u.last_seen ? new Date(u.last_seen).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div style={{ padding: '40px 0', textAlign: 'center', fontFamily: SF, fontSize: 14, color: MUTED }}>No users yet</div>
          )}
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="lz-admin-page" style={{ maxWidth: 1100, fontFamily: SF, color: INK }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.55 0.18 250)', display: 'inline-block' }} />
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED }}>Users</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(32px, 4vw, 48px)', margin: 0, lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400 }}>
            All <em style={{ color: A }}>users.</em>
          </h1>
          <p style={{ fontFamily: SF, fontSize: 13, color: MUTED, marginTop: 8 }}>{users?.length ?? 0} accounts total</p>
        </div>
        <a
          href="/api/admin/export-users"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '11px 20px', borderRadius: 999,
            background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.75)',
            boxShadow: '0 2px 8px rgba(10,10,10,0.05)',
            fontFamily: SF, fontWeight: 500, fontSize: 14, color: INK, textDecoration: 'none',
          }}
        >
          ↓ Export CSV
        </a>
      </div>

      {/* Table */}
      <div className="lz-glass" style={{ borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
                {['Email', 'Name', 'Role', 'Joined', 'Last seen'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', fontFamily: MONO, fontWeight: 400, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, textAlign: 'left', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(users as UserRow[] ?? []).map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < (users?.length ?? 0) - 1 ? '1px solid rgba(10,10,10,0.05)' : 'none' }}>
                  <td style={{ padding: '13px 16px', fontFamily: SF, fontSize: 13, color: INK }}>{u.email ?? '—'}</td>
                  <td style={{ padding: '13px 16px', fontFamily: SF, fontSize: 13, color: MUTED }}>{u.full_name ?? '—'}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: ROLE_COLOR[u.role] ?? MUTED,
                      background: ROLE_BG[u.role] ?? 'rgba(10,10,10,0.05)',
                      padding: '3px 9px', borderRadius: 999,
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', fontFamily: MONO, fontSize: 11, color: MUTED, whiteSpace: 'nowrap' }}>
                    {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '13px 16px', fontFamily: MONO, fontSize: 11, color: MUTED, whiteSpace: 'nowrap' }}>
                    {u.last_seen ? new Date(u.last_seen).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(users?.length ?? 0) === 0 && (
            <div style={{ padding: '40px 0', textAlign: 'center', fontFamily: SF, fontSize: 14, color: MUTED }}>No users yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
