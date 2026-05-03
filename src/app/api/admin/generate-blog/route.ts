import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'moderator') return Response.json({ error: 'Forbidden' }, { status: 403 });

  const origin = new URL(request.url).origin;
  const res = await fetch(`${origin}/api/cron/generate-blog`, {
    method: 'POST',
    headers: { 'x-cron-secret': process.env.CRON_SECRET ?? '' },
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
