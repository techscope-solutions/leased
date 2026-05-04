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

  return (
    <SellerDashboardClient
      profile={{ full_name: profile.full_name ?? null, email: user.email ?? null, role: profile.role }}
      deals={deals}
    />
  );
}
