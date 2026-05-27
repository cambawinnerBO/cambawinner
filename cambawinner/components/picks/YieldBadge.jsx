const MONO = { fontFamily: "'JetBrains Mono', monospace" };

export default function YieldBadge({ yield: yieldValue, totalPicks }) {
  if (yieldValue == null) return null;

  const isPositive = yieldValue >= 0;
  const color = isPositive ? '#1D9E75' : '#D32F2F';
  const prefix = isPositive ? '+' : '';
  const formatted = `${prefix}${Number(yieldValue).toFixed(1)}%`;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <span
        style={{
          ...MONO,
          fontSize: '1.5rem',
          fontWeight: 700,
          color,
          lineHeight: 1.1,
        }}
      >
        {formatted}
      </span>
      {totalPicks != null && (
        <span style={{ fontSize: '0.75rem', color: '#A0A8B5', marginTop: '2px' }}>
          en {totalPicks} picks
        </span>
      )}
    </div>
  );
}
