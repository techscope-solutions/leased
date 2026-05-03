import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — LEASED',
  description: 'Expert guides on car leasing, lease deals, and how to get the best terms.',
};

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  tags: string[];
  created_at: string;
};

export default async function BlogIndex() {
  const supabase = await createClient();
  const { data: blogs } = await supabase
    .from('blogs')
    .select('id, title, slug, excerpt, cover_image_url, cover_image_alt, tags, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false });

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
      {/* Nav */}
      <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, letterSpacing: '0.04em', color: '#fff' }}>
            LEASED<span style={{ color: '#FF2800' }}>.</span>
          </span>
        </Link>
        <Link href="/browse" style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
          BROWSE DEALS
        </Link>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px 100px' }}>
        {/* Header */}
        <div style={{ marginBottom: 56, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
            LEASED JOURNAL
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(36px, 6vw, 64px)', letterSpacing: '-0.025em', lineHeight: 0.93, color: '#fff', marginBottom: 16 }}>
            LEASE <span style={{ color: '#FF2800' }}>INTEL.</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 15, color: 'rgba(255,255,255,0.45)', maxWidth: 480, margin: '0 auto' }}>
            Expert guides on car leasing, deal breakdowns, and how to get the best terms on any vehicle.
          </p>
        </div>

        {/* Blog grid */}
        {(blogs?.length ?? 0) === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--font-barlow)', fontSize: 14, color: 'rgba(255,255,255,0.2)' }}>
            First post coming soon.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 20 }}>
            {(blogs as BlogRow[]).map((b, i) => (
              <Link key={b.id} href={`/blog/${b.slug}`} style={{ textDecoration: 'none' }}>
                <article style={{
                  display: 'grid',
                  gridTemplateColumns: b.cover_image_url && i === 0 ? '1fr' : b.cover_image_url ? '1fr 280px' : '1fr',
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 18,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}>
                  <div style={{ padding: i === 0 ? '32px' : '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                      {(b.tags ?? []).slice(0, 3).map(tag => (
                        <span key={tag} style={{
                          fontFamily: 'var(--font-barlow-cond)',
                          fontWeight: 600,
                          fontSize: 9,
                          letterSpacing: '0.12em',
                          color: 'rgba(255,255,255,0.3)',
                          background: 'rgba(255,255,255,0.06)',
                          padding: '2px 8px',
                          borderRadius: 99,
                        }}>{tag.toUpperCase()}</span>
                      ))}
                      <span style={{ fontFamily: 'var(--font-barlow-cond)', fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>
                        {new Date(b.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h2 style={{
                      fontFamily: 'var(--font-barlow-cond)',
                      fontWeight: 900,
                      fontSize: i === 0 ? 'clamp(22px, 3vw, 32px)' : 18,
                      color: '#fff',
                      letterSpacing: '-0.01em',
                      lineHeight: 1.2,
                      marginBottom: 10,
                    }}>{b.title}</h2>
                    {b.excerpt && (
                      <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                        {b.excerpt}
                      </p>
                    )}
                    <div style={{ marginTop: 16, fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', color: '#FF2800' }}>
                      READ MORE →
                    </div>
                  </div>
                  {b.cover_image_url && i !== 0 && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={b.cover_image_url}
                      alt={b.cover_image_alt ?? b.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 160 }}
                    />
                  )}
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
