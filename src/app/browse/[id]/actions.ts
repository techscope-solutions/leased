'use server';

import { createClient } from '@/lib/supabase/server';

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

    // Log unexpected errors to admin panel instead of leaking details to user
    await supabase.from('errors').insert({
      user_id:  user.id,
      message:  error.message,
      page:     `/browse/${payload.dealId}`,
      metadata: { code: error.code, action: 'submitInquiry' },
    });

    return { ok: false, error: 'Something went wrong. Our team has been notified — please try again shortly.' };
  }

  return { ok: true };
}
