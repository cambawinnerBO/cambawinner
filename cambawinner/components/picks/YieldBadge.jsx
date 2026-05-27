import { BANKROLL_BASE, Theme } from '@/lib/theme';

const MONO = { fontFamily: "'JetBrains Mono', monospace" };

export default function YieldBadge({ yield: yieldValue, totalPicks }) {
  if (yieldValue == null) return null;

  const isPositive = yieldValue >= 0;
  const color      = isPositive ? Theme.Colors.Green : Theme.Colors.Error;
  const prefix     = isPositive ? '+' : '';
  const formatted  = `${prefix}${Number(yieldValue).toFixed(1)}%`;

  const profitAbs   = Math.abs((yieldValue / 100) * BANKROLL_BASE).toFixed(0);
  const profitLabel = `${isPositive ? '+' : '-'}Bs ${profitAbs} sobre bank de Bs 1.000`;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
      <span style={{ ...MONO, fontSize: '1.5rem', fontWeight: 700, color, lineHeight: 1.1 }}>
        {formatted}
      </span>

      {totalPicks != null && (
        <span style={{ fontSize: '0.75rem', color: Theme.Colors.TextMuted }}>
          en {totalPicks} picks
        </span>
      )}

      <span
        style={{
          ...MONO,
          fontSize: '0.6875rem',
          color: isPositive ? 'rgba(29,158,117,0.75)' : 'rgba(211,47,47,0.75)',
          whiteSpace: 'nowrap',
        }}
      >
        {profitLabel}
      </span>
    </div>
  );
}
