import { createClient } from '@/lib/supabase/server';

type UserExportRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  onboarded: boolean;
  created_at: string;
  last_seen: string | null;
};

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'moderator') return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { data: users } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, onboarded, created_at, last_seen')
    .order('created_at', { ascending: false });

  const rows = (users as UserExportRow[]) ?? [];
  const csv = [
    'id,email,full_name,role,onboarded,created_at,last_seen',
    ...rows.map(u =>
      [u.id, u.email ?? '', u.full_name ?? '', u.role, u.onboarded, u.created_at, u.last_seen ?? '']
        .map(v => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    ),
  ].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="users-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
