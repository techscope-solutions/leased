import { createClient } from '@/lib/supabase/server';
import TicketStatusButton from '@/components/TicketStatusButton';

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

const STATUS_COLORS: Record<string, string> = {
  open: '#f59e0b',
  in_progress: '#4a7fd4',
  resolved: '#22c55e',
  closed: 'rgba(255,255,255,0.3)',
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: '#FF2800',
  high: '#f59e0b',
  medium: 'rgba(255,255,255,0.5)',
  low: 'rgba(255,255,255,0.25)',
};

export default async function AdminTickets() {
  const supabase = await createClient();

  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('id, name, email, subject, message, status, priority, created_at')
    .order('created_at', { ascending: false });

  const open = (tickets ?? []).filter((t: TicketRow) => t.status === 'open').length;

  return (
    <div style={{ padding: '40px 32px 80px', maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>SUPPORT</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.02em', color: '#fff' }}>
          TICKETS <span style={{ color: open > 0 ? '#f59e0b' : 'rgba(255,255,255,0.3)' }}>({open} OPEN)</span>
        </div>
      </div>

      {/* Ticket list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(tickets as TicketRow[] ?? []).map(t => (
          <div key={t.id} style={{
            padding: '20px 24px',
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${t.status === 'open' ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.06)'}`,
            borderRadius: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'var(--font-barlow-cond)',
                    fontWeight: 700,
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    color: STATUS_COLORS[t.status] ?? 'rgba(255,255,255,0.4)',
                    background: `${STATUS_COLORS[t.status]}18`,
                    padding: '2px 8px',
                    borderRadius: 99,
                  }}>
                    {t.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-barlow-cond)',
                    fontWeight: 700,
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    color: PRIORITY_COLORS[t.priority] ?? 'rgba(255,255,255,0.4)',
                  }}>
                    {t.priority.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: 'var(--font-barlow-cond)', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
                    {new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 4 }}>{t.subject}</div>
                <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                  {t.name} · {t.email}
                </div>
                <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                  {t.message}
                </div>
              </div>
              <TicketStatusButton ticketId={t.id} currentStatus={t.status} />
            </div>
          </div>
        ))}

        {(tickets?.length ?? 0) === 0 && (
          <div style={{ padding: '60px 0', textAlign: 'center', fontFamily: 'var(--font-barlow)', fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>
            No support tickets yet
          </div>
        )}
      </div>
    </div>
  );
}
