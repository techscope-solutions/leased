import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: deals, error: dealsErr } = await supabase
      .from('deals')
      .select('id, seller_id, status, make, model');

    const sellerIds = [...new Set((deals ?? []).map((d: { seller_id: string }) => d.seller_id))];

    const { data: profiles, error: profilesErr } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', sellerIds.length > 0 ? sellerIds : ['none']);

    const { count: liveCount, error: liveErr } = await supabase
      .from('deals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'live');

    return NextResponse.json({
      deals: { rows: deals?.length ?? 0, error: dealsErr?.message ?? null, data: deals },
      profiles: { rows: profiles?.length ?? 0, error: profilesErr?.message ?? null, data: profiles },
      liveCount: { count: liveCount, error: liveErr?.message ?? null },
      sellerIds,
    });
  } catch (err: unknown) {
    return NextResponse.json({ caught: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
