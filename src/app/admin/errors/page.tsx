import { createClient } from '@/lib/supabase/server';

const A = 'oklch(0.55 0.22 18)';
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const SERIF = '"Instrument Serif", Georgia, serif';
const INK = '#0a0a0a';
const MUTED = 'rgba(10,10,10,0.4)';

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
    <div className="lz-admin-page" style={{ maxWidth: 1100, fontFamily: SF, color: INK }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: A, display: 'inline-block' }} />
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED }}>Error log</span>
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(32px, 4vw, 48px)', margin: 0, lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400 }}>
          Errors <em style={{ color: (count ?? 0) > 0 ? A : MUTED }}>({count ?? 0})</em>
        </h1>
        <p style={{ fontFamily: SF, fontSize: 13, color: MUTED, marginTop: 8 }}>
          Captured by custom error boundary. Showing last 100.
        </p>
      </div>

      {/* Error list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(errors as ErrorRow[] ?? []).map(e => (
          <details key={e.id} className="lz-glass" style={{ padding: '16px 20px', borderRadius: 14 }}>
            <summary style={{ cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: A, flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontFamily: SF, fontSize: 14, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.message ?? 'Unknown error'}
                  </span>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: MUTED, letterSpacing: '0.04em', paddingLeft: 14 }}>
                  {e.page ?? '—'} · {e.user_id ? `user: ${e.user_id.slice(0, 8)}…` : 'anonymous'}
                </div>
              </div>
              <span style={{ fontFamily: MONO, fontSize: 10, color: MUTED, whiteSpace: 'nowrap', flexShrink: 0 }}>
                {new Date(e.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </span>
            </summary>
            {e.stack && (
              <pre style={{
                marginTop: 12, padding: '12px',
                background: 'rgba(10,10,10,0.04)',
                border: '1px solid rgba(10,10,10,0.08)',
                borderRadius: 10,
                fontFamily: MONO, fontSize: 11,
                color: 'rgba(10,10,10,0.55)',
                overflow: 'auto', maxHeight: 200,
                whiteSpace: 'pre-wrap', wordBreak: 'break-all',
              }}>
                {e.stack}
              </pre>
            )}
          </details>
        ))}

        {(errors?.length ?? 0) === 0 && (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <div style={{ fontFamily: SF, fontSize: 15, color: MUTED, marginBottom: 8 }}>No errors logged</div>
            <p style={{ fontFamily: SF, fontSize: 13, color: 'rgba(10,10,10,0.3)' }}>Clean slate. Client errors will appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
}
