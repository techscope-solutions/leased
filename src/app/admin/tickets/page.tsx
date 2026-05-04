import { createClient } from '@/lib/supabase/server';
import TicketStatusButton from '@/components/TicketStatusButton';

const A = 'oklch(0.55 0.22 18)';
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const SERIF = '"Instrument Serif", Georgia, serif';
const INK = '#0a0a0a';
const MUTED = 'rgba(10,10,10,0.4)';

const STATUS_COLOR: Record<string, string> = {
  open:        'oklch(0.65 0.14 70)',
  in_progress: 'oklch(0.55 0.18 250)',
  resolved:    'oklch(0.55 0.16 145)',
  closed:      MUTED,
};
const STATUS_BG: Record<string, string> = {
  open:        'rgba(200,140,40,0.10)',
  in_progress: 'rgba(60,80,220,0.08)',
  resolved:    'rgba(34,197,94,0.10)',
  closed:      'rgba(10,10,10,0.05)',
};
const PRIORITY_COLOR: Record<string, string> = {
  urgent: A,
  high:   'oklch(0.65 0.14 70)',
  medium: MUTED,
  low:    'rgba(10,10,10,0.25)',
};

type TicketRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
};

export default async function AdminTickets() {
  const supabase = await createClient();
  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('id, name, email, subject, message, status, priority, created_at')
    .order('created_at', { ascending: false });

  const open = (tickets ?? []).filter((t: TicketRow) => t.status === 'open').length;

  return (
    <div style={{ padding: '32px 40px 80px', maxWidth: 1100, fontFamily: SF, color: INK }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.65 0.14 70)', display: 'inline-block' }} />
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED }}>Support</span>
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(32px, 4vw, 48px)', margin: 0, lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400 }}>
          Tickets <em style={{ color: open > 0 ? 'oklch(0.65 0.14 70)' : MUTED }}>({open} open)</em>
        </h1>
      </div>

      {/* Ticket list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(tickets as TicketRow[] ?? []).map(t => (
          <div key={t.id} className="lz-glass" style={{ padding: '18px 22px', borderRadius: 16, borderColor: t.status === 'open' ? 'rgba(200,140,40,0.25)' : undefined }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: STATUS_COLOR[t.status] ?? MUTED,
                    background: STATUS_BG[t.status] ?? 'rgba(10,10,10,0.05)',
                    padding: '2px 8px', borderRadius: 999,
                  }}>
                    {t.status.replace('_', ' ')}
                  </span>
                  <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: PRIORITY_COLOR[t.priority] ?? MUTED }}>
                    {t.priority}
                  </span>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: MUTED }}>
                    {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ fontFamily: SF, fontWeight: 600, fontSize: 15, color: INK, marginBottom: 4 }}>{t.subject}</div>
                <div style={{ fontFamily: SF, fontSize: 13, color: MUTED, marginBottom: 8 }}>
                  {t.name} · {t.email}
                </div>
                <div style={{ fontFamily: SF, fontSize: 13, color: 'rgba(10,10,10,0.55)', lineHeight: 1.6 }}>
                  {t.message}
                </div>
              </div>
              <TicketStatusButton ticketId={t.id} currentStatus={t.status} />
            </div>
          </div>
        ))}

        {(tickets?.length ?? 0) === 0 && (
          <div style={{ padding: '60px 0', textAlign: 'center', fontFamily: SF, fontSize: 14, color: MUTED }}>
            No support tickets yet
          </div>
        )}
      </div>
    </div>
  );
}
