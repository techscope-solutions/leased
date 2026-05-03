import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { getDealById } from '@/lib/deals';
import AdminDealForm from '../../AdminDealForm';

type Props = { params: Promise<{ id: string }> };

export default async function AdminEditDealPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const deal = await getDealById(id);
  if (!deal) notFound();

  return <AdminDealForm userId={user.id} deal={deal} />;
}
