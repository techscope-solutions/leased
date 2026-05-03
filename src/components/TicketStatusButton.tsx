'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

const STATUS_COLORS: Record<string, string> = {
  open: '#f59e0b',
  in_progress: '#4a7fd4',
  resolved: '#22c55e',
  closed: 'rgba(255,255,255,0.3)',
};

export default function TicketStatusButton({ ticketId, currentStatus }: { ticketId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function updateStatus(newStatus: string) {
    setSaving(true);
    setOpen(false);
    const supabase = createClient();
    await supabase.from('support_tickets').update({ status: newStatus }).eq('id', ticketId);
    setStatus(newStatus);
    setSaving(false);
  }

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(v => !v)}
        disabled={saving}
        style={{
          padding: '8px 14px',
          background: `${STATUS_COLORS[status]}12`,
          border: `1px solid ${STATUS_COLORS[status]}40`,
          borderRadius: 8,
          fontFamily: 'var(--font-barlow-cond)',
          fontWeight: 700,
          fontSize: 10,
          letterSpacing: '0.1em',
          color: STATUS_COLORS[status],
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {saving ? '...' : status.replace('_', ' ').toUpperCase()} ▾
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          marginTop: 4,
          background: '#111',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10,
          overflow: 'hidden',
          zIndex: 10,
          minWidth: 140,
        }}>
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 14px',
                background: s === status ? 'rgba(255,255,255,0.06)' : 'transparent',
                border: 'none',
                fontFamily: 'var(--font-barlow-cond)',
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: '0.1em',
                color: STATUS_COLORS[s] ?? 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {s.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
