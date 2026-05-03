import { createClient } from '@/lib/supabase/server';
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

export async function getPendingDeals(): Promise<DealWithSeller[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('deals')
    .select('*, profiles!seller_id(full_name, email)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });
  return (data ?? []) as DealWithSeller[];
}

export async function getAllDeals(): Promise<DealWithSeller[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('deals')
    .select('*, profiles!seller_id(full_name, email)')
    .order('created_at', { ascending: false });
  return (data ?? []) as DealWithSeller[];
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
