import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import AdminDealForm from '../AdminDealForm';

export default async function AdminNewDealPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const admin = createAdminClient();
  const { data: sellers } = await admin
    .from('profiles')
    .select('id, full_name, email')
    .order('full_name', { ascending: true });

  return <AdminDealForm userId={user.id} sellers={sellers ?? []} />;
}
