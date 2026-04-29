type CarType = 'Sedan' | 'SUV' | 'Coupe' | 'Truck' | 'EV';

export default function CarSilhouette({ type, stripe, color = 'rgba(255,255,255,0.55)' }: {
  type: CarType;
  stripe: string;
  color?: string;
}) {
  const isSUV = type === 'SUV';
  const isCoupe = type === 'Coupe';
  const isTruck = type === 'Truck';

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: stripe || '#111',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Ground shadow */}
      <div style={{
        position: 'absolute',
        bottom: '18%',
        left: '10%',
        right: '10%',
        height: 12,
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '50%',
        filter: 'blur(8px)',
      }} />

      <svg
        viewBox="0 0 340 140"
        style={{
          width: '85%',
          height: '65%',
          position: 'relative',
          zIndex: 1,
          filter: `drop-shadow(0 6px 18px rgba(0,0,0,0.6))`,
        }}
        fill="none"
      >
        {isTruck ? (
          <>
            {/* Truck cab */}
            <rect x="10" y="36" width="140" height="64" rx="6" fill={color} opacity="0.85"/>
            <rect x="24" y="18" width="112" height="46" rx="8" fill={color} />
            {/* Cab window */}
            <rect x="38" y="24" width="44" height="32" rx="4" fill="rgba(0,0,0,0.5)" opacity="0.7"/>
            <rect x="90" y="24" width="32" height="32" rx="4" fill="rgba(0,0,0,0.5)" opacity="0.6"/>
            {/* Truck bed */}
            <rect x="150" y="52" width="168" height="48" rx="4" fill={color} opacity="0.7"/>
            <rect x="148" y="48" width="6" height="56" rx="2" fill="rgba(0,0,0,0.4)"/>
            {/* Bed rails */}
            <rect x="150" y="52" width="168" height="6" rx="2" fill="rgba(255,255,255,0.15)"/>
            <rect x="150" y="94" width="168" height="6" rx="2" fill="rgba(255,255,255,0.08)"/>
            {/* Wheels */}
            <circle cx="72" cy="100" r="22" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5"/>
            <circle cx="72" cy="100" r="11" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
            <circle cx="72" cy="100" r="4" fill="rgba(255,255,255,0.35)"/>
            <circle cx="264" cy="100" r="22" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5"/>
            <circle cx="264" cy="100" r="11" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
            <circle cx="264" cy="100" r="4" fill="rgba(255,255,255,0.35)"/>
            {/* Lights */}
            <rect x="10" y="56" width="16" height="10" rx="2" fill="rgba(255,200,0,0.7)"/>
            <rect x="310" y="68" width="14" height="8" rx="2" fill="rgba(255,40,0,0.7)"/>
          </>
        ) : isSUV ? (
          <>
            <rect x="14" y="38" width="312" height="62" rx="8" fill={color} opacity="0.8"/>
            <rect x="34" y="16" width="228" height="52" rx="10" fill={color} />
            <path d="M34 16 Q165 10 262 16 L262 28 Q165 20 34 28 Z" fill="rgba(255,255,255,0.12)"/>
            <rect x="48" y="22" width="80" height="36" rx="5" fill="rgba(0,0,0,0.45)" opacity="0.8"/>
            <rect x="138" y="22" width="80" height="36" rx="5" fill="rgba(0,0,0,0.45)" opacity="0.7"/>
            <line x1="138" y1="38" x2="138" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
            <circle cx="78" cy="100" r="22" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5"/>
            <circle cx="78" cy="100" r="11" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
            <circle cx="78" cy="100" r="4" fill="rgba(255,255,255,0.35)"/>
            <circle cx="258" cy="100" r="22" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5"/>
            <circle cx="258" cy="100" r="11" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
            <circle cx="258" cy="100" r="4" fill="rgba(255,255,255,0.35)"/>
            <rect x="14" y="54" width="16" height="9" rx="2" fill="rgba(255,200,0,0.65)"/>
            <rect x="308" y="54" width="16" height="9" rx="2" fill="rgba(255,40,0,0.7)"/>
          </>
        ) : isCoupe ? (
          <>
            <path d="M10 84 L42 84 L72 30 L232 28 L278 84 L330 84 L330 96 L10 96 Z" fill={color} opacity="0.8"/>
            <path d="M72 30 Q152 20 232 28 L232 40 Q152 32 72 42 Z" fill="rgba(255,255,255,0.1)"/>
            <path d="M76 32 L102 32 L102 76 L76 76 Z" fill="rgba(0,0,0,0.45)" opacity="0.8"/>
            <path d="M180 29 L226 29 L226 74 L180 74 Z" fill="rgba(0,0,0,0.45)" opacity="0.7"/>
            <line x1="144" y1="32" x2="144" y2="90" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
            <circle cx="72" cy="96" r="20" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5"/>
            <circle cx="72" cy="96" r="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
            <circle cx="72" cy="96" r="3.5" fill="rgba(255,255,255,0.35)"/>
            <circle cx="268" cy="96" r="20" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5"/>
            <circle cx="268" cy="96" r="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
            <circle cx="268" cy="96" r="3.5" fill="rgba(255,255,255,0.35)"/>
            <rect x="10" y="66" width="18" height="9" rx="2" fill="rgba(255,200,0,0.65)"/>
            <rect x="310" y="66" width="18" height="9" rx="2" fill="rgba(255,40,0,0.7)"/>
          </>
        ) : (
          /* Default: Sedan / EV */
          <>
            <path d="M12 82 L44 82 L66 34 L238 32 L278 82 L328 82 L328 96 L12 96 Z" fill={color} opacity="0.8"/>
            <path d="M66 34 Q152 24 238 32 L238 44 Q152 36 66 46 Z" fill="rgba(255,255,255,0.1)"/>
            <path d="M70 36 L98 36 L98 76 L70 76 Z" fill="rgba(0,0,0,0.45)" opacity="0.8"/>
            <path d="M108 33 L198 33 L198 76 L108 76 Z" fill="rgba(0,0,0,0.4)" opacity="0.7"/>
            <path d="M206 33 L232 33 L232 76 L206 76 Z" fill="rgba(0,0,0,0.45)" opacity="0.8"/>
            <circle cx="72" cy="96" r="20" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5"/>
            <circle cx="72" cy="96" r="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
            <circle cx="72" cy="96" r="3.5" fill="rgba(255,255,255,0.35)"/>
            <circle cx="262" cy="96" r="20" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5"/>
            <circle cx="262" cy="96" r="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
            <circle cx="262" cy="96" r="3.5" fill="rgba(255,255,255,0.35)"/>
            <rect x="12" y="64" width="18" height="9" rx="2" fill="rgba(255,200,0,0.65)"/>
            <rect x="308" y="64" width="18" height="9" rx="2" fill="rgba(255,40,0,0.7)"/>
          </>
        )}
      </svg>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '28%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)',
      }} />
    </div>
  );
}
