import { createClient } from '@/lib/supabase/server';

type ErrorRow = {
  id: string;
  message: string | null;
  stack: string | null;
  page: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  user_id: string | null;
};

export default async function AdminErrors() {
  const supabase = await createClient();

  const { data: errors, count } = await supabase
    .from('errors')
    .select('id, message, stack, page, metadata, created_at, user_id', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div style={{ padding: '40px 32px 80px', maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF2800' }} />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>ERROR LOG</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.02em', color: '#fff' }}>
          ERRORS <span style={{ color: count ? '#FF2800' : 'rgba(255,255,255,0.3)' }}>({count ?? 0})</span>
        </div>
        <p style={{ fontFamily: 'var(--font-barlow)', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>
          Captured by Sentry + custom error boundary. Showing last 100.
        </p>
      </div>

      {/* Error list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(errors as ErrorRow[] ?? []).map(e => (
          <details key={e.id} style={{
            padding: '16px 20px',
            background: 'rgba(255,40,0,0.03)',
            border: '1px solid rgba(255,40,0,0.12)',
            borderRadius: 12,
          }}>
            <summary style={{ cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {e.message ?? 'Unknown error'}
                </div>
                <div style={{ fontFamily: 'var(--font-barlow-cond)', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
                  {e.page ?? '—'} · {e.user_id ? `user: ${e.user_id.slice(0, 8)}...` : 'anonymous'}
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-barlow-cond)', fontSize: 10, color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {new Date(e.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </span>
            </summary>
            {e.stack && (
              <pre style={{
                marginTop: 12,
                padding: '12px',
                background: 'rgba(0,0,0,0.4)',
                borderRadius: 8,
                fontFamily: 'monospace',
                fontSize: 11,
                color: 'rgba(255,255,255,0.4)',
                overflow: 'auto',
                maxHeight: 200,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}>
                {e.stack}
              </pre>
            )}
          </details>
        ))}

        {(errors?.length ?? 0) === 0 && (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 14, color: 'rgba(255,255,255,0.2)', marginBottom: 8 }}>No errors logged</div>
            <p style={{ fontFamily: 'var(--font-barlow)', fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>Clean slate. Client errors will appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
}
