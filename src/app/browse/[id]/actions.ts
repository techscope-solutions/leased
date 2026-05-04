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
    // unique violation = already submitted
    if (error.code === '23505') return { ok: false, error: 'You have already sent an inquiry for this deal.' };
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
