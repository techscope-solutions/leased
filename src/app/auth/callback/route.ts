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

  const { data: existingProfile, error: readErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (readErr) {
    return NextResponse.redirect(`${origin}/login?error=profile_read_failed`);
  }

  const isModerator = MODERATOR_EMAILS.includes(user.email?.toLowerCase() ?? '');

  if (!existingProfile) {
    const { error: insertErr } = await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
      role: isModerator ? 'moderator' : 'user',
      onboarded: isModerator,
    });
    if (insertErr) {
      return NextResponse.redirect(`${origin}/login?error=profile_create_failed`);
    }

    if (isModerator) return NextResponse.redirect(`${origin}/admin`);
    return NextResponse.redirect(`${origin}/onboarding`);
  }

  // Promote/demote existing profile based on the current MODERATOR_EMAILS env.
  // Without this, adding an email to MODERATOR_EMAILS only takes effect for
  // brand-new signups, leaving prior users stuck as 'user'.
  const targetRole = isModerator
    ? 'moderator'
    : existingProfile.role === 'moderator' ? 'user' : existingProfile.role;
  if (targetRole !== existingProfile.role) {
    await supabase
      .from('profiles')
      .update({ role: targetRole, onboarded: isModerator ? true : existingProfile.onboarded })
      .eq('id', user.id);
    existingProfile.role = targetRole;
    if (isModerator) existingProfile.onboarded = true;
  }

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
