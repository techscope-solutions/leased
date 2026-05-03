let _sessionId: string | null = null;

function getSessionId(): string {
  if (_sessionId) return _sessionId;
  try {
    _sessionId = sessionStorage.getItem('leased_sid');
    if (!_sessionId) {
      _sessionId = crypto.randomUUID();
      sessionStorage.setItem('leased_sid', _sessionId);
    }
  } catch {
    _sessionId = Math.random().toString(36).slice(2);
  }
  return _sessionId;
}

export function trackEvent(eventType: string, data?: Record<string, unknown>) {
  try {
    const sessionId = getSessionId();
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: eventType, session_id: sessionId, ...data }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export function trackDealClick(dealId: string) {
  trackEvent('deal_click', { deal_id: dealId });
}
