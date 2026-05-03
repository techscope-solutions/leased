'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function approveDeal(formData: FormData) {
  const dealId = formData.get('dealId') as string;
  const tier = formData.get('tier') as string;
  const featured = formData.get('featured') === 'true';
  const expiresDays = parseInt((formData.get('expiresDays') as string) || '7');

  const supabase = await createClient();
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

  const supabase = await createClient();
  await supabase
    .from('deals')
    .update({ status: 'rejected', rejection_reason: reason })
    .eq('id', dealId);

  revalidatePath('/admin/deals');
}
