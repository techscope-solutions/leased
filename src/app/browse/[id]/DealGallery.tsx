'use client';

import { useState } from 'react';

const A = 'oklch(0.55 0.22 18)';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

type Props = {
  images: string[];
  make: string;
  model: string;
  year: number;
};

export default function DealGallery({ images, make, model, year }: Props) {
  const [idx, setIdx] = useState(0);
  const hasMultiple = images.length > 1;
  const current = images[idx] ?? null;

  return (
    <div className="lz-glass" style={{ borderRadius: 24, padding: 8 }}>
      {/* Main image */}
      <div style={{
        position: 'relative', borderRadius: 18, overflow: 'hidden',
        aspectRatio: '16/10',
        background: 'rgba(10,10,10,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current}
            alt={`${year} ${make} ${model}`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span style={{
            fontFamily: MONO, fontSize: 11, color: 'rgba(10,10,10,0.3)',
            textTransform: 'uppercase', letterSpacing: '0.12em',
            background: 'rgba(247,245,242,0.85)', padding: '6px 12px', borderRadius: 6,
          }}>
            {year} · {make} · {model}
          </span>
        )}

        {/* Nav arrows — only if multiple images */}
        {hasMultiple && (
          <>
            <button
              onClick={() => setIdx((idx - 1 + images.length) % images.length)}
              style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                width: 38, height: 38, borderRadius: '50%',
                background: 'rgba(247,245,242,0.88)', backdropFilter: 'blur(10px)',
                border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center',
                fontSize: 18, color: '#0a0a0a', lineHeight: 1,
              }}
            >‹</button>
            <button
              onClick={() => setIdx((idx + 1) % images.length)}
              style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                width: 38, height: 38, borderRadius: '50%',
                background: 'rgba(247,245,242,0.88)', backdropFilter: 'blur(10px)',
                border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center',
                fontSize: 18, color: '#0a0a0a', lineHeight: 1,
              }}
            >›</button>
            <div style={{
              position: 'absolute', bottom: 14, right: 14,
              padding: '5px 10px', borderRadius: 999,
              background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
              color: 'white', fontSize: 11, fontFamily: MONO,
            }}>
              {idx + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails — only if 2+ images */}
      {hasMultiple && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(images.length, 5)}, 1fr)`,
          gap: 8, marginTop: 8,
        }}>
          {images.slice(0, 5).map((url, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              style={{
                aspectRatio: '4/3', borderRadius: 10, border: 'none',
                padding: 0, cursor: 'pointer', overflow: 'hidden',
                outline: idx === i ? `2px solid ${A}` : '2px solid transparent',
                outlineOffset: 2,
                background: 'rgba(10,10,10,0.06)',
                transition: 'outline 0.15s',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
