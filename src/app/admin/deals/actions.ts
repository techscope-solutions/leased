'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function approveDeal(formData: FormData) {
  const dealId = formData.get('dealId') as string;
  const tier = formData.get('tier') as string;
  const featured = formData.get('featured') === 'true';
  const expiresDays = parseInt((formData.get('expiresDays') as string) || '7');

  const supabase = createAdminClient();
  await supabase
    .from('deals')
    .update({
      status: 'live',
      tier,
      featured,
      expires_at: new Date(Date.now() + expiresDays * 24 * 3600 * 1000).toISOString(),
    })
    .eq('id', dealId);

  revalidatePath('/admin/deals');
  revalidatePath('/browse');
}

export async function rejectDeal(formData: FormData) {
  const dealId = formData.get('dealId') as string;
  const reason = (formData.get('reason') as string)?.trim() || 'Does not meet listing standards.';

  const supabase = createAdminClient();
  await supabase
    .from('deals')
    .update({ status: 'rejected', rejection_reason: reason })
    .eq('id', dealId);

  revalidatePath('/admin/deals');
}

export async function deleteDeal(formData: FormData) {
  const dealId = formData.get('dealId') as string;
  const supabase = createAdminClient();
  await supabase.from('deals').delete().eq('id', dealId);
  revalidatePath('/admin/deals');
  revalidatePath('/browse');
}

export async function updateDeal(formData: FormData) {
  const dealId = formData.get('dealId') as string;

  const supabase = createAdminClient();
  await supabase
    .from('deals')
    .update({
      make: (formData.get('make') as string).trim().toUpperCase(),
      model: (formData.get('model') as string).trim().toUpperCase(),
      trim: (formData.get('trim') as string).trim().toUpperCase(),
      year: parseInt(formData.get('year') as string),
      drive: formData.get('drive') as string,
      car_type: formData.get('car_type') as string,
      category: formData.get('category') as string,
      color: (formData.get('color') as string) || null,
      deal_type: formData.get('deal_type') as string,
      monthly: parseInt(formData.get('monthly') as string),
      due_at_signing: parseInt(formData.get('due_at_signing') as string),
      term: parseInt(formData.get('term') as string),
      miles_per_year: parseInt(formData.get('miles_per_year') as string),
      msrp: parseInt(formData.get('msrp') as string),
      zero_deal: formData.get('zero_deal') === 'true',
      state: (formData.get('state') as string).trim().toUpperCase(),
      city: (formData.get('city') as string).trim(),
      slots_left: formData.get('slots_left') ? parseInt(formData.get('slots_left') as string) : null,
      status: formData.get('status') as string,
      tier: formData.get('tier') as string,
      featured: formData.get('featured') === 'true',
      expires_at: new Date(Date.now() + parseInt((formData.get('expires_days') as string) || '7') * 24 * 3600 * 1000).toISOString(),
      rejection_reason: (formData.get('rejection_reason') as string) || null,
      images: JSON.parse((formData.get('images') as string) || '[]'),
    })
    .eq('id', dealId);

  revalidatePath('/admin/deals');
  revalidatePath('/browse');
}

export async function createDeal(formData: FormData) {
  const supabase = createAdminClient();

  const category = formData.get('category') as string;
  const ACCENT: Record<string, string> = {
    Daily: '#111827', Luxury: '#0a0f1e', Supercar: '#161616',
  };
  const accent = ACCENT[category] ?? '#111827';
  const expiresDays = parseInt((formData.get('expires_days') as string) || '7');

  const { error } = await supabase.from('deals').insert({
    seller_id: formData.get('seller_id') as string,
    status: formData.get('status') as string,
    make: (formData.get('make') as string).trim().toUpperCase(),
    model: (formData.get('model') as string).trim().toUpperCase(),
    trim: (formData.get('trim') as string).trim().toUpperCase(),
    year: parseInt(formData.get('year') as string),
    drive: formData.get('drive') as string,
    car_type: formData.get('car_type') as string,
    category,
    color: (formData.get('color') as string) || null,
    deal_type: formData.get('deal_type') as string,
    monthly: parseInt(formData.get('monthly') as string),
    due_at_signing: parseInt(formData.get('due_at_signing') as string),
    term: parseInt(formData.get('term') as string),
    miles_per_year: parseInt(formData.get('miles_per_year') as string),
    msrp: parseInt(formData.get('msrp') as string),
    zero_deal: formData.get('zero_deal') === 'true',
    state: (formData.get('state') as string).trim().toUpperCase(),
    city: (formData.get('city') as string).trim(),
    slots_left: formData.get('slots_left') ? parseInt(formData.get('slots_left') as string) : null,
    tier: formData.get('tier') as string,
    featured: formData.get('featured') === 'true',
    expires_at: new Date(Date.now() + expiresDays * 24 * 3600 * 1000).toISOString(),
    images: JSON.parse((formData.get('images') as string) || '[]'),
    accent,
    stripe: `linear-gradient(135deg, ${accent} 0%, ${accent}ee 100%)`,
  });

  if (error) throw new Error(error.message);

  revalidatePath('/admin/deals');
  revalidatePath('/browse');
}
