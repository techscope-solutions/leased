import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { CarDeal, DriveTrain, DealTier, DealType, DealCategory } from './types';

export type DbDeal = {
  id: string;
  seller_id: string;
  status: 'pending' | 'live' | 'rejected';
  make: string;
  model: string;
  trim: string;
  year: number;
  drive: string;
  car_type: string;
  category: string;
  color: string | null;
  deal_type: string;
  monthly: number;
  due_at_signing: number;
  term: number;
  miles_per_year: number;
  msrp: number;
  zero_deal: boolean;
  state: string;
  city: string;
  slots_left: number | null;
  tier: string;
  featured: boolean;
  expires_at: string | null;
  images: string[];
  stripe: string | null;
  accent: string | null;
  drop_id: string;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
};

const CATEGORY_ACCENT: Record<string, string> = {
  Daily: '#111827',
  Luxury: '#0a0f1e',
  Supercar: '#161616',
};

export function dbRowToCarDeal(row: DbDeal): CarDeal {
  const accent = row.accent ?? CATEGORY_ACCENT[row.category] ?? '#111111';
  const stripe = row.stripe ?? `linear-gradient(135deg, ${accent} 0%, ${accent}ee 100%)`;
  return {
    id: row.id,
    make: row.make,
    model: row.model,
    trim: row.trim,
    year: row.year,
    drive: row.drive as DriveTrain,
    type: row.deal_type as DealType,
    monthly: row.monthly,
    dueAtSigning: row.due_at_signing,
    term: row.term,
    milesPerYear: row.miles_per_year,
    msrp: row.msrp,
    expiresAt: row.expires_at
      ? new Date(row.expires_at)
      : new Date(Date.now() + 30 * 24 * 3600 * 1000),
    tier: row.tier as DealTier,
    dropId: row.drop_id,
    state: row.state,
    city: row.city,
    slotsLeft: row.slots_left,
    zeroDeal: row.zero_deal,
    featured: row.featured,
    color: row.color ?? undefined,
    carType: row.car_type as CarDeal['carType'],
    category: row.category as DealCategory,
    stripe,
    accent,
    images: row.images ?? [],
  };
}

export async function getLiveDeals(): Promise<CarDeal[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('deals')
    .select('*')
    .eq('status', 'live')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });
  return (data ?? []).map(row => dbRowToCarDeal(row as DbDeal));
}

export async function getLiveDealsByCategory(): Promise<{
  Daily: CarDeal[];
  Luxury: CarDeal[];
  Supercar: CarDeal[];
}> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('deals')
    .select('*')
    .eq('status', 'live')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });
  const deals = (data ?? []).map(row => dbRowToCarDeal(row as DbDeal));
  return {
    Daily: deals.filter(d => d.category === 'Daily'),
    Luxury: deals.filter(d => d.category === 'Luxury'),
    Supercar: deals.filter(d => d.category === 'Supercar'),
  };
}

export async function getLiveDealsStats(): Promise<{
  liveDrops: number;
  zeroDown: number;
  startingFrom: number;
}> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('deals')
    .select('monthly, zero_deal')
    .eq('status', 'live');
  const rows = data ?? [];
  return {
    liveDrops: rows.length,
    zeroDown: rows.filter((r: { zero_deal: boolean }) => r.zero_deal).length,
    startingFrom: rows.length ? Math.min(...rows.map((r: { monthly: number }) => r.monthly)) : 0,
  };
}

export async function getSellerDeals(sellerId: string): Promise<DbDeal[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('deals')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });
  return (data ?? []) as DbDeal[];
}

export type DealWithSeller = DbDeal & {
  profiles: { full_name: string | null; email: string | null } | null;
};

async function attachProfiles(deals: DbDeal[]): Promise<DealWithSeller[]> {
  if (deals.length === 0) return deals.map(d => ({ ...d, profiles: null }));
  try {
    const supabase = createAdminClient();
    const sellerIds = [...new Set(deals.map(d => d.seller_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .in('id', sellerIds);
    const map = Object.fromEntries((profiles ?? []).map((p: { id: string; full_name: string | null; email: string | null }) => [p.id, p]));
    return deals.map(d => ({ ...d, profiles: map[d.seller_id] ?? null }));
  } catch {
    return deals.map(d => ({ ...d, profiles: null }));
  }
}

export async function getPendingDeals(): Promise<DealWithSeller[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });
    if (error) { console.error('getPendingDeals error:', error.message); return []; }
    return attachProfiles((data ?? []) as DbDeal[]);
  } catch (e) {
    console.error('getPendingDeals threw:', e);
    return [];
  }
}

export async function getAllDeals(): Promise<DealWithSeller[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error('getAllDeals error:', error.message); return []; }
    return attachProfiles((data ?? []) as DbDeal[]);
  } catch (e) {
    console.error('getAllDeals threw:', e);
    return [];
  }
}

export async function getFeaturedDeal(): Promise<DbDeal | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('deals')
    .select('*')
    .eq('status', 'live')
    .eq('featured', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data ?? null) as DbDeal | null;
}

export async function getDealById(id: string): Promise<DbDeal | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('deals')
    .select('*')
    .eq('id', id)
    .single();
  return (data ?? null) as DbDeal | null;
}

export async function getSimilarDeals(id: string, category: string): Promise<CarDeal[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('deals')
    .select('*')
    .eq('status', 'live')
    .eq('category', category)
    .neq('id', id)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(4);
  if (data && data.length >= 2) return data.map(r => dbRowToCarDeal(r as DbDeal));
  // Fall back to any live deals if not enough in same category
  const { data: fallback } = await supabase
    .from('deals')
    .select('*')
    .eq('status', 'live')
    .neq('id', id)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(4);
  return (fallback ?? []).map(r => dbRowToCarDeal(r as DbDeal));
}
