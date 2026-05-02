export type Role = 'user' | 'seller' | 'moderator';

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: Role;
  onboarded: boolean;
  created_at: string;
};

// Supabase database type — used for the typed client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;
