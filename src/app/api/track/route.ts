import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_type, session_id, deal_id, page, metadata } = body;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('page_events').insert({
      user_id: user?.id ?? null,
      session_id: session_id ?? null,
      event_type,
      page: page ?? request.headers.get('referer') ?? null,
      deal_id: deal_id ?? null,
      metadata: metadata ?? {},
    });

    if (user?.id) {
      await supabase
        .from('profiles')
        .update({ last_seen: new Date().toISOString() })
        .eq('id', user.id);
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
