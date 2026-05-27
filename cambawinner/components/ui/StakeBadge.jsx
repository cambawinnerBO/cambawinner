import { BANKROLL_BASE, Theme } from '@/lib/theme';

const MONO = { fontFamily: "'JetBrains Mono', monospace" };
const MAX_STAKE = 10;

const calcularMonto  = (stake) => stake * (BANKROLL_BASE / 100);
const calcularProfit = (stake, odds) =>
  parseFloat(((odds - 1) * calcularMonto(stake)).toFixed(2));
const calcularLoss   = (stake) => calcularMonto(stake);

function StakeBar({ stake }) {
  return (
    <div style={{ display: 'flex', gap: '1px', marginBottom: '6px' }}>
      {Array.from({ length: MAX_STAKE }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: '6px',
            borderRadius: '3px',
            background: i < stake ? Theme.Colors.Green : 'rgba(29,158,117,0.15)',
          }}
        />
      ))}
    </div>
  );
}

function ProfitLine({ stake, odds, result }) {
  if (!odds || !result || result === 'anulado') return null;

  if (result === 'perdido') {
    return (
      <div style={{ ...MONO, fontSize: '11px', color: Theme.Colors.Error, marginBottom: '4px' }}>
        Loss: -Bs {calcularLoss(stake)}
      </div>
    );
  }

  const label = result === 'pendiente' ? 'Profit potencial' : 'Profit';
  return (
    <div style={{ ...MONO, fontSize: '11px', color: Theme.Colors.Green, marginBottom: '4px' }}>
      {label}: +Bs {calcularProfit(stake, odds)}
    </div>
  );
}

export default function StakeBadge({ stake, odds, result }) {
  const monto = calcularMonto(stake);

  return (
    <div style={{ width: '100%' }}>
      <StakeBar stake={stake} />

      <div style={{ ...MONO, fontSize: '11px', color: Theme.Colors.TextMuted, marginBottom: '4px' }}>
        Stake {stake}/{MAX_STAKE} · Bs {monto}
      </div>

      <ProfitLine stake={stake} odds={odds} result={result} />

      <p
        style={{
          fontSize: '10px',
          color: Theme.Colors.TextAccent,
          fontStyle: 'italic',
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        Basado en un bank de Bs 1.000. Stake 1 = 1% = Bs 10. Nunca apostés más de tu plan.
      </p>
    </div>
  );
}
