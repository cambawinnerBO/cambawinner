'use client';
import Badge from '../ui/Badge';
import Temporizador from './Temporizador';
import { Theme } from '@/lib/theme';

const MONO = { fontFamily: "'JetBrains Mono', monospace" };

function formatFechaPublicada(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('es-BO', {
    timeZone: 'America/La_Paz',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatearHoraBolivia(fechaISO) {
  if (!fechaISO) return '';
  return new Date(fechaISO).toLocaleTimeString('es-BO', {
    timeZone: 'America/La_Paz',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default function PickCard({
  match, league, market, odds, stake,
  result, analysis, published_at, match_date, profit_bs,
}) {
  const fecha = formatFechaPublicada(published_at);
  const hora  = formatearHoraBolivia(match_date);

  const montoApostado = stake * 10;
  const tieneResultado = (result === 'ganado' || result === 'perdido') && profit_bs != null;
  const retornoLabel = result === 'ganado'
    ? `+Bs ${Math.abs(Math.round(profit_bs))}`
    : `-Bs ${Math.abs(Math.round(profit_bs ?? montoApostado))}`;
  const retornoColor = result === 'ganado' ? Theme.Colors.Green : Theme.Colors.Error;
  const retornoTexto = result === 'ganado' ? 'Retorno' : 'Pérdida';

  return (
    <div style={{ background: Theme.Colors.Surface, borderRadius: Theme.Radius.MD, border: '0.5px solid rgba(10,37,64,0.1)', padding: '16px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '4px' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: Theme.Colors.TextPrimary, margin: 0, flex: 1 }}>{match}</p>
        {result && <Badge result={result} />}
      </div>

      <p style={{ fontSize: '12px', color: Theme.Colors.TextSecondary, margin: '0 0 4px' }}>
        {league}{fecha ? ` · ${fecha}` : ''}{hora ? ` · ${hora}` : ''}
      </p>

      <p style={{ fontSize: '13px', color: Theme.Colors.TextSecondary, margin: '0 0 10px' }}>{market}</p>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '10px', color: Theme.Colors.TextMuted, display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cuota</span>
          <span style={{ ...MONO, fontSize: '14px', fontWeight: 700, color: Theme.Colors.TextPrimary }}>{Number(odds).toFixed(2)}</span>
        </div>
        <div>
          <span style={{ fontSize: '10px', color: Theme.Colors.TextMuted, display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Stake</span>
          <span style={{ ...MONO, fontSize: '14px', fontWeight: 700, color: Theme.Colors.TextPrimary }}>{stake}/10</span>
        </div>
        <div>
          <span style={{ fontSize: '10px', color: Theme.Colors.TextMuted, display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Apostado</span>
          <span style={{ ...MONO, fontSize: '14px', fontWeight: 700, color: Theme.Colors.TextSecondary }}>Bs {montoApostado}</span>
        </div>
      </div>

      {tieneResultado && (
        <div style={{ borderTop: '0.5px solid rgba(10,37,64,0.08)', paddingTop: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '10px', color: Theme.Colors.TextMuted, display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Resultado</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ ...MONO, fontSize: '13px', color: Theme.Colors.TextSecondary }}>Apostado: Bs {montoApostado}</span>
            <span style={{ fontSize: '13px', color: Theme.Colors.TextSecondary }}>→</span>
            <span style={{ ...MONO, fontSize: '13px', fontWeight: 700, color: retornoColor }}>{retornoTexto}: {retornoLabel}</span>
          </div>
        </div>
      )}

      {result === 'pendiente' && match_date && (
        <div style={{ marginBottom: '10px' }}>
          <Temporizador matchDate={match_date} result={result} />
        </div>
      )}

      {analysis && (
        <p style={{ fontSize: '13px', color: Theme.Colors.TextMuted, lineHeight: 1.55, margin: 0, paddingTop: '10px', borderTop: '0.5px solid rgba(10,37,64,0.08)' }}>
          {analysis}
        </p>
      )}
    </div>
  );
}
