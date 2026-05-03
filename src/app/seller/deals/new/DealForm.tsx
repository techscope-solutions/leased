'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { guessCarSpecs, POPULAR_MAKES } from '@/lib/carHeuristics';

const ACCENT: Record<string, string> = {
  Daily: '#111827', Luxury: '#0a0f1e', Supercar: '#161616',
};

export default function DealForm({ userId }: { userId: string }) {
  const router = useRouter();

  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [trim, setTrim] = useState('');
  const [drive, setDrive] = useState('AWD');
  const [carType, setCarType] = useState('Sedan');
  const [category, setCategory] = useState('Daily');
  const [color, setColor] = useState('');
  const [dealType, setDealType] = useState('LEASE');
  const [monthly, setMonthly] = useState('');
  const [das, setDas] = useState('0');
  const [term, setTerm] = useState('36');
  const [mpy, setMpy] = useState('10000');
  const [msrp, setMsrp] = useState('');
  const [zeroDeal, setZeroDeal] = useState(false);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [slots, setSlots] = useState('');
  const [expiresDays, setExpiresDays] = useState('7');

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [specsFilled, setSpecsFilled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const urls = images.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [images]);

  useEffect(() => {
    if (!make || make.length < 2) { setModels([]); return; }
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/car-lookup?make=${encodeURIComponent(make)}&year=${year}`);
        const data = await res.json();
        setModels(data.models ?? []);
      } catch { /* ignore */ }
    }, 450);
    return () => clearTimeout(id);
  }, [make, year]);

  const handleAutoFill = () => {
    const specs = guessCarSpecs(make, model);
    if (!specs) return;
    setDrive(specs.drive);
    setCarType(specs.carType);
    setCategory(specs.category);
    setSpecsFilled(true);
    setTimeout(() => setSpecsFilled(false), 3000);
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(prev => [...prev, ...Array.from(e.target.files!)].slice(0, 8));
  };

  const removeImage = (i: number) => setImages(prev => prev.filter((_, j) => j !== i));

  const handleSubmit = async () => {
    setError('');
    if (!make || !model || !monthly || !msrp || !state || !city) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    const supabase = createClient();

    const imageUrls: string[] = [];
    for (const file of images) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${userId}/${Date.now()}-${safeName}`;
      const { error: upErr } = await supabase.storage.from('deal-images').upload(path, file, { upsert: false });
      if (upErr) { setError(`Image upload failed: ${upErr.message}`); setSubmitting(false); return; }
      const { data: { publicUrl } } = supabase.storage.from('deal-images').getPublicUrl(path);
      imageUrls.push(publicUrl);
    }

    const accent = ACCENT[category] ?? '#111827';
    const expiresAt = new Date(Date.now() + parseInt(expiresDays) * 24 * 3600 * 1000).toISOString();

    const { error: insertErr } = await supabase.from('deals').insert({
      seller_id: userId, status: 'pending',
      make: make.trim().toUpperCase(), model: model.trim().toUpperCase(), trim: trim.trim().toUpperCase(),
      year: parseInt(year), drive, car_type: carType, category,
      color: color || null, deal_type: dealType,
      monthly: parseInt(monthly), due_at_signing: parseInt(das),
      term: parseInt(term), miles_per_year: parseInt(mpy), msrp: parseInt(msrp),
      zero_deal: zeroDeal, state: state.trim().toUpperCase(), city: city.trim(),
      slots_left: slots ? parseInt(slots) : null, expires_at: expiresAt,
      images: imageUrls, accent,
      stripe: `linear-gradient(135deg, ${accent} 0%, ${accent}ee 100%)`,
    });

    if (insertErr) { setError(insertErr.message); setSubmitting(false); return; }
    router.push('/seller/dashboard?posted=1');
  };

  return (
    <div style={{ padding: '48px 24px 100px', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF2800' }} />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>SELLER PORTAL</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '-0.025em', lineHeight: 0.92, marginBottom: 10 }}>
          <span style={{ color: '#fff' }}>POST A </span>
          <span style={{ background: 'linear-gradient(135deg, #FF2800 20%, #cc1f00 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>DROP.</span>
        </div>
        <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
          Your deal will be reviewed by a moderator before going live.
        </p>
      </div>

      <Section label="VEHICLE">
        {/* Lookup row */}
        <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 1fr auto', gap: 10, alignItems: 'flex-end' }}>
          <Field label="YEAR">
            <Select value={year} onChange={setYear}>
              {[2027,2026,2025,2024,2023,2022,2021,2020].map(y => <option key={y} value={y}>{y}</option>)}
            </Select>
          </Field>
          <Field label="MAKE *">
            <Input value={make} onChange={setMake} placeholder="BMW" list="makes-list" />
            <datalist id="makes-list">
              {POPULAR_MAKES.map(m => <option key={m} value={m} />)}
            </datalist>
          </Field>
          <Field label="MODEL *">
            <Input value={model} onChange={setModel} placeholder="M3 Competition" list="models-list" />
            <datalist id="models-list">
              {models.map(m => <option key={m} value={m} />)}
            </datalist>
          </Field>
          <button
            type="button"
            onClick={handleAutoFill}
            disabled={!make || !model}
            style={{
              padding: '9px 14px', borderRadius: 8, marginBottom: 1,
              background: specsFilled ? 'rgba(34,197,94,0.2)' : (!make || !model) ? 'rgba(255,255,255,0.04)' : 'rgba(255,40,0,0.15)',
              border: `1px solid ${specsFilled ? 'rgba(34,197,94,0.4)' : (!make || !model) ? 'rgba(255,255,255,0.08)' : 'rgba(255,40,0,0.35)'}`,
              color: specsFilled ? '#22c55e' : (!make || !model) ? 'rgba(255,255,255,0.25)' : '#FF2800',
              fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 10,
              letterSpacing: '0.1em', cursor: (!make || !model) ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}
          >
            {specsFilled ? '✓ FILLED' : '⚡ AUTO-FILL'}
          </button>
        </div>

        <Row>
          <Field label="TRIM" note="optional">
            <Input value={trim} onChange={setTrim} placeholder="xDrive" />
          </Field>
          <Field label="COLOR" note="optional">
            <Input value={color} onChange={setColor} placeholder="Midnight Black" />
          </Field>
        </Row>
        <Row>
          <Field label="DRIVETRAIN *">
            <Select value={drive} onChange={setDrive}>{['AWD','RWD','FWD','4WD'].map(d => <option key={d}>{d}</option>)}</Select>
          </Field>
          <Field label="CAR TYPE *">
            <Select value={carType} onChange={setCarType}>{['Sedan','SUV','Coupe','Truck','EV'].map(t => <option key={t}>{t}</option>)}</Select>
          </Field>
          <Field label="CATEGORY *">
            <Select value={category} onChange={setCategory}>{['Daily','Luxury','Supercar'].map(c => <option key={c}>{c}</option>)}</Select>
          </Field>
        </Row>
      </Section>

      <Section label="DEAL TERMS">
        <Row>
          <Field label="DEAL TYPE *">
            <Select value={dealType} onChange={setDealType}><option value="LEASE">LEASE</option><option value="FINANCE">FINANCE</option></Select>
          </Field>
          <Field label="MONTHLY ($) *">
            <Input type="number" value={monthly} onChange={setMonthly} placeholder="899" />
          </Field>
          <Field label="DUE AT SIGNING ($) *">
            <Input type="number" value={das} onChange={setDas} placeholder="0" />
          </Field>
        </Row>
        <Row>
          <Field label="TERM (MONTHS) *">
            <Select value={term} onChange={setTerm}>{['24','36','39','48'].map(t => <option key={t}>{t}</option>)}</Select>
          </Field>
          <Field label="MILES / YEAR *">
            <Select value={mpy} onChange={setMpy}>{['7500','10000','12000','15000'].map(m => <option key={m}>{m}</option>)}</Select>
          </Field>
          <Field label="MSRP ($) *">
            <Input type="number" value={msrp} onChange={setMsrp} placeholder="92800" />
          </Field>
        </Row>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', paddingTop: 4 }}>
          <input type="checkbox" checked={zeroDeal} onChange={e => setZeroDeal(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#FF2800' }} />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)' }}>ZERO DOWN DEAL</span>
        </label>
      </Section>

      <Section label="LOCATION & INVENTORY">
        <Row>
          <Field label="STATE *" note="2-letter code">
            <Input value={state} onChange={setState} placeholder="CA" maxLength={2} />
          </Field>
          <Field label="CITY *">
            <Input value={city} onChange={setCity} placeholder="Los Angeles" />
          </Field>
          <Field label="SLOTS AVAILABLE" note="blank = unlimited">
            <Input type="number" value={slots} onChange={setSlots} placeholder="∞" />
          </Field>
        </Row>
      </Section>

      <Section label="EXPIRATION">
        <Row>
          <Field label="DEAL EXPIRES IN *">
            <Select value={expiresDays} onChange={setExpiresDays}>
              <option value="1">1 day</option>
              <option value="3">3 days</option>
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
            </Select>
          </Field>
        </Row>
      </Section>

      <Section label="PHOTOS">
        {previews.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8, marginBottom: 4 }}>
            {previews.map((src, i) => (
              <div key={i} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,40,0,0.25)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.75)', border: 'none', color: '#fff', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >×</button>
              </div>
            ))}
          </div>
        )}
        <label style={{ border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 12, padding: '20px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <input type="file" accept="image/*" multiple onChange={handleImages} style={{ display: 'none' }} />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)' }}>
            {previews.length === 0 ? 'CLICK OR DROP PHOTOS HERE' : '+ ADD MORE PHOTOS'}
          </span>
          <span style={{ fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>
            Up to 8 images · JPG, PNG, WEBP
          </span>
        </label>
      </Section>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(255,40,0,0.1)', border: '1px solid rgba(255,40,0,0.3)', borderRadius: 10, marginBottom: 20, fontFamily: 'var(--font-barlow)', fontSize: 12, color: '#ff6b6b' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            flex: 1, padding: '16px', borderRadius: 14,
            background: submitting ? 'rgba(255,40,0,0.4)' : 'rgba(255,40,0,0.9)',
            border: '1px solid rgba(255,80,40,0.4)',
            boxShadow: submitting ? 'none' : '0 4px 28px rgba(255,40,0,0.3)',
            color: '#fff', fontFamily: 'var(--font-barlow-cond)', fontWeight: 800,
            fontSize: 14, letterSpacing: '0.1em', cursor: submitting ? 'not-allowed' : 'pointer',
          }}
        >
          {submitting ? 'SUBMITTING…' : 'SUBMIT FOR REVIEW →'}
        </button>
        <button
          onClick={() => router.back()}
          disabled={submitting}
          style={{ padding: '16px 24px', borderRadius: 14, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', cursor: 'pointer' }}
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

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>{label}</div>
      <div style={{ padding: '24px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>{children}</div>;
}
function Field({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)' }}>{label}</span>
        {note && <span style={{ fontFamily: 'var(--font-barlow)', fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{note}</span>}
      </div>
      {children}
    </div>
  );
}
function Input({ value, onChange, placeholder, type = 'text', maxLength, list }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; maxLength?: number; list?: string }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} list={list} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontFamily: 'var(--font-barlow)', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' }} />;
}
function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return <select value={value} onChange={e => onChange(e.target.value)} style={{ background: 'rgba(20,20,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontFamily: 'var(--font-barlow)', fontSize: 13, outline: 'none', width: '100%', cursor: 'pointer' }}>{children}</select>;
}
