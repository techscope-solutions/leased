'use client';

import { useState } from 'react';

const INPUT_STYLE = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  fontFamily: 'var(--font-barlow)',
  fontSize: 14,
  color: '#fff',
  outline: 'none',
  boxSizing: 'border-box' as const,
  transition: 'border-color 0.15s',
};

const LABEL_STYLE = {
  display: 'block',
  fontFamily: 'var(--font-barlow-cond)',
  fontWeight: 700,
  fontSize: 10,
  letterSpacing: '0.14em',
  color: 'rgba(255,255,255,0.4)',
  marginBottom: 8,
};

export default function SupportForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  function update(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ padding: '40px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 18, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 32, color: '#22c55e', marginBottom: 10 }}>SENT.</div>
        <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
          We&apos;ve received your message and will get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <label style={LABEL_STYLE}>NAME</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={e => update('name', e.target.value)}
            placeholder="Your name"
            style={INPUT_STYLE}
          />
        </div>
        <div>
          <label style={LABEL_STYLE}>EMAIL</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={e => update('email', e.target.value)}
            placeholder="you@example.com"
            style={INPUT_STYLE}
          />
        </div>
      </div>

      <div>
        <label style={LABEL_STYLE}>SUBJECT</label>
        <input
          type="text"
          required
          value={form.subject}
          onChange={e => update('subject', e.target.value)}
          placeholder="What's this about?"
          style={INPUT_STYLE}
        />
      </div>

      <div>
        <label style={LABEL_STYLE}>MESSAGE</label>
        <textarea
          required
          value={form.message}
          onChange={e => update('message', e.target.value)}
          placeholder="Describe your issue in detail..."
          rows={6}
          style={{ ...INPUT_STYLE, resize: 'vertical', minHeight: 140 }}
        />
      </div>

      {status === 'error' && (
        <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 12, color: '#FF2800' }}>
          Something went wrong. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        style={{
          padding: '14px',
          background: status === 'sending' ? 'rgba(255,40,0,0.3)' : '#FF2800',
          border: 'none',
          borderRadius: 12,
          fontFamily: 'var(--font-barlow-cond)',
          fontWeight: 800,
          fontSize: 13,
          letterSpacing: '0.1em',
          color: '#fff',
          cursor: status === 'sending' ? 'not-allowed' : 'pointer',
          transition: 'opacity 0.15s',
        }}
      >
        {status === 'sending' ? 'SENDING...' : 'SUBMIT TICKET'}
      </button>
    </form>
  );
}
