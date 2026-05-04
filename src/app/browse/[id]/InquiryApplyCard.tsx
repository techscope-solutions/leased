'use client';

import { useState } from 'react';
import Link from 'next/link';
import { submitInquiry } from './actions';

const A   = 'oklch(0.55 0.22 18)';
const SF  = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const SERIF = '"Instrument Serif", Georgia, serif';

const CREDIT_OPTIONS = [
  { value: '750+',    label: '750+  — Excellent' },
  { value: '700-749', label: '700–749 — Very Good' },
  { value: '650-699', label: '650–699 — Good' },
  { value: '600-649', label: '600–649 — Fair' },
  { value: '<600',    label: 'Below 600 — Building' },
];

const TERM_OPTIONS = [24, 30, 36, 39, 42, 48];

type Status = 'sent' | 'viewed' | 'replied' | 'application_sent' | 'complete';

const STATUS_STEPS: { key: Status; label: string }[] = [
  { key: 'sent',             label: 'Inquiry sent' },
  { key: 'viewed',           label: 'Seller viewed' },
  { key: 'replied',          label: 'Seller replied' },
  { key: 'application_sent', label: 'Application sent' },
  { key: 'complete',         label: 'Deal complete' },
];

function StatusTracker({ status }: { status: Status }) {
  const idx = STATUS_STEPS.findIndex(s => s.key === status);
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 12 }}>
        Inquiry status
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {STATUS_STEPS.map((step, i) => {
          const done    = i < idx;
          const current = i === idx;
          const future  = i > idx;
          return (
            <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', position: 'relative' }}>
              {/* Line connector */}
              {i < STATUS_STEPS.length - 1 && (
                <div style={{ position: 'absolute', left: 7, top: 24, width: 2, height: 'calc(100% - 8px)', background: done ? A : 'rgba(255,255,255,0.08)', zIndex: 0 }} />
              )}
              {/* Dot */}
              <div style={{
                width: 16, height: 16, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                background: done ? A : current ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.08)',
                border: current ? `2px solid ${A}` : done ? 'none' : '2px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {done && (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                )}
              </div>
              <span style={{
                fontFamily: SF, fontSize: 13,
                color: done || current ? (current ? 'white' : 'rgba(255,255,255,0.75)') : 'rgba(255,255,255,0.25)',
                fontWeight: current ? 600 : 400,
              }}>{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type Props = {
  dealId: string;
  sellerId: string;
  monthly: number;
  dueAtSigning: number;
  term: number;
  milesLabel: string;
  msrp: number;
  slotsLeft: number | null;
  dealType: string;
  userId: string | null;
  existingInquiry: { status: Status } | null;
};

export default function InquiryApplyCard({
  dealId, sellerId, monthly, dueAtSigning, term, milesLabel, msrp, slotsLeft, dealType,
  userId, existingInquiry,
}: Props) {
  const [open, setOpen]           = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  // Form state
  const [prefTerm, setPrefTerm]     = useState(term);
  const [prefDown, setPrefDown]     = useState(String(dueAtSigning));
  const [income, setIncome]         = useState('');
  const [credit, setCredit]         = useState('700-749');
  const [message, setMessage]       = useState('');

  const isOwnDeal = userId === sellerId;
  const hasInquiry = submitted || !!existingInquiry;
  const inquiryStatus: Status = submitted ? 'sent' : (existingInquiry?.status ?? 'sent');

  async function handleSubmit() {
    setError('');
    if (!income) { setError('Please enter your estimated annual income.'); return; }
    setLoading(true);
    const result = await submitInquiry({
      dealId,
      sellerId,
      preferredTerm:    prefTerm,
      preferredDown:    parseInt(prefDown) || 0,
      estimatedIncome:  parseInt(income) || 0,
      estimatedCredit:  credit,
      message,
    });
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }
    setSubmitted(true);
    setOpen(false);
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
    color: 'white', fontFamily: SF, fontSize: 14, outline: 'none',
    boxSizing: 'border-box' as const, transition: 'border-color 0.15s',
  };
  const labelStyle = {
    fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em',
    color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const,
    display: 'block', marginBottom: 6,
  };

  return (
    <>
      {/* ── Apply card ─────────────────────────────────── */}
      <div style={{
        borderRadius: 24, padding: 24,
        background: 'rgba(18,18,18,0.94)',
        backdropFilter: 'blur(24px) saturate(120%)',
        WebkitBackdropFilter: 'blur(24px) saturate(120%)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'white',
      }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>
          {dealType === 'LEASE' ? 'Lease this car' : 'Finance this car'}
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '10px 0 4px' }}>
          <span style={{ fontFamily: SERIF, fontSize: 64, lineHeight: 0.9, color: 'white', letterSpacing: '-0.035em', fontWeight: 400 }}>
            ${monthly.toLocaleString()}
          </span>
          <span style={{ fontSize: 16, opacity: 0.5 }}>/mo</span>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>
          ${dueAtSigning.toLocaleString()} due at signing · {term}mo · {milesLabel} mi/yr
        </div>

        {/* Terms summary */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 0', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'MSRP',          value: `$${msrp.toLocaleString()}` },
            { label: 'Due at signing', value: `$${dueAtSigning.toLocaleString()}` },
            { label: 'Term',           value: `${term} months` },
            { label: 'Miles / year',   value: milesLabel },
            ...(slotsLeft != null ? [{ label: 'Slots left', value: String(slotsLeft) }] : []),
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>{label}</span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontFamily: SF }}>{value}</span>
            </div>
          ))}
        </div>

        {/* CTA area */}
        {isOwnDeal ? (
          <div style={{ padding: '12px 0', fontSize: 13, color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontFamily: SF }}>
            This is your listing
          </div>
        ) : !userId ? (
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button style={{ width: '100%', padding: '14px 18px', borderRadius: 999, background: A, color: 'white', border: 'none', fontFamily: SF, fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>
              Sign in to show interest
            </button>
          </Link>
        ) : hasInquiry ? (
          <div>
            <div style={{ padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: SF, textAlign: 'center', marginBottom: 4 }}>
              ✓ Inquiry sent to seller
            </div>
            <StatusTracker status={inquiryStatus} />
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            style={{ width: '100%', padding: '14px 18px', borderRadius: 999, background: A, color: 'white', border: 'none', fontFamily: SF, fontWeight: 500, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            I&rsquo;m interested
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </button>
        )}

        {/* Trust grid */}
        {!hasInquiry && !isOwnDeal && (
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {[
              { icon: '🛡', text: 'Verified listing' },
              { icon: '✓', text: 'No hidden fees' },
              { icon: '⚡', text: 'Avail. this week' },
              { icon: '✦', text: 'Price guaranteed' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.55)', fontSize: 11, fontFamily: SF }}>
                <span style={{ fontSize: 12 }}>{icon}</span> {text}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal overlay ──────────────────────────────── */}
      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            padding: '0 0 0 0',
          }}
        >
          <div style={{
            width: '100%', maxWidth: 520,
            background: '#1a1a1a', borderRadius: '24px 24px 0 0',
            padding: '28px 24px 40px', maxHeight: '92dvh',
            overflowY: 'auto', color: 'white',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            {/* Handle bar */}
            <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', margin: '0 auto 24px' }} />

            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 6 }}>
              Show interest
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 400, letterSpacing: '-0.025em', margin: '0 0 4px', lineHeight: 1.1 }}>
              Ask for a <em style={{ color: A }}>structure.</em>
            </h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: SF, marginBottom: 24, lineHeight: 1.5 }}>
              Tell the seller what works for you. They'll respond with options.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Preferred term */}
              <div>
                <label style={labelStyle}>Preferred term</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {TERM_OPTIONS.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPrefTerm(t)}
                      style={{
                        padding: '8px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                        background: prefTerm === t ? A : 'rgba(255,255,255,0.07)',
                        color: prefTerm === t ? 'white' : 'rgba(255,255,255,0.6)',
                        fontFamily: SF, fontSize: 13, fontWeight: prefTerm === t ? 600 : 400,
                        transition: 'all 0.15s',
                      }}
                    >
                      {t} mo
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred down */}
              <div>
                <label style={labelStyle}>Preferred down payment ($)</label>
                <input
                  type="number"
                  value={prefDown}
                  onChange={e => setPrefDown(e.target.value)}
                  placeholder="0"
                  style={inputStyle}
                />
              </div>

              {/* Income */}
              <div>
                <label style={labelStyle}>Estimated annual income ($) *</label>
                <input
                  type="number"
                  value={income}
                  onChange={e => setIncome(e.target.value)}
                  placeholder="75000"
                  style={inputStyle}
                />
              </div>

              {/* Credit */}
              <div>
                <label style={labelStyle}>Estimated credit score</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {CREDIT_OPTIONS.map(opt => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '9px 12px', borderRadius: 10, background: credit === opt.value ? 'rgba(255,255,255,0.07)' : 'transparent', border: `1px solid ${credit === opt.value ? 'rgba(255,255,255,0.15)' : 'transparent'}`, transition: 'all 0.1s' }}>
                      <input type="radio" name="credit" value={opt.value} checked={credit === opt.value} onChange={() => setCredit(opt.value)} style={{ accentColor: A, flexShrink: 0 }} />
                      <span style={{ fontFamily: SF, fontSize: 13, color: credit === opt.value ? 'white' : 'rgba(255,255,255,0.55)' }}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle}>Message to seller (optional)</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="I'm interested in a 36-month term with $0 down. Is this available in SF?"
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                />
              </div>

              {error && (
                <div style={{ padding: '10px 14px', borderRadius: 10, background: `${A}18`, border: `1px solid ${A}35`, fontSize: 13, color: A, fontFamily: SF }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%', padding: '15px', borderRadius: 999,
                  background: loading ? 'rgba(255,255,255,0.1)' : A,
                  border: 'none', color: 'white',
                  fontFamily: SF, fontWeight: 600, fontSize: 15,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'background 0.15s',
                }}
              >
                {loading ? (
                  <>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                    Sending…
                  </>
                ) : 'Send inquiry →'}
              </button>

              <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: SF, margin: 0 }}>
                Your financial info is only shared with this seller.
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
