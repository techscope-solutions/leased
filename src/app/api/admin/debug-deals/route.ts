import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: dealsSimple, error: e1, count } = await supabase
      .from('deals')
      .select('id, status, make, model, seller_id', { count: 'exact' });

    const { data: dealsJoined, error: e2 } = await supabase
      .from('deals')
      .select('*, profiles!seller_id(full_name, email)')
      .limit(5);

    return NextResponse.json({
      env: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'MISSING',
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? `set (${process.env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 20)}...)` : 'MISSING',
      },
      simpleQuery: { count, error: e1?.message ?? null, rows: dealsSimple?.length ?? 0, data: dealsSimple },
      joinQuery: { error: e2?.message ?? null, rows: dealsJoined?.length ?? 0, data: dealsJoined },
    });
  } catch (err: unknown) {
    return NextResponse.json({ caught: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
