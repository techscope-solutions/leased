import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('support_tickets').insert({
      user_id: user?.id ?? null,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    if (error) throw error;
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Failed to submit ticket' }, { status: 500 });
  }
}
