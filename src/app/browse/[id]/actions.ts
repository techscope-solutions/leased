'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendInquiryNotification } from '@/lib/email';

export type InquiryPayload = {
  dealId: string;
  sellerId: string;
  preferredTerm: number;
  preferredDown: number;
  estimatedIncome: number;
  estimatedCredit: string;
  message: string;
};

export type InquiryResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitInquiry(payload: InquiryPayload): Promise<InquiryResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: 'You must be signed in to express interest.' };
  if (user.id === payload.sellerId) return { ok: false, error: 'You cannot inquire on your own listing.' };

  const { error } = await supabase.from('inquiries').insert({
    deal_id:           payload.dealId,
    buyer_id:          user.id,
    seller_id:         payload.sellerId,
    preferred_term:    payload.preferredTerm,
    preferred_down:    payload.preferredDown,
    estimated_income:  payload.estimatedIncome,
    estimated_credit:  payload.estimatedCredit,
    message:           payload.message || null,
    status:            'sent',
  });

  if (error) {
    if (error.code === '23505') return { ok: false, error: 'You have already sent an inquiry for this deal.' };

    await supabase.from('errors').insert({
      user_id:  user.id,
      message:  error.message,
      page:     `/browse/${payload.dealId}`,
      metadata: { code: error.code, action: 'submitInquiry' },
    });

    return { ok: false, error: 'Something went wrong. Our team has been notified — please try again shortly.' };
  }

  // Fire email notification to seller (non-blocking — don't fail the inquiry if email errors)
  try {
    // Use admin client so RLS on profiles doesn't prevent reading the seller's row
    const admin = createAdminClient();
    const [{ data: sellerProfile }, { data: deal }] = await Promise.all([
      admin.from('profiles').select('email, full_name').eq('id', payload.sellerId).single(),
      admin.from('deals').select('year, make, model').eq('id', payload.dealId).single(),
    ]);

    if (sellerProfile?.email && deal) {
      await sendInquiryNotification({
        sellerEmail:     sellerProfile.email,
        sellerName:      sellerProfile.full_name ?? 'there',
        buyerEmail:      user.email ?? 'A buyer',
        dealTitle:       `${deal.year} ${deal.make} ${deal.model}`,
        dealId:          payload.dealId,
        preferredTerm:   payload.preferredTerm,
        preferredDown:   payload.preferredDown,
        estimatedIncome: payload.estimatedIncome,
        estimatedCredit: payload.estimatedCredit,
        message:         payload.message,
      });
    } else {
      // Log so admins can see why no email was sent
      await supabase.from('errors').insert({
        user_id:  user.id,
        message:  `Inquiry email skipped: sellerProfile.email=${sellerProfile?.email ?? 'null'}, deal=${deal ? 'found' : 'null'}`,
        page:     `/browse/${payload.dealId}`,
        metadata: { action: 'sendInquiryNotification', sellerId: payload.sellerId },
      });
    }
  } catch (emailErr) {
    // Log email failures to admin errors panel without surfacing to user
    try {
      await supabase.from('errors').insert({
        user_id:  user.id,
        message:  emailErr instanceof Error ? emailErr.message : 'Unknown email error',
        page:     `/browse/${payload.dealId}`,
        metadata: { action: 'sendInquiryNotification', sellerId: payload.sellerId },
      });
    } catch { /* ignore secondary error */ }
  }

  return { ok: true };
}
