import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect, notFound } from 'next/navigation';
import { getDealById } from '@/lib/deals';
import AdminDealForm from '../../AdminDealForm';

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditDealPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const admin = createAdminClient();
  const [deal, { data: sellers }] = await Promise.all([
    getDealById(id),
    admin.from('profiles').select('id, full_name, email').order('full_name', { ascending: true }),
  ]);

  if (!deal) notFound();

  return <AdminDealForm userId={user.id} deal={deal} sellers={sellers ?? []} />;
}
