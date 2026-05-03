export type DriveTrain = 'AWD' | 'RWD' | 'FWD' | '4WD';
export type DealTier = 'GOLD' | 'PLATINUM' | 'VERIFIED';
export type DealType = 'LEASE' | 'FINANCE';
export type DealCategory = 'Daily' | 'Luxury' | 'Supercar';

export interface CarDeal {
  id: string;
  make: string;
  model: string;
  trim: string;
  year: number;
  drive: DriveTrain;
  type: DealType;
  monthly: number;
  dueAtSigning: number;
  term: number; // months
  milesPerYear: number; // e.g. 7500, 10000
  msrp: number;
  expiresAt: Date;
  tier: DealTier;
  dropId: string;
  state: string;
  city: string;
  slotsLeft: number | null; // null = unlimited
  zeroDeal: boolean;
  featured?: boolean;
  color?: string;
  carType: 'Sedan' | 'SUV' | 'Coupe' | 'Truck' | 'EV';
  category: DealCategory;
  stripe: string;
  accent: string;
  images: string[];
}
