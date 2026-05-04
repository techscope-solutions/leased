import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Profile } from '@/lib/supabase/types';
import { getSellerDeals } from '@/lib/deals';
import SellerDashboardClient from './SellerDashboardClient';

export const dynamic = 'force-dynamic';

export default async function SellerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  const profile = profileData as Profile | null;

  if (!profile || !['seller', 'moderator'].includes(profile.role)) {
    redirect('/onboarding');
  }

  const deals = await getSellerDeals(user.id);

  // Inquiry counts per deal (status='sent' = unread by seller)
  const { data: inquiryRows } = await supabase
    .from('inquiries')
    .select('deal_id, status')
    .eq('seller_id', user.id);

  const inquiryCounts: Record<string, number> = {};
  const newInquiryCounts: Record<string, number> = {};
  for (const row of inquiryRows ?? []) {
    inquiryCounts[row.deal_id] = (inquiryCounts[row.deal_id] ?? 0) + 1;
    if (row.status === 'sent') {
      newInquiryCounts[row.deal_id] = (newInquiryCounts[row.deal_id] ?? 0) + 1;
    }
  }

  return (
    <SellerDashboardClient
      profile={{ full_name: profile.full_name ?? null, email: user.email ?? null, role: profile.role }}
      deals={deals}
      inquiryCounts={inquiryCounts}
      newInquiryCounts={newInquiryCounts}
    />
  );
}
