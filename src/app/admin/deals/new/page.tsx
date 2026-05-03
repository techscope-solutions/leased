import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminDealForm from '../AdminDealForm';

export default async function AdminNewDealPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return <AdminDealForm userId={user.id} />;
}
