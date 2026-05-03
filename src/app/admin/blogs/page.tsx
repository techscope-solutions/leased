import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import GenerateBlogButton from '@/components/GenerateBlogButton';

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
    <div style={{ padding: '40px 32px 80px', maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.35)' }}>BLOG POSTS</span>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.02em', color: '#fff' }}>
            BLOG <span style={{ color: '#22c55e' }}>MANAGEMENT</span>
          </div>
          <p style={{ fontFamily: 'var(--font-barlow)', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>
            Generated daily at 9 AM UTC via Claude API. Click to generate now.
          </p>
        </div>
        <GenerateBlogButton />
      </div>

      {/* Blog list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(blogs as BlogRow[] ?? []).map(b => (
          <div key={b.id} style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            padding: '20px 24px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: 'var(--font-barlow-cond)',
                  fontWeight: 700,
                  fontSize: 9,
                  letterSpacing: '0.12em',
                  color: b.published ? '#22c55e' : 'rgba(255,255,255,0.3)',
                  background: b.published ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
                  padding: '2px 8px',
                  borderRadius: 99,
                }}>
                  {b.published ? 'PUBLISHED' : 'DRAFT'}
                </span>
                {(b.tags ?? []).slice(0, 3).map(tag => (
                  <span key={tag} style={{
                    fontFamily: 'var(--font-barlow-cond)',
                    fontWeight: 600,
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '2px 7px',
                    borderRadius: 99,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 4, lineHeight: 1.3 }}>
                {b.title}
              </div>
              {b.excerpt && (
                <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                  {b.excerpt}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-barlow-cond)', fontSize: 10, color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
                {new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <Link href={`/blog/${b.slug}`} target="_blank" style={{
                fontFamily: 'var(--font-barlow-cond)',
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: '0.1em',
                color: '#4a7fd4',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}>
                VIEW ↗
              </Link>
            </div>
          </div>
        ))}

        {(blogs?.length ?? 0) === 0 && (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-barlow)', fontSize: 14, color: 'rgba(255,255,255,0.2)', marginBottom: 16 }}>No blog posts yet</div>
            <p style={{ fontFamily: 'var(--font-barlow)', fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>Click &quot;Generate New Post&quot; to create your first AI-written blog post.</p>
          </div>
        )}
      </div>
    </div>
  );
}
