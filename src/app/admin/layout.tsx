import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Profile } from '@/lib/supabase/types';
import AdminSidebar from '@/components/AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profileData } = await supabase
    .from('profiles').select('*').eq('id', user.id).single();
  const profile = profileData as Profile | null;
  if (profile?.role !== 'moderator') redirect('/');

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .r-admin-sidebar { display: none !important; }
          .r-admin-mobile-nav { display: block !important; }
          body { padding-bottom: 0 !important; }
        }
      `}</style>
      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 2, background: '#f7f5f2', color: '#0a0a0a', WebkitFontSmoothing: 'antialiased' }}>
        <AdminSidebar />
        <main style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
          {children}
        </main>
      </div>
    </>
  );
}
