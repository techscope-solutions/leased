import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Profile } from '@/lib/supabase/types';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Fetch role if user is logged in
  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  // Redirect logged-in users away from /login
  if (user && pathname === '/login') {
    return redirectToDashboard(profile, request);
  }

  // Protect /onboarding — must be logged in
  if (!user && pathname === '/onboarding') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect /seller/* — must be seller or moderator
  if (pathname.startsWith('/seller')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url));
    if (profile?.role !== 'seller' && profile?.role !== 'moderator') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Protect /admin — must be moderator
  if (pathname.startsWith('/admin')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url));
    if (profile?.role !== 'moderator') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return supabaseResponse;
}

function redirectToDashboard(profile: Profile | null, request: NextRequest) {
  if (!profile || !profile.onboarded) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }
  if (profile.role === 'moderator') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  if (profile.role === 'seller') {
    return NextResponse.redirect(new URL('/seller/dashboard', request.url));
  }
  return NextResponse.redirect(new URL('/browse', request.url));
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
