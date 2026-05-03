import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('blogs')
    .select('seo_title, seo_description, title')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!data) return { title: 'Post Not Found — LEASED' };
  return {
    title: data.seo_title ?? `${data.title} — LEASED`,
    description: data.seo_description ?? undefined,
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!post) notFound();

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
      {/* Nav */}
      <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, letterSpacing: '0.04em', color: '#fff' }}>
            LEASED<span style={{ color: '#FF2800' }}>.</span>
          </span>
        </Link>
        <Link href="/blog" style={{ fontFamily: 'var(--font-barlow-cond)', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
          ← ALL POSTS
        </Link>
      </div>

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 100px' }}>
        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {(post.tags ?? []).map((tag: string) => (
            <span key={tag} style={{
              fontFamily: 'var(--font-barlow-cond)',
              fontWeight: 600,
              fontSize: 9,
              letterSpacing: '0.14em',
              color: 'rgba(255,255,255,0.35)',
              background: 'rgba(255,255,255,0.06)',
              padding: '3px 10px',
              borderRadius: 99,
            }}>{tag.toUpperCase()}</span>
          ))}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-barlow-cond)',
          fontWeight: 900,
          fontSize: 'clamp(28px, 5vw, 48px)',
          color: '#fff',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: 20,
        }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>
            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>·</span>
          <span style={{ fontFamily: 'var(--font-barlow-cond)', fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>LEASED JOURNAL</span>
        </div>

        {/* Cover image */}
        {post.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt={post.cover_image_alt ?? post.title}
            style={{ width: '100%', height: 'auto', maxHeight: 400, objectFit: 'cover', borderRadius: 16, marginBottom: 40 }}
          />
        )}

        {/* Content */}
        <div
          style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)' }}
          dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
        />

        {/* CTA */}
        <div style={{ marginTop: 56, padding: '32px', background: 'rgba(255,40,0,0.06)', border: '1px solid rgba(255,40,0,0.15)', borderRadius: 18, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28, letterSpacing: '-0.02em', color: '#fff', marginBottom: 10 }}>
            READY TO FIND YOUR DEAL?
          </div>
          <p style={{ fontFamily: 'var(--font-barlow)', fontWeight: 300, fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>
            Browse curated lease drops from vetted brokers. Strike before the timer hits zero.
          </p>
          <Link href="/browse" style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: '#FF2800',
            borderRadius: 10,
            fontFamily: 'var(--font-barlow-cond)',
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: '0.08em',
            color: '#fff',
            textDecoration: 'none',
          }}>
            BROWSE LEASES
          </Link>
        </div>
      </article>

      {/* Blog post styles */}
      <style>{`
        article h2 { font-family: var(--font-barlow-cond); font-weight: 800; font-size: 24px; color: #fff; margin: 40px 0 14px; letter-spacing: -0.01em; }
        article h3 { font-family: var(--font-barlow-cond); font-weight: 700; font-size: 18px; color: rgba(255,255,255,0.85); margin: 28px 0 10px; }
        article p { margin-bottom: 20px; }
        article ul, article ol { margin: 0 0 20px 20px; }
        article li { margin-bottom: 8px; }
        article strong { color: rgba(255,255,255,0.9); font-weight: 600; }
        article a { color: #FF2800; text-decoration: none; }
        article a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
