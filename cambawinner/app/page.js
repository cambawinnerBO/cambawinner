import Link from 'next/link';
import MatchesSection from '@/components/home/MatchesSection';
import PickCard from '@/components/picks/PickCard';
import YieldBadge from '@/components/picks/YieldBadge';
import Button from '@/components/ui/Button';
import { Theme } from '@/lib/theme';

// ── Mock data ──────────────────────────────────────────────────────────────

const MOCK_MATCHES = [
  {
    id: 1,
    home: 'Club Bolívar',
    away: 'The Strongest',
    league: 'División Profesional',
    time: '20:00',
    odds: [
      { bookmaker: 'Betano',  odd1: 2.10, oddX: 3.40, odd2: 3.20, affiliateUrl: '#' },
      { bookmaker: 'Betsson', odd1: 2.05, oddX: 3.45, odd2: 3.15, affiliateUrl: '#' },
      { bookmaker: '1xBet',   odd1: 2.08, oddX: 3.35, odd2: 3.25, affiliateUrl: '#' },
    ],
  },
  {
    id: 2,
    home: 'Always Ready',
    away: 'Wilstermann',
    league: 'División Profesional',
    time: '17:00',
    odds: [
      { bookmaker: 'Betano',  odd1: 1.85, oddX: 3.60, odd2: 3.95, affiliateUrl: '#' },
      { bookmaker: 'Betsson', odd1: 1.90, oddX: 3.50, odd2: 3.80, affiliateUrl: '#' },
      { bookmaker: '1xBet',   odd1: 1.88, oddX: 3.55, odd2: 4.00, affiliateUrl: '#' },
    ],
  },
  {
    id: 3,
    home: 'Real Tomayapo',
    away: 'Aurora',
    league: 'División Profesional',
    time: '15:00',
    odds: [
      { bookmaker: 'Betano',  odd1: 2.50, oddX: 3.20, odd2: 2.70, affiliateUrl: '#' },
      { bookmaker: 'Betsson', odd1: 2.45, oddX: 3.25, odd2: 2.75, affiliateUrl: '#' },
      { bookmaker: '1xBet',   odd1: 2.55, oddX: 3.15, odd2: 2.65, affiliateUrl: '#' },
    ],
  },
];

const MOCK_PICKS = [
  {
    id: 1,
    match: 'Bolívar vs The Strongest',
    league: 'División Profesional',
    market: '1X2 — Local gana',
    odds: 2.10,
    stake: 2,
    result: 'ganado',
    analysis: 'Bolívar lleva 6 partidos invicto en casa. The Strongest viene de perder 2 consecutivos de visitante.',
  },
  {
    id: 2,
    match: 'Always Ready vs Wilstermann',
    league: 'División Profesional',
    market: 'Over 2.5 goles',
    odds: 1.95,
    stake: 1.5,
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

// ── Componentes de sección ─────────────────────────────────────────────────

const MONO = { fontFamily: "'JetBrains Mono', monospace" };

function YieldBanner() {
  return (
    <div
      style={{
        background: 'rgba(29,158,117,0.1)',
        border: '1px solid rgba(29,158,117,0.28)',
        borderRadius: Theme.Radius.MD,
        padding: `${Theme.Spacing.MD} ${Theme.Spacing.LG}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: Theme.Spacing.SM,
        marginBottom: Theme.Spacing.XL,
      }}
    >
      <span style={{ color: Theme.Colors.TextInverse, fontSize: '0.875rem' }}>
        <span style={{ ...MONO, fontWeight: 700, color: Theme.Colors.Green }}>
          +{YIELD_STATS.yield}%
        </span>
        {' '}de yield acumulado en{' '}
        <span style={{ ...MONO, fontWeight: 600 }}>{YIELD_STATS.totalPicks}</span>
        {' '}picks verificados
      </span>
      <Link
        href="/track-record"
        style={{
          color: Theme.Colors.Green,
          fontSize: '0.875rem',
          fontWeight: 600,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        Ver track record →
      </Link>
    </div>
  );
}

function SectionHeader({ title, label, right }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Theme.Spacing.LG,
      }}
    >
      <div>
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: Theme.Colors.TextInverse,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>
        {label && (
          <span
            style={{
              fontSize: '0.6875rem',
              color: Theme.Colors.TextSecondary,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'block',
              marginTop: '3px',
            }}
          >
            {label}
          </span>
        )}
      </div>
      {right}
    </div>
  );
}

function PicksSection() {
  return (
    <section style={{ marginTop: Theme.Spacing.XXL }}>
      <SectionHeader
        title="Últimos picks"
        right={
          <YieldBadge
            yield={YIELD_STATS.yield}
            totalPicks={YIELD_STATS.totalPicks}
          />
        }
      />
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

function VipBanner() {
  return (
    <section
      style={{
        marginTop: Theme.Spacing.XXL,
        background: `radial-gradient(ellipse at top right, rgba(29,158,117,0.18) 0%, ${Theme.Colors.Navy} 65%)`,
        border: `1.5px solid ${Theme.Colors.Green}`,
        borderRadius: Theme.Radius.LG,
        padding: `${Theme.Spacing.XL} ${Theme.Spacing.LG}`,
        textAlign: 'center',
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
          maxWidth: '380px',
          margin: `0 auto ${Theme.Spacing.XL}`,
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

function PageFooter() {
  return (
    <footer
      style={{
        marginTop: Theme.Spacing.XXL,
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
        maxWidth: '1100px',
        margin: '0 auto',
        padding: `${Theme.Spacing.LG} ${Theme.Spacing.LG} 0`,
      }}
    >
      <YieldBanner />

      <section>
        <SectionHeader title="Partidos de hoy" label="División Profesional" />
        <MatchesSection matches={MOCK_MATCHES} />
      </section>

      <PicksSection />
      <VipBanner />
      <PageFooter />
    </div>
  );
}
