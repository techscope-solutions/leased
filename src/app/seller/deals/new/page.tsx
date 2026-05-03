import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Profile } from '@/lib/supabase/types';
import DealForm from './DealForm';

export default async function NewDealPage() {
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
    redirect('/seller/dashboard');
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
      <DealForm userId={user.id} />
    </div>
  );
}
