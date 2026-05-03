'use client';

import { useState } from 'react';

export default function GenerateBlogButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function generate() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/generate-blog', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        setResult({ ok: true, message: `Generated: "${data.title}"` });
        setTimeout(() => location.reload(), 1500);
      } else {
        setResult({ ok: false, message: data.error ?? 'Generation failed' });
      }
    } catch {
      setResult({ ok: false, message: 'Network error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <button
        onClick={generate}
        disabled={loading}
        style={{
          padding: '10px 20px',
          background: loading ? 'rgba(34,197,94,0.05)' : 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: 10,
          fontFamily: 'var(--font-barlow-cond)',
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: '0.1em',
          color: '#22c55e',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          transition: 'all 0.15s',
        }}
      >
        {loading ? '◷ GENERATING...' : '+ GENERATE NEW POST'}
      </button>
      {result && (
        <span style={{
          fontFamily: 'var(--font-barlow)',
          fontSize: 12,
          color: result.ok ? '#22c55e' : '#FF2800',
        }}>
          {result.message}
        </span>
      )}
    </div>
  );
}
