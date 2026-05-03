import { createClient } from '@/lib/supabase/server';
import { generateBlogPost } from '@/app/api/cron/generate-blog/route';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'moderator') return Response.json({ error: 'Forbidden' }, { status: 403 });

  const result = await generateBlogPost();
  return Response.json(result, { status: result.ok ? 200 : 500 });
}
