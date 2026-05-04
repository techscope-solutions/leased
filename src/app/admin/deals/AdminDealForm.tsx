'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DbDeal } from '@/lib/deals';
import { updateDeal } from './actions';
import { guessCarSpecs, POPULAR_MAKES } from '@/lib/carHeuristics';

const ACCENT: Record<string, string> = {
  Daily: '#111827', Luxury: '#0a0f1e', Supercar: '#161616',
};

const A = 'oklch(0.55 0.22 18)';
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const SERIF = '"Instrument Serif", Georgia, serif';
const INK = '#0a0a0a';
const MUTED = 'rgba(10,10,10,0.4)';

type Props = { userId: string; deal?: DbDeal };

export default function AdminDealForm({ userId, deal }: Props) {
  const router = useRouter();
  const isEdit = !!deal;

  const [make, setMake] = useState(deal?.make ?? '');
  const [model, setModel] = useState(deal?.model ?? '');
  const [trim, setTrim] = useState(deal?.trim ?? '');
  const [year, setYear] = useState(String(deal?.year ?? new Date().getFullYear()));
  const [drive, setDrive] = useState(deal?.drive ?? 'AWD');
  const [carType, setCarType] = useState(deal?.car_type ?? 'Sedan');
  const [category, setCategory] = useState(deal?.category ?? 'Daily');
  const [color, setColor] = useState(deal?.color ?? '');
  const [dealType, setDealType] = useState(deal?.deal_type ?? 'LEASE');
  const [monthly, setMonthly] = useState(String(deal?.monthly ?? ''));
  const [das, setDas] = useState(String(deal?.due_at_signing ?? '0'));
  const [term, setTerm] = useState(String(deal?.term ?? '36'));
  const [mpy, setMpy] = useState(String(deal?.miles_per_year ?? '10000'));
  const [msrp, setMsrp] = useState(String(deal?.msrp ?? ''));
  const [zeroDeal, setZeroDeal] = useState(deal?.zero_deal ?? false);
  const [state, setState] = useState(deal?.state ?? '');
  const [city, setCity] = useState(deal?.city ?? '');
  const [slots, setSlots] = useState(deal?.slots_left != null ? String(deal.slots_left) : '');
  const [status, setStatus] = useState<'live' | 'pending' | 'rejected'>(deal?.status ?? 'live');
  const [tier, setTier] = useState(deal?.tier ?? 'VERIFIED');
  const [featured, setFeatured] = useState(deal?.featured ?? false);
  const [expiresDays, setExpiresDays] = useState('7');
  const [rejectionReason, setRejectionReason] = useState(deal?.rejection_reason ?? '');

  const [newImages, setNewImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(deal?.images ?? []);

  const [models, setModels] = useState<string[]>([]);
  const [specsFilled, setSpecsFilled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const urls = newImages.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach(u => URL.revokeObjectURL(u));
  }, [newImages]);

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
    if (e.target.files) setNewImages(prev => [...prev, ...Array.from(e.target.files!)].slice(0, 8));
  };

  const removeNewImage = (i: number) => setNewImages(prev => prev.filter((_, j) => j !== i));
  const removeExistingImage = (url: string) => setExistingImages(prev => prev.filter(u => u !== url));

  const handleSubmit = async () => {
    setError('');
    if (!make || !model || !monthly || !msrp || !state || !city) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    const supabase = createClient();

    const imageUrls: string[] = [...existingImages];
    for (const file of newImages) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${userId}/${Date.now()}-${safeName}`;
      const { error: upErr } = await supabase.storage.from('deal-images').upload(path, file);
      if (upErr) { setError(`Image upload failed: ${upErr.message}`); setSubmitting(false); return; }
      const { data: { publicUrl } } = supabase.storage.from('deal-images').getPublicUrl(path);
      imageUrls.push(publicUrl);
    }

    const accent = ACCENT[category] ?? '#111827';
    const expiresAt = new Date(Date.now() + parseInt(expiresDays) * 24 * 3600 * 1000).toISOString();

    if (isEdit && deal) {
      const fd = new FormData();
      fd.append('dealId', deal.id);
      fd.append('make', make); fd.append('model', model); fd.append('trim', trim);
      fd.append('year', year); fd.append('drive', drive); fd.append('car_type', carType);
      fd.append('category', category); fd.append('color', color); fd.append('deal_type', dealType);
      fd.append('monthly', monthly); fd.append('due_at_signing', das); fd.append('term', term);
      fd.append('miles_per_year', mpy); fd.append('msrp', msrp);
      fd.append('zero_deal', String(zeroDeal)); fd.append('state', state); fd.append('city', city);
      fd.append('slots_left', slots); fd.append('status', status); fd.append('tier', tier);
      fd.append('featured', String(featured)); fd.append('expires_days', expiresDays);
      fd.append('rejection_reason', rejectionReason);
      fd.append('images', JSON.stringify(imageUrls));
      await updateDeal(fd);
      router.push('/admin/deals');
    } else {
      const { error: insertErr } = await supabase.from('deals').insert({
        seller_id: userId, status,
        make: make.trim().toUpperCase(), model: model.trim().toUpperCase(), trim: trim.trim().toUpperCase(),
        year: parseInt(year), drive, car_type: carType, category,
        color: color || null, deal_type: dealType,
        monthly: parseInt(monthly), due_at_signing: parseInt(das),
        term: parseInt(term), miles_per_year: parseInt(mpy), msrp: parseInt(msrp),
        zero_deal: zeroDeal, state: state.trim().toUpperCase(), city: city.trim(),
        slots_left: slots ? parseInt(slots) : null,
        tier, featured, expires_at: expiresAt, images: imageUrls,
        accent, stripe: `linear-gradient(135deg, ${accent} 0%, ${accent}ee 100%)`,
      });
      if (insertErr) { setError(insertErr.message); setSubmitting(false); return; }
      router.push('/admin/deals');
    }
  };

  return (
    <div style={{ padding: '32px 40px 100px', maxWidth: 800, fontFamily: SF, color: INK }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: A, display: 'inline-block' }} />
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED }}>Moderator</span>
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(32px, 4vw, 48px)', margin: 0, lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400 }}>
          {isEdit ? 'Edit ' : 'New '}<em style={{ color: A }}>deal.</em>
        </h1>
      </div>

      {/* Moderation */}
      <Section label="Moderation">
        <Row>
          <Field label="Status">
            <Sel value={status} onChange={v => setStatus(v as 'live' | 'pending' | 'rejected')}>
              <option value="live">Live</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </Sel>
          </Field>
          <Field label="Tier">
            <Sel value={tier} onChange={setTier}>
              <option value="VERIFIED">Verified</option>
              <option value="PLATINUM">Platinum</option>
              <option value="GOLD">Gold</option>
            </Sel>
          </Field>
          <Field label="Expires in">
            <Sel value={expiresDays} onChange={setExpiresDays}>
              <option value="1">1 day</option>
              <option value="3">3 days</option>
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
            </Sel>
          </Field>
        </Row>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} style={{ width: 16, height: 16, accentColor: A }} />
          <span style={{ fontFamily: SF, fontSize: 14, color: INK }}>Mark as featured</span>
        </label>
        {status === 'rejected' && (
          <Field label="Rejection reason">
            <Inp value={rejectionReason} onChange={setRejectionReason} placeholder="Reason shown to seller…" />
          </Field>
        )}
      </Section>

      {/* Vehicle */}
      <Section label="Vehicle">
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr auto', gap: 10, alignItems: 'flex-end' }}>
          <Field label="Year">
            <Sel value={year} onChange={setYear}>
              {[2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020].map(y => <option key={y}>{y}</option>)}
            </Sel>
          </Field>
          <Field label="Make *">
            <Inp value={make} onChange={setMake} placeholder="BMW" list="makes-list" />
            <datalist id="makes-list">{POPULAR_MAKES.map(m => <option key={m} value={m} />)}</datalist>
          </Field>
          <Field label="Model *">
            <Inp value={model} onChange={setModel} placeholder="M3 Competition" list="models-list" />
            <datalist id="models-list">{models.map(m => <option key={m} value={m} />)}</datalist>
          </Field>
          <button
            type="button"
            onClick={handleAutoFill}
            disabled={!make || !model}
            style={{
              padding: '9px 14px', borderRadius: 10, marginBottom: 1,
              background: specsFilled ? 'rgba(34,197,94,0.12)' : (!make || !model) ? 'rgba(10,10,10,0.04)' : 'rgba(10,10,10,0.08)',
              border: `1px solid ${specsFilled ? 'rgba(34,197,94,0.35)' : (!make || !model) ? 'rgba(10,10,10,0.08)' : 'rgba(10,10,10,0.15)'}`,
              color: specsFilled ? 'oklch(0.55 0.16 145)' : (!make || !model) ? MUTED : INK,
              fontFamily: SF, fontWeight: 500, fontSize: 13,
              cursor: (!make || !model) ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}
          >
            {specsFilled ? '✓ Filled' : '⚡ Auto-fill'}
          </button>
        </div>
        <Row>
          <Field label="Trim"><Inp value={trim} onChange={setTrim} placeholder="xDrive" /></Field>
          <Field label="Color" note="optional"><Inp value={color} onChange={setColor} placeholder="Midnight Black" /></Field>
        </Row>
        <Row>
          <Field label="Drivetrain">
            <Sel value={drive} onChange={setDrive}>{['AWD', 'RWD', 'FWD', '4WD'].map(d => <option key={d}>{d}</option>)}</Sel>
          </Field>
          <Field label="Car type">
            <Sel value={carType} onChange={setCarType}>{['Sedan', 'SUV', 'Coupe', 'Truck', 'EV'].map(t => <option key={t}>{t}</option>)}</Sel>
          </Field>
          <Field label="Category">
            <Sel value={category} onChange={setCategory}>{['Daily', 'Luxury', 'Supercar'].map(c => <option key={c}>{c}</option>)}</Sel>
          </Field>
        </Row>
      </Section>

      {/* Deal terms */}
      <Section label="Deal terms">
        <Row>
          <Field label="Deal type"><Sel value={dealType} onChange={setDealType}><option value="LEASE">Lease</option><option value="FINANCE">Finance</option></Sel></Field>
          <Field label="Monthly ($) *"><Inp type="number" value={monthly} onChange={setMonthly} placeholder="899" /></Field>
          <Field label="Due at signing ($)"><Inp type="number" value={das} onChange={setDas} placeholder="0" /></Field>
        </Row>
        <Row>
          <Field label="Term (mo)"><Sel value={term} onChange={setTerm}>{['24', '36', '39', '48'].map(t => <option key={t}>{t}</option>)}</Sel></Field>
          <Field label="Miles / year"><Sel value={mpy} onChange={setMpy}>{['7500', '10000', '12000', '15000'].map(m => <option key={m}>{m}</option>)}</Sel></Field>
          <Field label="MSRP ($) *"><Inp type="number" value={msrp} onChange={setMsrp} placeholder="92800" /></Field>
        </Row>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', paddingTop: 4 }}>
          <input type="checkbox" checked={zeroDeal} onChange={e => setZeroDeal(e.target.checked)} style={{ width: 16, height: 16, accentColor: A }} />
          <span style={{ fontFamily: SF, fontSize: 14, color: INK }}>Zero down deal</span>
        </label>
      </Section>

      {/* Location */}
      <Section label="Location & inventory">
        <Row>
          <Field label="State *" note="2-letter"><Inp value={state} onChange={setState} placeholder="CA" maxLength={2} /></Field>
          <Field label="City *"><Inp value={city} onChange={setCity} placeholder="Los Angeles" /></Field>
          <Field label="Slots" note="blank = ∞"><Inp type="number" value={slots} onChange={setSlots} placeholder="∞" /></Field>
        </Row>
      </Section>

      {/* Images */}
      <Section label="Images">
        {existingImages.length > 0 && (
          <div>
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>Existing</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
              {existingImages.map(url => (
                <div key={url} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(10,10,10,0.1)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => removeExistingImage(url)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(10,10,10,0.65)', border: 'none', color: '#fff', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {previews.length > 0 && (
          <div>
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>New</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
              {previews.map((src, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden', border: `1px solid ${A}40` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => removeNewImage(i)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(10,10,10,0.65)', border: 'none', color: '#fff', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}
        <label style={{ border: `1px dashed rgba(10,10,10,0.15)`, borderRadius: 12, padding: '16px', background: 'rgba(10,10,10,0.02)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <input type="file" accept="image/*" multiple onChange={handleImages} style={{ display: 'none' }} />
          <span style={{ fontFamily: SF, fontWeight: 500, fontSize: 14, color: MUTED }}>+ Add photos</span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: 'rgba(10,10,10,0.25)' }}>JPG · PNG · WEBP</span>
        </label>
      </Section>

      {error && (
        <div style={{ padding: '12px 16px', background: `${A}10`, border: `1px solid ${A}30`, borderRadius: 10, marginBottom: 20, fontFamily: SF, fontSize: 13, color: A }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            flex: 1, padding: '15px', borderRadius: 999,
            background: submitting ? 'rgba(10,10,10,0.35)' : INK,
            border: 'none', color: 'white',
            fontFamily: SF, fontWeight: 500, fontSize: 15,
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.15s',
          }}
        >
          {submitting ? 'Saving…' : isEdit ? 'Save changes →' : 'Create deal →'}
        </button>
        <button
          onClick={() => router.push('/admin/deals')}
          disabled={submitting}
          style={{
            padding: '15px 24px', borderRadius: 999,
            background: 'transparent', border: '1px solid rgba(10,10,10,0.12)',
            color: MUTED, fontFamily: SF, fontWeight: 500, fontSize: 15, cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  const MONO = '"JetBrains Mono", ui-monospace, monospace';
  const MUTED = 'rgba(10,10,10,0.4)';
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED, marginBottom: 10 }}>{label}</div>
      <div style={{ padding: '20px', background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.7)', boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 4px 16px rgba(10,10,10,0.04)', borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>{children}</div>;
}

function Field({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif';
  const MUTED = 'rgba(10,10,10,0.4)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontFamily: SF, fontWeight: 500, fontSize: 11, color: MUTED }}>{label}</span>
        {note && <span style={{ fontFamily: SF, fontSize: 10, color: 'rgba(10,10,10,0.25)' }}>{note}</span>}
      </div>
      {children}
    </div>
  );
}

function Inp({ value, onChange, placeholder, type = 'text', maxLength, list }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; maxLength?: number; list?: string }) {
  const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif';
  return (
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} maxLength={maxLength} list={list}
      className="lz-input"
      style={{
        background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(10,10,10,0.12)',
        borderRadius: 10, padding: '9px 11px',
        color: '#0a0a0a', fontFamily: SF, fontSize: 13,
        width: '100%', boxSizing: 'border-box',
      }}
    />
  );
}

function Sel({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif';
  return (
    <select
      value={value} onChange={e => onChange(e.target.value)}
      style={{
        background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(10,10,10,0.12)',
        borderRadius: 10, padding: '9px 11px',
        color: '#0a0a0a', fontFamily: SF, fontSize: 13,
        width: '100%', cursor: 'pointer', outline: 'none',
      }}
    >
      {children}
    </select>
  );
}
