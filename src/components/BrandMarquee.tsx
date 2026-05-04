const BRANDS = [
  'Tesla', 'BMW', 'Mercedes-Benz', 'Audi', 'Porsche',
  'Honda', 'Toyota', 'Ford', 'Hyundai', 'Lexus', 'Volvo', 'Genesis',
];

export default function BrandMarquee() {
  const items = [...BRANDS, ...BRANDS];
  return (
    <div style={{
      padding: '32px 0',
      borderTop: '1px solid rgba(10,10,10,0.08)',
      borderBottom: '1px solid rgba(10,10,10,0.08)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        display: 'flex',
        gap: 64,
        fontSize: 36,
        color: 'rgba(10,10,10,0.25)',
        whiteSpace: 'nowrap',
        animation: 'lz-marquee 40s linear infinite',
        letterSpacing: '-0.02em',
        fontStyle: 'italic',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
        fontWeight: 400,
      }}>
        {items.map((brand, i) => (
          <span key={i} style={{ display: 'inline-flex', gap: 64, alignItems: 'center' }}>
            {brand}
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(10,10,10,0.2)', display: 'inline-block' }} />
          </span>
        ))}
      </div>
      <style>{`@keyframes lz-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}
