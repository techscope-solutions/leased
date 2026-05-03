import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

const TOPICS = [
  'Best Car Lease Deals in 2026 — Hidden Gems You Should Know',
  'How to Negotiate a Car Lease and Actually Win',
  'Electric Vehicle Lease vs Buy: The Real Numbers',
  'BMW vs Mercedes Lease Comparison: Which Is the Better Deal?',
  'Zero Down Car Leases Explained: Catch or Opportunity?',
  'Car Lease Terminology Decoded: MF, Cap Cost, Residual',
  'Best Luxury SUV Leases Right Now',
  'How to Transfer a Car Lease — and When It Makes Sense',
  'Tesla Lease vs Buy: A Complete 2026 Breakdown',
  'Best Sports Car Leases Under $800/Month',
  'The Ultimate Guide to Leasing a Car for the First Time',
  'Why Lease Deals Expire and How to Strike at the Right Moment',
];

async function fetchPexelsImage(query: string): Promise<{ url: string; alt: string } | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: key } }
    );
    const data = await res.json();
    const photo = data.photos?.[0];
    if (!photo) return null;
    return { url: photo.src.large2x, alt: photo.alt ?? query };
  } catch {
    return null;
  }
}

function extractJson(raw: string): string {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found in response');
  return raw.slice(start, end + 1);
}

export async function generateBlogPost(): Promise<{ ok: true; title: string } | { ok: false; error: string }> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { ok: false, error: 'ANTHROPIC_API_KEY is not configured' };
  }

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const topic = TOPICS[dayOfYear % TOPICS.length];

  let post: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    seoTitle: string;
    seoDescription: string;
    tags: string[];
    imageQuery: string;
  };

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Write an SEO-optimized blog post for a car lease marketplace called LEASED. Topic: "${topic}"

Return ONLY valid JSON (no markdown fences, no explanation) with these exact fields:
{
  "title": "compelling title",
  "slug": "url-friendly-slug",
  "excerpt": "2-3 sentence summary for previews",
  "content": "full HTML content using h2, h3, p, ul, li tags — at least 600 words",
  "seoTitle": "SEO title tag (under 60 chars)",
  "seoDescription": "meta description (under 160 chars)",
  "tags": ["tag1", "tag2", "tag3"],
  "imageQuery": "2-3 word Pexels image search query"
}`,
      }],
    });

    const raw = (message.content[0] as { type: string; text: string }).text.trim();
    post = JSON.parse(extractJson(raw));
  } catch (err) {
    return { ok: false, error: `AI generation failed: ${err instanceof Error ? err.message : String(err)}` };
  }

  const image = await fetchPexelsImage(post.imageQuery ?? 'luxury car');

  // Append a short unique suffix to prevent slug collisions on repeat runs
  const uniqueSlug = `${post.slug}-${Date.now().toString(36)}`;

  const supabase = await createClient();
  const { error } = await supabase.from('blogs').insert({
    title: post.title,
    slug: uniqueSlug,
    content: post.content,
    excerpt: post.excerpt,
    cover_image_url: image?.url ?? null,
    cover_image_alt: image?.alt ?? post.title,
    seo_title: post.seoTitle,
    seo_description: post.seoDescription,
    tags: post.tags ?? [],
    published: true,
  });

  if (error) return { ok: false, error: `DB insert failed: ${error.message}` };
  return { ok: true, title: post.title };
}

export async function POST(request: Request) {
  const secret = request.headers.get('x-cron-secret');
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await generateBlogPost();
  return Response.json(result, { status: result.ok ? 200 : 500 });
}
