import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import StakeBadge from '@/components/ui/StakeBadge';
import PickCard from '@/components/picks/PickCard';
import { BANKROLL_BASE, Theme } from '@/lib/theme';

// ── Mock data ──────────────────────────────────────────────────────────────

const PICK_DEL_DIA = {
  match: 'Club Bolívar vs The Strongest',
  league: 'División Profesional',
  date: 'Hoy · 20:00',
  market: '1X2 — Local gana',
  odds: 2.10,
  stake: 3,
  bookmaker: 'Betano',
  affiliateUrl: '#',
  analysis: 'Bolívar lleva 6 partidos invicto en casa. The Strongest viene de perder 2 consecutivos de visitante. El local tiene mejor forma reciente y juega ante su gente.',
  confidence: 'Alta',
  result: 'pendiente',
};

const MOCK_PICKS = [
  {
    id: 1,
    match: 'Bolívar vs The Strongest',
    league: 'División Profesional',
    market: '1X2 — Local gana',
    odds: 2.10,
    stake: 3,
    result: 'ganado',
    analysis: 'Bolívar lleva 6 partidos invicto en casa. The Strongest viene de perder 2 consecutivos de visitante.',
  },
  {
    id: 2,
    match: 'Always Ready vs Wilstermann',
    league: 'División Profesional',
    market: 'Over 2.5 goles',
    odds: 1.95,
    stake: 2,
    result: 'perdido',
    analysis: 'Ambos equipos promediaban 3.1 goles por partido en los últimos 5 encuentros.',
  },
];

const YIELD_STATS = {
  yield: 12.4,
  totalPicks: 47,
  ganados: 28,
  perdidos: 17,
  anulados: 2,
};

// ── Helpers ────────────────────────────────────────────────────────────────

const MONO = { fontFamily: "'JetBrains Mono', monospace" };

function Divider() {
  return (
    <div style={{ height: '1px', background: 'rgba(10,37,64,0.08)', margin: `${Theme.Spacing.LG} 0` }} />
  );
}

function StatItem({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', flex: 1 }}>
      <span style={{ fontSize: '10px', color: Theme.Colors.TextSecondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span style={{ ...MONO, fontSize: '1.125rem', fontWeight: 700, color: Theme.Colors.TextPrimary }}>
        {value}
      </span>
    </div>
  );
}

function StatDivider() {
  return <div style={{ width: '1px', height: '32px', background: 'rgba(10,37,64,0.1)', flexShrink: 0 }} />;
}

// ── Sección 1 — Pick del Día ───────────────────────────────────────────────

function YieldStatsRow() {
  const isPositive = YIELD_STATS.yield >= 0;
  const prefix     = isPositive ? '+' : '-';
  const profitAbs  = Math.abs((YIELD_STATS.yield / 100) * BANKROLL_BASE).toFixed(0);

  const NUM  = { ...MONO, fontSize: '20px', fontWeight: 600, color: Theme.Colors.Green };
  const LBL  = { fontSize: '11px', fontWeight: 400, color: Theme.Colors.TextAccent, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        background: 'rgba(29,158,117,0.08)',
        border: '1px solid rgba(29,158,117,0.2)',
        borderRadius: Theme.Radius.LG,
        padding: Theme.Spacing.LG,
        marginBottom: Theme.Spacing.MD,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={NUM}>{`${isPositive ? '+' : ''}${YIELD_STATS.yield.toFixed(1)}%`}</span>
        <span style={LBL}>Rentabilidad</span>
      </div>

      <div style={{ width: '1px', height: '32px', background: 'rgba(29,158,117,0.2)', flexShrink: 0 }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={NUM}>{YIELD_STATS.totalPicks}</span>
        <span style={LBL}>Picks</span>
      </div>

      <div style={{ width: '1px', height: '32px', background: 'rgba(29,158,117,0.2)', flexShrink: 0 }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={NUM}>{`${prefix}Bs ${profitAbs}`}</span>
        <span style={LBL}>Ganancia</span>
      </div>
    </div>
  );
}

function PickDelDia() {
  const pick = PICK_DEL_DIA;
  return (
    <section style={{ marginBottom: Theme.Spacing.XXL }}>
      <YieldStatsRow />
      <div
        style={{
          background: Theme.Colors.Surface,
          borderRadius: Theme.Radius.LG,
          boxShadow: '0 4px 24px rgba(10,37,64,0.15)',
          padding: Theme.Spacing.XL,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: Theme.Spacing.LG }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: 'rgba(29,158,117,0.12)',
              color: Theme.Colors.Green,
              borderRadius: '9999px',
              padding: '4px 14px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            ⚡ PICK DEL DÍA
          </span>
        </div>

        <h2
          style={{
            fontSize: '1.375rem',
            fontWeight: 600,
            color: Theme.Colors.TextPrimary,
            textAlign: 'center',
            lineHeight: 1.25,
            marginBottom: Theme.Spacing.XS,
          }}
        >
          {pick.match}
        </h2>

        <p
          style={{
            textAlign: 'center',
            fontSize: '0.8125rem',
            color: Theme.Colors.TextSecondary,
            marginBottom: Theme.Spacing.LG,
          }}
        >
          {pick.league} · {pick.date}
        </p>

        <p
          style={{
            textAlign: 'center',
            fontSize: '1rem',
            fontWeight: 500,
            color: Theme.Colors.TextPrimary,
            marginBottom: Theme.Spacing.LG,
          }}
        >
          {pick.market}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Theme.Spacing.MD }}>
          <StatItem label="Cuota" value={Number(pick.odds).toFixed(2)} />
          <StatDivider />
          <StatItem label="Stake" value={`${pick.stake}/10`} />
          <StatDivider />
          <StatItem label="Confianza" value={pick.confidence} />
        </div>

        <Divider />

        <p
          style={{
            fontSize: '0.9375rem',
            color: Theme.Colors.TextSecondary,
            lineHeight: 1.65,
            marginBottom: Theme.Spacing.LG,
          }}
        >
          {pick.analysis}
        </p>

        <div style={{ width: '100%', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(29,158,117,0.15)',
              border: '1.5px solid #1D9E75',
              borderRadius: '999px',
              padding: '8px 24px',
              color: '#1D9E75',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              fontSize: '15px',
            }}
          >
            STAKE {pick.stake}
          </div>
        </div>

        <div style={{textAlign:'center', marginTop:'8px'}}>
          <p style={{fontSize:'11px', color: Theme.Colors.TextSecondary, margin:'0'}}>
            Stake {PICK_DEL_DIA.stake} = Bs {PICK_DEL_DIA.stake * 10} sobre un bank de Bs 1.000
          </p>
          <p style={{fontSize:'11px', color: Theme.Colors.TextSecondary, margin:'4px 0 0'}}>
            Stake 1 = Bs 10 · Stake 5 = Bs 50 · Stake 10 = Bs 100
          </p>
        </div>

        {pick.result !== 'pendiente' && (
          <div style={{ textAlign: 'center', marginTop: Theme.Spacing.MD }}>
            <Badge result={pick.result} />
          </div>
        )}
      </div>
    </section>
  );
}

// ── Sección 2 — Últimos picks ──────────────────────────────────────────────

function SectionHeader({ title, right }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Theme.Spacing.LG,
      }}
    >
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: Theme.Colors.TextInverse }}>
        {title}
      </h2>
      {right}
    </div>
  );
}

function PicksSection() {
  return (
    <section style={{ marginBottom: Theme.Spacing.XXL }}>
      <SectionHeader title="Últimos picks" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: Theme.Spacing.LG }}>
        {MOCK_PICKS.map(pick => (
          <PickCard key={pick.id} {...pick} />
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: Theme.Spacing.XL }}>
        <Button variant="ghost" href="/picks" size="md">
          Ver todos los picks →
        </Button>
      </div>
    </section>
  );
}

// ── Sección 3 — Banner VIP ─────────────────────────────────────────────────

function VipBanner() {
  return (
    <section
      style={{
        background: 'rgba(29,158,117,0.06)',
        border: `1.5px solid ${Theme.Colors.Green}`,
        borderRadius: Theme.Radius.LG,
        padding: Theme.Spacing.XL,
        textAlign: 'center',
        marginBottom: Theme.Spacing.XXL,
      }}
    >
      <h2
        style={{
          fontSize: '1.375rem',
          fontWeight: 700,
          color: Theme.Colors.TextInverse,
          marginBottom: Theme.Spacing.SM,
          letterSpacing: '-0.01em',
        }}
      >
        Accedé a pronósticos premium
      </h2>
      <p
        style={{
          color: Theme.Colors.TextAccent,
          fontSize: '0.9375rem',
          lineHeight: 1.55,
          marginBottom: Theme.Spacing.XL,
        }}
      >
        Análisis detallado, picks VIP y comunidad exclusiva
      </p>
      <Button variant="primary" href="/vip" size="md">
        Suscribirse al VIP
      </Button>
    </section>
  );
}

// ── Sección 4 — Footer ─────────────────────────────────────────────────────

function PageFooter() {
  return (
    <footer
      style={{
        paddingTop: Theme.Spacing.XL,
        paddingBottom: Theme.Spacing.XL,
        borderTop: '0.5px solid rgba(184,212,244,0.1)',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          color: Theme.Colors.TextAccent,
          fontSize: '0.9375rem',
          fontWeight: 600,
          marginBottom: Theme.Spacing.SM,
        }}
      >
        CambaWinner — Pronósticos con datos
      </p>
      <p
        style={{
          color: Theme.Colors.TextMuted,
          fontSize: '0.75rem',
          lineHeight: 1.65,
          maxWidth: '340px',
          margin: '0 auto',
        }}
      >
        Plataforma de análisis deportivo. Las apuestas implican riesgo.
        <br />
        Solo mayores de 18 años. Jugá con responsabilidad.
      </p>
    </footer>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: `${Theme.Spacing.LG} ${Theme.Spacing.LG} 80px`,
      }}
    >
      <PickDelDia />
      <PicksSection />
      <VipBanner />
      <PageFooter />
    </div>
  );
}
