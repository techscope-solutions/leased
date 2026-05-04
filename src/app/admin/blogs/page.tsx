import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import GenerateBlogButton from '@/components/GenerateBlogButton';

const A = 'oklch(0.55 0.22 18)';
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const SERIF = '"Instrument Serif", Georgia, serif';
const INK = '#0a0a0a';
const MUTED = 'rgba(10,10,10,0.4)';

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  tags: string[];
  published: boolean;
  created_at: string;
};

export default async function AdminBlogs() {
  const supabase = await createClient();
  const { data: blogs } = await supabase
    .from('blogs')
    .select('id, title, slug, excerpt, tags, published, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="lz-admin-page" style={{ maxWidth: 1100, fontFamily: SF, color: INK }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.55 0.16 145)', display: 'inline-block' }} />
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTED }}>Blog posts</span>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(32px, 4vw, 48px)', margin: 0, lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 400 }}>
            Blog <em style={{ color: A }}>management.</em>
          </h1>
          <p style={{ fontFamily: SF, fontSize: 13, color: MUTED, marginTop: 8 }}>
            Generated daily at 9 AM UTC via Claude API. Click to generate now.
          </p>
        </div>
        <GenerateBlogButton />
      </div>

      {/* Blog list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(blogs as BlogRow[] ?? []).map(b => (
          <div key={b.id} className="lz-glass" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '18px 22px', borderRadius: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: b.published ? 'oklch(0.55 0.16 145)' : MUTED,
                  background: b.published ? 'rgba(34,197,94,0.10)' : 'rgba(10,10,10,0.05)',
                  padding: '2px 8px', borderRadius: 99,
                }}>
                  {b.published ? 'Published' : 'Draft'}
                </span>
                {(b.tags ?? []).slice(0, 3).map(tag => (
                  <span key={tag} style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.08em', color: MUTED, background: 'rgba(10,10,10,0.05)', padding: '2px 7px', borderRadius: 99 }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ fontFamily: SF, fontWeight: 600, fontSize: 15, color: INK, marginBottom: 4, lineHeight: 1.3 }}>
                {b.title}
              </div>
              {b.excerpt && (
                <div style={{ fontFamily: SF, fontSize: 13, color: MUTED, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                  {b.excerpt}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: MUTED, whiteSpace: 'nowrap' }}>
                {new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <Link href={`/blog/${b.slug}`} target="_blank" style={{ fontFamily: SF, fontWeight: 500, fontSize: 13, color: A, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                View ↗
              </Link>
            </div>
          </div>
        ))}

        {(blogs?.length ?? 0) === 0 && (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <div style={{ fontFamily: SF, fontSize: 15, color: MUTED, marginBottom: 8 }}>No blog posts yet</div>
            <p style={{ fontFamily: SF, fontSize: 13, color: 'rgba(10,10,10,0.3)' }}>Click &quot;Generate New Post&quot; to create your first AI-written blog post.</p>
          </div>
        )}
      </div>
    </div>
  );
}
