'use client';

import { deleteDeal } from './actions';

export function DeleteDealButton({ dealId, label }: { dealId: string; label: string }) {
  const A = 'oklch(0.55 0.22 18)';
  const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';
  return (
    <form action={deleteDeal} onSubmit={(e) => { if (!confirm(`Delete ${label}?`)) e.preventDefault(); }}>
      <input type="hidden" name="dealId" value={dealId} />
      <button type="submit" style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(180,30,20,0.07)', border: `1px solid ${A}30`, color: A, fontFamily: SF, fontWeight: 500, fontSize: 12, cursor: 'pointer' }}>✕</button>
    </form>
  );
}

export function DeleteDealButtonSmall({ dealId }: { dealId: string }) {
  const A = 'oklch(0.55 0.22 18)';
  const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';
  return (
    <form action={deleteDeal} onSubmit={(e) => { if (!confirm('Delete this deal?')) e.preventDefault(); }}>
      <input type="hidden" name="dealId" value={dealId} />
      <button type="submit" style={{ padding: '5px 12px', borderRadius: 8, background: 'rgba(180,30,20,0.07)', border: `1px solid ${A}30`, color: A, fontFamily: SF, fontWeight: 500, fontSize: 12, cursor: 'pointer' }}>Delete</button>
    </form>
  );
}
