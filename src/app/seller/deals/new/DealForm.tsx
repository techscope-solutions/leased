'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { guessCarSpecs, POPULAR_MAKES } from '@/lib/carHeuristics';

const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif';
const SERIF = '"Instrument Serif", Georgia, serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const INK = '#0a0a0a';
const MUTED = 'rgba(10,10,10,0.45)';
const MUTED2 = 'rgba(10,10,10,0.25)';
const A = 'oklch(0.55 0.22 18)';

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
  const [stateCode, setStateCode] = useState('');
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
    if (!make || !model || !monthly || !msrp || !stateCode || !city) {
      setError('Please fill in all required fields: make, model, monthly payment, MSRP, city, and state.');
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
      zero_deal: zeroDeal, state: stateCode.trim().toUpperCase(), city: city.trim(),
      slots_left: slots ? parseInt(slots) : null, expires_at: expiresAt,
      images: imageUrls, accent,
      stripe: `linear-gradient(135deg, ${accent} 0%, ${accent}ee 100%)`,
    });

    if (insertErr) { setError(insertErr.message); setSubmitting(false); return; }
    router.push('/seller/dashboard?posted=1');
  };

  return (
    <div style={{ background: '#f7f5f2', minHeight: '100vh', fontFamily: SF, WebkitFontSmoothing: 'antialiased', color: INK, position: 'relative', zIndex: 2 }}>
      {/* Top nav bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(247,245,242,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(10,10,10,0.07)', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/seller/dashboard" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, color: MUTED, fontSize: 13 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
          Dashboard
        </Link>
        <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 18, letterSpacing: '-0.02em' }}>Leased</span>
        <div style={{ width: 80 }} />
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 16px 120px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', color: MUTED2, textTransform: 'uppercase', marginBottom: 8 }}>Seller portal</div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 400, margin: '0 0 8px', letterSpacing: '-0.03em', lineHeight: 1 }}>
            Post a <em style={{ color: A }}>deal.</em>
          </h1>
          <p style={{ fontSize: 14, color: MUTED, margin: 0, lineHeight: 1.5 }}>
            Your listing will be reviewed by a moderator before going live — usually within a few hours.
          </p>
        </div>

        {/* VEHICLE */}
        <Card label="01 — Vehicle" icon="🚗">
          {/* Year + Make */}
          <div className="lz-form-row-2">
            <Field label="Year">
              <StyledSelect value={year} onChange={setYear}>
                {[2027,2026,2025,2024,2023,2022,2021,2020].map(y => <option key={y} value={y}>{y}</option>)}
              </StyledSelect>
            </Field>
            <Field label="Make" required>
              <StyledInput value={make} onChange={setMake} placeholder="BMW" list="makes-list" />
              <datalist id="makes-list">{POPULAR_MAKES.map(m => <option key={m} value={m} />)}</datalist>
            </Field>
          </div>

          {/* Model + Auto-fill */}
          <div>
            <Field label="Model" required>
              <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
                <div style={{ flex: 1 }}>
                  <StyledInput value={model} onChange={setModel} placeholder="M3 Competition" list="models-list" />
                  <datalist id="models-list">{models.map(m => <option key={m} value={m} />)}</datalist>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  disabled={!make || !model}
                  style={{
                    flexShrink: 0,
                    padding: '0 14px', borderRadius: 10,
                    background: specsFilled ? 'rgba(34,197,94,0.1)' : (!make || !model) ? 'rgba(10,10,10,0.04)' : 'rgba(10,10,10,0.06)',
                    border: `1px solid ${specsFilled ? 'rgba(34,197,94,0.4)' : 'rgba(10,10,10,0.1)'}`,
                    color: specsFilled ? 'oklch(0.55 0.16 145)' : (!make || !model) ? MUTED2 : INK,
                    fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em',
                    cursor: (!make || !model) ? 'not-allowed' : 'pointer',
                    whiteSpace: 'nowrap', transition: 'all 0.2s',
                  }}
                >
                  {specsFilled ? '✓ Done' : '⚡ Auto-fill'}
                </button>
              </div>
            </Field>
            {specsFilled && (
              <div style={{ marginTop: 6, fontSize: 12, color: 'oklch(0.55 0.16 145)', fontFamily: MONO }}>Drivetrain, type, and category filled automatically</div>
            )}
          </div>

          {/* Trim + Color */}
          <div className="lz-form-row-2">
            <Field label="Trim" optional>
              <StyledInput value={trim} onChange={setTrim} placeholder="xDrive40i" />
            </Field>
            <Field label="Color" optional>
              <StyledInput value={color} onChange={setColor} placeholder="Midnight Black" />
            </Field>
          </div>

          {/* Drivetrain + Type + Category */}
          <div className="lz-form-row-3">
            <Field label="Drivetrain">
              <StyledSelect value={drive} onChange={setDrive}>
                {['AWD','RWD','FWD','4WD'].map(d => <option key={d}>{d}</option>)}
              </StyledSelect>
            </Field>
            <Field label="Body type">
              <StyledSelect value={carType} onChange={setCarType}>
                {['Sedan','SUV','Coupe','Truck','EV'].map(t => <option key={t}>{t}</option>)}
              </StyledSelect>
            </Field>
            <Field label="Category">
              <StyledSelect value={category} onChange={setCategory}>
                {['Daily','Luxury','Supercar'].map(c => <option key={c}>{c}</option>)}
              </StyledSelect>
            </Field>
          </div>
        </Card>

        {/* DEAL TERMS */}
        <Card label="02 — Deal terms" icon="💰">
          {/* Deal type */}
          <div style={{ display: 'flex', gap: 8 }}>
            {['LEASE', 'FINANCE'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setDealType(t)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: dealType === t ? INK : 'rgba(10,10,10,0.05)',
                  color: dealType === t ? 'white' : MUTED,
                  fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em',
                  transition: 'all 0.15s',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="lz-form-row-2">
            <Field label="Monthly payment ($)" required>
              <StyledInput type="number" value={monthly} onChange={setMonthly} placeholder="899" />
            </Field>
            <Field label="Due at signing ($)">
              <StyledInput type="number" value={das} onChange={setDas} placeholder="0" />
            </Field>
          </div>

          <div className="lz-form-row-3">
            <Field label="Term">
              <StyledSelect value={term} onChange={setTerm}>
                {['24','36','39','48'].map(t => <option key={t} value={t}>{t} mo</option>)}
              </StyledSelect>
            </Field>
            <Field label="Miles / year">
              <StyledSelect value={mpy} onChange={setMpy}>
                {[['7500','7,500 mi'],['10000','10,000 mi'],['12000','12,000 mi'],['15000','15,000 mi']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </StyledSelect>
            </Field>
            <Field label="MSRP ($)" required>
              <StyledInput type="number" value={msrp} onChange={setMsrp} placeholder="92800" />
            </Field>
          </div>

          {/* Zero down toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '12px 14px', borderRadius: 10, background: zeroDeal ? 'rgba(10,10,10,0.05)' : 'transparent', border: `1px solid ${zeroDeal ? 'rgba(10,10,10,0.12)' : 'transparent'}`, transition: 'all 0.15s' }}>
            <div style={{
              width: 36, height: 20, borderRadius: 999, background: zeroDeal ? INK : 'rgba(10,10,10,0.12)',
              position: 'relative', flexShrink: 0, transition: 'background 0.2s',
            }}>
              <div style={{
                position: 'absolute', top: 2, left: zeroDeal ? 18 : 2, width: 16, height: 16,
                borderRadius: '50%', background: 'white', transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </div>
            <input type="checkbox" checked={zeroDeal} onChange={e => setZeroDeal(e.target.checked)} style={{ display: 'none' }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Zero down deal</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>No money required at signing</div>
            </div>
          </label>
        </Card>

        {/* LOCATION & AVAILABILITY */}
        <Card label="03 — Location & availability" icon="📍">
          <div className="lz-form-row-2">
            <Field label="City" required>
              <StyledInput value={city} onChange={setCity} placeholder="Los Angeles" />
            </Field>
            <Field label="State" required hint="2-letter code">
              <StyledInput value={stateCode} onChange={setStateCode} placeholder="CA" maxLength={2} />
            </Field>
          </div>
          <div className="lz-form-row-2">
            <Field label="Slots available" optional hint="leave blank for unlimited">
              <StyledInput type="number" value={slots} onChange={setSlots} placeholder="∞" />
            </Field>
            <Field label="Deal expires in">
              <StyledSelect value={expiresDays} onChange={setExpiresDays}>
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </StyledSelect>
            </Field>
          </div>
        </Card>

        {/* PHOTOS */}
        <Card label="04 — Photos" icon="📷">
          {previews.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
              {previews.map((src, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(10,10,10,0.1)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SF }}
                  >×</button>
                </div>
              ))}
            </div>
          )}
          <label style={{
            border: '1.5px dashed rgba(10,10,10,0.15)', borderRadius: 14,
            padding: previews.length === 0 ? '40px 20px' : '20px',
            background: 'rgba(10,10,10,0.02)', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            transition: 'border-color 0.15s, background 0.15s',
          }}>
            <input type="file" accept="image/*" multiple onChange={handleImages} style={{ display: 'none' }} />
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(10,10,10,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <span style={{ fontFamily: SF, fontSize: 14, fontWeight: 500, color: INK }}>
              {previews.length === 0 ? 'Upload photos' : 'Add more photos'}
            </span>
            <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED2, letterSpacing: '0.05em' }}>
              Up to 8 images · JPG PNG WEBP
            </span>
          </label>
        </Card>

        {/* Error */}
        {error && (
          <div style={{ padding: '14px 16px', background: `${A}12`, border: `1px solid ${A}30`, borderRadius: 12, marginBottom: 20, fontSize: 13, color: A, lineHeight: 1.4, fontFamily: SF }}>
            {error}
          </div>
        )}

        {/* Submit row */}
        <div style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: '100%', padding: '16px', borderRadius: 14,
              background: submitting ? 'rgba(10,10,10,0.3)' : INK,
              border: 'none',
              color: 'white', fontFamily: SF, fontWeight: 600,
              fontSize: 15, cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {submitting ? (
              <>
                <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Submitting…
              </>
            ) : 'Submit for review →'}
          </button>
          <button
            onClick={() => router.back()}
            disabled={submitting}
            style={{
              width: '100%', padding: '14px', borderRadius: 14,
              background: 'transparent', border: '1px solid rgba(10,10,10,0.12)',
              color: MUTED, fontFamily: SF, fontSize: 14, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>

        <p style={{ marginTop: 16, fontSize: 12, color: MUTED2, textAlign: 'center', fontFamily: MONO, letterSpacing: '0.04em' }}>
          A moderator reviews every submission before it goes live.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .lz-form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .lz-form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        @media (max-width: 480px) {
          .lz-form-row-2 { grid-template-columns: 1fr; }
          .lz-form-row-3 { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}

function Card({ label, icon, children }: { label: string; icon?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20, background: 'white', border: '1px solid rgba(10,10,10,0.08)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 4px rgba(10,10,10,0.04)' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(10,10,10,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', color: MUTED, textTransform: 'uppercase' }}>{label}</span>
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, required, optional, hint, children }: { label: string; required?: boolean; optional?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontFamily: SF, fontSize: 13, fontWeight: 500, color: INK }}>{label}</span>
        {required && <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', color: A, textTransform: 'uppercase' }}>Required</span>}
        {optional && <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', color: MUTED2, textTransform: 'uppercase' }}>Optional</span>}
        {hint && <span style={{ fontSize: 11, color: MUTED2 }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function StyledInput({ value, onChange, placeholder, type = 'text', maxLength, list }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; maxLength?: number; list?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      list={list}
      style={{
        background: '#f9f8f6',
        border: '1px solid rgba(10,10,10,0.12)',
        borderRadius: 10,
        padding: '11px 14px',
        color: INK,
        fontFamily: SF,
        fontSize: 15,
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onFocus={e => { e.target.style.borderColor = 'rgba(10,10,10,0.35)'; e.target.style.boxShadow = '0 0 0 3px rgba(10,10,10,0.06)'; }}
      onBlur={e => { e.target.style.borderColor = 'rgba(10,10,10,0.12)'; e.target.style.boxShadow = 'none'; }}
    />
  );
}

function StyledSelect({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: '#f9f8f6',
        border: '1px solid rgba(10,10,10,0.12)',
        borderRadius: 10,
        padding: '11px 14px',
        color: INK,
        fontFamily: SF,
        fontSize: 15,
        outline: 'none',
        width: '100%',
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 14px center',
        paddingRight: 36,
      }}
    >
      {children}
    </select>
  );
}
