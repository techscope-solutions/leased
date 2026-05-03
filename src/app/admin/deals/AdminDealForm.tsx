'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DbDeal } from '@/lib/deals';
import { updateDeal } from './actions';

const ACCENT: Record<string, string> = {
  Daily: '#111827', Luxury: '#0a0f1e', Supercar: '#161616',
};

type Props = {
  userId: string;
  deal?: DbDeal; // present = edit mode, absent = create mode
};

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
  const [status, setStatus] = useState(deal?.status ?? 'live');
  const [tier, setTier] = useState(deal?.tier ?? 'VERIFIED');
  const [featured, setFeatured] = useState(deal?.featured ?? false);
  const [expiresDays, setExpiresDays] = useState('7');
  const [rejectionReason, setRejectionReason] = useState(deal?.rejection_reason ?? '');
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files).slice(0, 5));
  };

  const handleSubmit = async () => {
    setError('');
    if (!make || !model || !monthly || !msrp || !state || !city) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    const supabase = createClient();

    const imageUrls: string[] = deal?.images ?? [];
    for (const file of images) {
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
      await updateDeal(fd);
      router.push('/admin/deals');
    } else {
      const { error: insertErr } = await supabase.from('deals').insert({
        seller_id: userId,
        status,
        make: make.trim().toUpperCase(),
        model: model.trim().toUpperCase(),
        trim: trim.trim().toUpperCase(),
        year: parseInt(year),
        drive, car_type: carType, category,
        color: color || null,
        deal_type: dealType,
        monthly: parseInt(monthly),
        due_at_signing: parseInt(das),
        term: parseInt(term),
        miles_per_year: parseInt(mpy),
        msrp: parseInt(msrp),
        zero_deal: zeroDeal,
        state: state.trim().toUpperCase(),
        city: city.trim(),
        slots_left: slots ? parseInt(slots) : null,
        tier, featured,
        expires_at: expiresAt,
        images: imageUrls,
        accent,
        stripe: `linear-gradient(135deg, ${accent} 0%, ${accent}ee 100%)`,
      });
      if (insertErr) { setError(insertErr.message); setSubmitting(false); return; }
      router.push('/admin/deals');
    }
  };

  return (
    <div style={{ padding: '40px 32px 100px', maxWidth: 800 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF2800' }} />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>MODERATOR</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(24px, 4vw, 40px)', letterSpacing: '-0.025em', lineHeight: 0.92 }}>
          <span style={{ color: '#fff' }}>{isEdit ? 'EDIT ' : 'NEW '}</span>
          <span style={{ color: '#FF2800' }}>DEAL.</span>
        </div>
      </div>

      {/* Mod controls */}
      <Section label="MODERATION">
        <Row>
          <Field label="STATUS">
            <Sel value={status} onChange={v => setStatus(v as typeof status)}>
              <option value="live">LIVE</option>
              <option value="pending">PENDING</option>
              <option value="rejected">REJECTED</option>
            </Sel>
          </Field>
          <Field label="TIER">
            <Sel value={tier} onChange={setTier}>
              <option value="VERIFIED">VERIFIED</option>
              <option value="PLATINUM">PLATINUM</option>
              <option value="GOLD">GOLD</option>
            </Sel>
          </Field>
          <Field label="EXPIRES IN">
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
          <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#FF2800' }} />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)' }}>MARK AS FEATURED</span>
        </label>
        {status === 'rejected' && (
          <Field label="REJECTION REASON">
            <Inp value={rejectionReason} onChange={setRejectionReason} placeholder="Reason shown to seller…" />
          </Field>
        )}
      </Section>

      {/* Vehicle */}
      <Section label="VEHICLE">
        <Row>
          <Field label="MAKE *"><Inp value={make} onChange={setMake} placeholder="BMW" /></Field>
          <Field label="MODEL *"><Inp value={model} onChange={setModel} placeholder="M3 COMPETITION" /></Field>
        </Row>
        <Row>
          <Field label="TRIM"><Inp value={trim} onChange={setTrim} placeholder="XDRIVE" /></Field>
          <Field label="YEAR">
            <Sel value={year} onChange={setYear}>
              {[2026,2025,2024,2023,2022,2021,2020].map(y => <option key={y}>{y}</option>)}
            </Sel>
          </Field>
        </Row>
        <Row>
          <Field label="DRIVETRAIN"><Sel value={drive} onChange={setDrive}>{['AWD','RWD','FWD','4WD'].map(d=><option key={d}>{d}</option>)}</Sel></Field>
          <Field label="CAR TYPE"><Sel value={carType} onChange={setCarType}>{['Sedan','SUV','Coupe','Truck','EV'].map(t=><option key={t}>{t}</option>)}</Sel></Field>
          <Field label="CATEGORY"><Sel value={category} onChange={setCategory}>{['Daily','Luxury','Supercar'].map(c=><option key={c}>{c}</option>)}</Sel></Field>
        </Row>
        <Row><Field label="COLOR" note="optional"><Inp value={color} onChange={setColor} placeholder="Midnight Black" /></Field></Row>
      </Section>

      {/* Deal Terms */}
      <Section label="DEAL TERMS">
        <Row>
          <Field label="DEAL TYPE"><Sel value={dealType} onChange={setDealType}><option value="LEASE">LEASE</option><option value="FINANCE">FINANCE</option></Sel></Field>
          <Field label="MONTHLY ($) *"><Inp type="number" value={monthly} onChange={setMonthly} placeholder="899" /></Field>
          <Field label="DUE AT SIGNING ($)"><Inp type="number" value={das} onChange={setDas} placeholder="0" /></Field>
        </Row>
        <Row>
          <Field label="TERM (MO)"><Sel value={term} onChange={setTerm}>{['24','36','39','48'].map(t=><option key={t}>{t}</option>)}</Sel></Field>
          <Field label="MILES / YEAR"><Sel value={mpy} onChange={setMpy}>{['7500','10000','12000','15000'].map(m=><option key={m}>{m}</option>)}</Sel></Field>
          <Field label="MSRP ($) *"><Inp type="number" value={msrp} onChange={setMsrp} placeholder="92800" /></Field>
        </Row>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', paddingTop: 4 }}>
          <input type="checkbox" checked={zeroDeal} onChange={e => setZeroDeal(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#FF2800' }} />
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)' }}>ZERO DOWN DEAL</span>
        </label>
      </Section>

      {/* Location */}
      <Section label="LOCATION & INVENTORY">
        <Row>
          <Field label="STATE *" note="2-letter"><Inp value={state} onChange={setState} placeholder="CA" maxLength={2} /></Field>
          <Field label="CITY *"><Inp value={city} onChange={setCity} placeholder="Los Angeles" /></Field>
          <Field label="SLOTS" note="blank=∞"><Inp type="number" value={slots} onChange={setSlots} placeholder="∞" /></Field>
        </Row>
      </Section>

      {/* Images */}
      <Section label={isEdit ? 'ADD MORE IMAGES' : 'IMAGES'}>
        <div style={{ border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 14, padding: '20px', background: 'rgba(255,255,255,0.02)', position: 'relative', cursor: 'pointer' }}>
          <input type="file" accept="image/*" multiple onChange={handleImages} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
          {images.length === 0 ? (
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)' }}>
              {isEdit ? 'CLICK TO ADD IMAGES' : 'CLICK OR DROP FILES'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {images.map((f, i) => (
                <div key={i} style={{ padding: '5px 10px', background: 'rgba(255,40,0,0.1)', border: '1px solid rgba(255,40,0,0.3)', borderRadius: 8, fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{f.name}</div>
              ))}
            </div>
          )}
        </div>
        {isEdit && deal && deal.images.length > 0 && (
          <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>{deal.images.length} existing image{deal.images.length > 1 ? 's' : ''} kept</div>
        )}
      </Section>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(255,40,0,0.1)', border: '1px solid rgba(255,40,0,0.3)', borderRadius: 10, marginBottom: 20, fontFamily: 'var(--font-barlow)', fontSize: 12, color: '#ff6b6b' }}>{error}</div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={handleSubmit} disabled={submitting} style={{ flex: 1, padding: '16px', borderRadius: 14, background: submitting ? 'rgba(255,40,0,0.4)' : 'rgba(255,40,0,0.9)', border: '1px solid rgba(255,80,40,0.4)', boxShadow: submitting ? 'none' : '0 4px 28px rgba(255,40,0,0.3)', color: '#fff', fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 14, letterSpacing: '0.1em', cursor: submitting ? 'not-allowed' : 'pointer' }}>
          {submitting ? 'SAVING…' : isEdit ? 'SAVE CHANGES →' : 'CREATE DEAL →'}
        </button>
        <button onClick={() => router.push('/admin/deals')} disabled={submitting} style={{ padding: '16px 24px', borderRadius: 14, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', cursor: 'pointer' }}>
          CANCEL
        </button>
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 10, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>{label}</div>
      <div style={{ padding: '20px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
    </div>
  );
}
function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12 }}>{children}</div>;
}
function Field({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 9, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)' }}>{label}</span>
        {note && <span style={{ fontFamily: 'var(--font-barlow)', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{note}</span>}
      </div>
      {children}
    </div>
  );
}
function Inp({ value, onChange, placeholder, type = 'text', maxLength }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string; maxLength?: number }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontFamily: 'var(--font-barlow)', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' }} />;
}
function Sel({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return <select value={value} onChange={e => onChange(e.target.value)} style={{ background: 'rgba(20,20,20,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontFamily: 'var(--font-barlow)', fontSize: 13, outline: 'none', width: '100%', cursor: 'pointer' }}>{children}</select>;
}
