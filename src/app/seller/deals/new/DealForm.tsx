'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const ACCENT: Record<string, string> = {
  Daily: '#111827',
  Luxury: '#0a0f1e',
  Supercar: '#161616',
};

type Field = {
  make: string;
  model: string;
  trim: string;
  year: string;
  drive: string;
  car_type: string;
  category: string;
  color: string;
  deal_type: string;
  monthly: string;
  due_at_signing: string;
  term: string;
  miles_per_year: string;
  msrp: string;
  zero_deal: boolean;
  state: string;
  city: string;
  slots_left: string;
  expires_days: string;
};

const EMPTY: Field = {
  make: '', model: '', trim: '', year: new Date().getFullYear().toString(),
  drive: 'AWD', car_type: 'Sedan', category: 'Daily',
  color: '', deal_type: 'LEASE',
  monthly: '', due_at_signing: '0', term: '36', miles_per_year: '10000',
  msrp: '', zero_deal: false,
  state: '', city: '', slots_left: '', expires_days: '7',
};

export default function DealForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Field>(EMPTY);
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof Field, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.make || !form.model || !form.monthly || !form.msrp || !form.state || !form.city) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    const supabase = createClient();

    // Upload images
    const imageUrls: string[] = [];
    for (const file of images) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${userId}/${Date.now()}-${safeName}`;
      const { error: upErr } = await supabase.storage
        .from('deal-images')
        .upload(path, file, { upsert: false });
      if (upErr) { setError(`Image upload failed: ${upErr.message}`); setSubmitting(false); return; }
      const { data: { publicUrl } } = supabase.storage.from('deal-images').getPublicUrl(path);
      imageUrls.push(publicUrl);
    }

    const accent = ACCENT[form.category] ?? '#111827';
    const expiresAt = new Date(Date.now() + parseInt(form.expires_days) * 24 * 3600 * 1000).toISOString();

    const { error: insertErr } = await supabase.from('deals').insert({
      seller_id: userId,
      status: 'pending',
      make: form.make.trim().toUpperCase(),
      model: form.model.trim().toUpperCase(),
      trim: form.trim.trim().toUpperCase(),
      year: parseInt(form.year),
      drive: form.drive,
      car_type: form.car_type,
      category: form.category,
      color: form.color || null,
      deal_type: form.deal_type,
      monthly: parseInt(form.monthly),
      due_at_signing: parseInt(form.due_at_signing),
      term: parseInt(form.term),
      miles_per_year: parseInt(form.miles_per_year),
      msrp: parseInt(form.msrp),
      zero_deal: form.zero_deal,
      state: form.state.trim().toUpperCase(),
      city: form.city.trim(),
      slots_left: form.slots_left ? parseInt(form.slots_left) : null,
      expires_at: expiresAt,
      images: imageUrls,
      accent,
      stripe: `linear-gradient(135deg, ${accent} 0%, ${accent}ee 100%)`,
    });

    if (insertErr) {
      setError(insertErr.message);
      setSubmitting(false);
      return;
    }
    router.push('/seller/dashboard?posted=1');
  };

  return (
    <div style={{ padding: '48px 24px 100px', maxWidth: 720, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF2800' }} />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>
            SELLER PORTAL
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '-0.025em', lineHeight: 0.92, marginBottom: 10 }}>
          <span style={{ color: '#fff' }}>POST A </span>
          <span style={{ background: 'linear-gradient(135deg, #FF2800 20%, #cc1f00 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DROP.</span>
        </div>
        <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          Your deal will be reviewed by a moderator before going live.
        </p>
      </div>

      {/* Section: Vehicle */}
      <Section label="VEHICLE">
        <Row>
          <Field label="MAKE *" note="e.g. BMW">
            <Input value={form.make} onChange={v => set('make', v)} placeholder="BMW" />
          </Field>
          <Field label="MODEL *" note="e.g. M3 COMPETITION">
            <Input value={form.model} onChange={v => set('model', v)} placeholder="M3 COMPETITION" />
          </Field>
        </Row>
        <Row>
          <Field label="TRIM" note="e.g. XDRIVE">
            <Input value={form.trim} onChange={v => set('trim', v)} placeholder="XDRIVE" />
          </Field>
          <Field label="YEAR *">
            <Select value={form.year} onChange={v => set('year', v)}>
              {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </Select>
          </Field>
        </Row>
        <Row>
          <Field label="DRIVETRAIN *">
            <Select value={form.drive} onChange={v => set('drive', v)}>
              {['AWD', 'RWD', 'FWD', '4WD'].map(d => <option key={d}>{d}</option>)}
            </Select>
          </Field>
          <Field label="CAR TYPE *">
            <Select value={form.car_type} onChange={v => set('car_type', v)}>
              {['Sedan', 'SUV', 'Coupe', 'Truck', 'EV'].map(t => <option key={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="CATEGORY *">
            <Select value={form.category} onChange={v => set('category', v)}>
              {['Daily', 'Luxury', 'Supercar'].map(c => <option key={c}>{c}</option>)}
            </Select>
          </Field>
        </Row>
        <Row>
          <Field label="COLOR" note="optional">
            <Input value={form.color} onChange={v => set('color', v)} placeholder="Midnight Black" />
          </Field>
        </Row>
      </Section>

      {/* Section: Deal Terms */}
      <Section label="DEAL TERMS">
        <Row>
          <Field label="DEAL TYPE *">
            <Select value={form.deal_type} onChange={v => set('deal_type', v)}>
              <option value="LEASE">LEASE</option>
              <option value="FINANCE">FINANCE</option>
            </Select>
          </Field>
          <Field label="MONTHLY ($) *">
            <Input type="number" value={form.monthly} onChange={v => set('monthly', v)} placeholder="899" />
          </Field>
          <Field label="DUE AT SIGNING ($) *">
            <Input type="number" value={form.due_at_signing} onChange={v => set('due_at_signing', v)} placeholder="0" />
          </Field>
        </Row>
        <Row>
          <Field label="TERM (MONTHS) *">
            <Select value={form.term} onChange={v => set('term', v)}>
              {['24', '36', '39', '48'].map(t => <option key={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="MILES / YEAR *">
            <Select value={form.miles_per_year} onChange={v => set('miles_per_year', v)}>
              {['7500', '10000', '12000', '15000'].map(m => <option key={m}>{m}</option>)}
            </Select>
          </Field>
          <Field label="MSRP ($) *">
            <Input type="number" value={form.msrp} onChange={v => set('msrp', v)} placeholder="92800" />
          </Field>
        </Row>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', paddingTop: 4 }}>
          <input
            type="checkbox"
            checked={form.zero_deal}
            onChange={e => set('zero_deal', e.target.checked)}
            style={{ width: 16, height: 16, accentColor: '#FF2800' }}
          />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)' }}>
            ZERO DOWN DEAL
          </span>
        </label>
      </Section>

      {/* Section: Location & Inventory */}
      <Section label="LOCATION & INVENTORY">
        <Row>
          <Field label="STATE *" note="2-letter code">
            <Input value={form.state} onChange={v => set('state', v)} placeholder="CA" maxLength={2} />
          </Field>
          <Field label="CITY *">
            <Input value={form.city} onChange={v => set('city', v)} placeholder="Los Angeles" />
          </Field>
          <Field label="SLOTS AVAILABLE" note="blank = unlimited">
            <Input type="number" value={form.slots_left} onChange={v => set('slots_left', v)} placeholder="∞" />
          </Field>
        </Row>
      </Section>

      {/* Section: Expiration */}
      <Section label="EXPIRATION">
        <Row>
          <Field label="DEAL EXPIRES IN *">
            <Select value={form.expires_days} onChange={v => set('expires_days', v)}>
              <option value="1">1 day</option>
              <option value="3">3 days</option>
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
            </Select>
          </Field>
        </Row>
      </Section>

      {/* Section: Images */}
      <Section label="IMAGES">
        <div style={{
          border: '1px dashed rgba(255,255,255,0.15)',
          borderRadius: 14,
          padding: '24px 20px',
          background: 'rgba(255,255,255,0.02)',
          cursor: 'pointer',
          position: 'relative',
        }}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImages}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }}
          />
          {images.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                CLICK OR DROP FILES HERE
              </div>
              <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
                Up to 5 images · JPG, PNG, WEBP
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {images.map((f, i) => (
                <div key={i} style={{
                  padding: '6px 12px', background: 'rgba(255,40,0,0.1)',
                  border: '1px solid rgba(255,40,0,0.3)', borderRadius: 8,
                  fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.7)',
                }}>
                  {f.name}
                </div>
              ))}
            </div>
          )}
        </div>
        {images.length > 0 && (
          <div style={{ marginTop: 8, fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
            {images.length} image{images.length > 1 ? 's' : ''} selected
          </div>
        )}
      </Section>

      {/* Error */}
      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(255,40,0,0.1)', border: '1px solid rgba(255,40,0,0.3)', borderRadius: 10, marginBottom: 20, fontFamily: 'var(--font-barlow)', fontSize: 12, color: '#ff6b6b' }}>
          {error}
        </div>
      )}

      {/* Submit */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            flex: 1, padding: '16px',
            borderRadius: 14,
            background: submitting ? 'rgba(255,40,0,0.4)' : 'rgba(255,40,0,0.9)',
            border: '1px solid rgba(255,80,40,0.4)',
            boxShadow: submitting ? 'none' : '0 4px 28px rgba(255,40,0,0.3)',
            color: '#fff',
            fontFamily: 'var(--font-barlow-cond)', fontWeight: 800,
            fontSize: 14, letterSpacing: '0.1em',
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {submitting ? 'SUBMITTING…' : 'SUBMIT FOR REVIEW →'}
        </button>
        <button
          onClick={() => router.back()}
          disabled={submitting}
          style={{
            padding: '16px 24px', borderRadius: 14,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: 'var(--font-barlow-cond)', fontWeight: 700,
            fontSize: 13, letterSpacing: '0.08em', cursor: 'pointer',
          }}
        >
          CANCEL
        </button>
      </div>

      <p style={{ marginTop: 16, fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
        A moderator will review your submission before it goes live.
      </p>
    </div>
  );
}

/* Helpers */

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
        {label}
      </div>
      <div style={{ padding: '24px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(140px, 1fr))`, gap: 14 }}>
      {children}
    </div>
  );
}

function Field({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)' }}>
          {label}
        </span>
        {note && (
          <span style={{ fontFamily: 'var(--font-barlow)', fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>
            {note}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text', maxLength }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: '9px 12px',
        color: '#fff',
        fontFamily: 'var(--font-barlow)',
        fontSize: 13,
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
      }}
    />
  );
}

function Select({ value, onChange, children }: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: 'rgba(20,20,20,0.9)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: '9px 12px',
        color: '#fff',
        fontFamily: 'var(--font-barlow)',
        fontSize: 13,
        outline: 'none',
        width: '100%',
        cursor: 'pointer',
      }}
    >
      {children}
    </select>
  );
}
