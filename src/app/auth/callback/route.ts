import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const MODERATOR_EMAILS = (process.env.MODERATOR_EMAILS ?? '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=no_user`);
  }

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!existingProfile) {
    // New user — create profile
    const isModerator = MODERATOR_EMAILS.includes(user.email?.toLowerCase() ?? '');
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
      role: isModerator ? 'moderator' : 'user',
      onboarded: isModerator, // moderators skip onboarding
    });

    if (isModerator) {
      return NextResponse.redirect(`${origin}/admin`);
    }
    return NextResponse.redirect(`${origin}/onboarding`);
  }

  // Existing user — route by role
  if (!existingProfile.onboarded) {
    return NextResponse.redirect(`${origin}/onboarding`);
  }
  if (existingProfile.role === 'moderator') {
    return NextResponse.redirect(`${origin}/admin`);
  }
  if (existingProfile.role === 'seller') {
    return NextResponse.redirect(`${origin}/seller/dashboard`);
  }
  return NextResponse.redirect(`${origin}/browse`);
}
