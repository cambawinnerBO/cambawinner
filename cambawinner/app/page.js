'use client';
import { useState, useEffect } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import PickCard from '@/components/picks/PickCard';
import Temporizador from '@/components/picks/Temporizador';
import { Theme } from '@/lib/theme';
import {
  obtenerPickDelDia,
  obtenerUltimosPicks,
} from '@/lib/services/picksService';

// ── Helpers ────────────────────────────────────────────────────────────────

const MONO = { fontFamily: "'JetBrains Mono', monospace" };

function formatearFechaBolivia(fechaISO) {
  if (!fechaISO) return 'Hora por confirmar';
  const fecha = new Date(fechaISO);
  const hora = fecha.toLocaleTimeString('es-BO', {
    timeZone: 'America/La_Paz',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const hoy = new Date();
  const fechaLocal = new Date(fecha.toLocaleString('en-US', { timeZone: 'America/La_Paz' }));
  const hoyLocal   = new Date(hoy.toLocaleString('en-US',   { timeZone: 'America/La_Paz' }));
  const esHoy      = fechaLocal.toDateString() === hoyLocal.toDateString();
  const mañana     = new Date(hoyLocal);
  mañana.setDate(mañana.getDate() + 1);
  const esMañana   = fechaLocal.toDateString() === mañana.toDateString();

  if (esHoy)    return `Hoy · ${hora}`;
  if (esMañana) return `Mañana · ${hora}`;
  const dia = fechaLocal.toLocaleDateString('es-BO', { day: 'numeric', month: 'short' });
  return `${dia} · ${hora}`;
}

function Divider() {
  return <div style={{ height: '1px', background: 'rgba(10,37,64,0.08)', margin: `${Theme.Spacing.LG} 0` }} />;
}

function StatItem({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', flex: 1 }}>
      <span style={{ fontSize: '10px', color: Theme.Colors.TextSecondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ ...MONO, fontSize: '1.125rem', fontWeight: 700, color: Theme.Colors.TextPrimary }}>{value}</span>
    </div>
  );
}

function StatDivider() {
  return <div style={{ width: '1px', height: '32px', background: 'rgba(10,37,64,0.1)', flexShrink: 0 }} />;
}

// ── Skeleton del card ──────────────────────────────────────────────────────

function SkeletonBloque({ w, h }) {
  return <div style={{ width: w, height: h, background: '#e8eaed', borderRadius: '6px', flexShrink: 0 }} />;
}

function PickDelDiaSkeleton() {
  return (
    <div style={{ background: Theme.Colors.Surface, borderRadius: Theme.Radius.LG, boxShadow: '0 4px 24px rgba(10,37,64,0.15)', padding: Theme.Spacing.XL }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
        <SkeletonBloque w="110px" h="22px" />
        <SkeletonBloque w="240px" h="28px" />
        <SkeletonBloque w="160px" h="14px" />
        <SkeletonBloque w="180px" h="18px" />
        <div style={{ display: 'flex', gap: '24px', marginTop: '4px' }}>
          <SkeletonBloque w="60px" h="40px" />
          <SkeletonBloque w="60px" h="40px" />
          <SkeletonBloque w="60px" h="40px" />
        </div>
        <SkeletonBloque w="100%" h="72px" />
        <SkeletonBloque w="120px" h="36px" />
      </div>
    </div>
  );
}

// ── Estado vacío sin pick del día ──────────────────────────────────────────

function PickDelDiaVacio() {
  return (
    <div style={{ background: Theme.Colors.Surface, borderRadius: Theme.Radius.LG, boxShadow: '0 4px 24px rgba(10,37,64,0.15)', padding: Theme.Spacing.XL, textAlign: 'center' }}>
      <p style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</p>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: Theme.Colors.TextPrimary, marginBottom: '8px' }}>
        Próximo pick en camino...
      </h2>
      <p style={{ fontSize: '0.9375rem', color: Theme.Colors.TextSecondary, lineHeight: 1.55, margin: 0 }}>
        El análisis de hoy se publicará pronto.
      </p>
    </div>
  );
}

// ── Card del Pick del Día ──────────────────────────────────────────────────

function PickDelDiaCard({ pick }) {
  const fechaFormateada = formatearFechaBolivia(pick.match_date);

  return (
    <div style={{ background: Theme.Colors.Surface, borderRadius: Theme.Radius.LG, boxShadow: '0 4px 24px rgba(10,37,64,0.15)', padding: Theme.Spacing.XL }}>
      <div style={{ textAlign: 'center', marginBottom: Theme.Spacing.LG }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(29,158,117,0.12)', color: Theme.Colors.Green, borderRadius: '9999px', padding: '4px 14px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          ⚡ PICK DEL DÍA
        </span>
      </div>

      <h2 style={{ fontSize: '1.375rem', fontWeight: 600, color: Theme.Colors.TextPrimary, textAlign: 'center', lineHeight: 1.25, marginBottom: Theme.Spacing.XS }}>
        {pick.match}
      </h2>

      <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: Theme.Colors.TextSecondary, marginBottom: Theme.Spacing.LG }}>
        {pick.league}{fechaFormateada ? ` · ${fechaFormateada}` : ''}
      </p>

      <p style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 500, color: Theme.Colors.TextPrimary, marginBottom: Theme.Spacing.LG }}>
        {pick.market}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Theme.Spacing.MD }}>
        <StatItem label="Cuota"     value={Number(pick.odds).toFixed(2)} />
        <StatDivider />
        <StatItem label="Stake"     value={`${pick.stake}/10`} />
        <StatDivider />
        <StatItem label="Confianza" value={pick.confidence ?? '—'} />
      </div>

      <Divider />

      <p style={{ fontSize: '0.9375rem', color: Theme.Colors.TextSecondary, lineHeight: 1.65, marginBottom: Theme.Spacing.LG }}>
        {pick.analysis}
      </p>

      <Temporizador matchDate={pick.match_date} result={pick.result} />

      <div style={{ textAlign: 'center', marginTop: '8px' }}>
        <p style={{ fontSize: '11px', color: Theme.Colors.TextSecondary, margin: '0' }}>
          Stake {pick.stake} = Bs {pick.stake * 10} sobre un bank de Bs 1.000
        </p>
        <p style={{ fontSize: '11px', color: Theme.Colors.TextSecondary, margin: '4px 0 0' }}>
          Stake 1 = Bs 10 · Stake {Math.round(pick.stake / 2)} = Bs {Math.round(pick.stake / 2) * 10} · Stake {pick.stake} = Bs {pick.stake * 10}
        </p>
      </div>

      {pick.result && pick.result !== 'pendiente' && (
        <div style={{ textAlign: 'center', marginTop: Theme.Spacing.MD }}>
          <Badge result={pick.result} />
        </div>
      )}
    </div>
  );
}

// ── Sección 1 — Pick del Día ───────────────────────────────────────────────

function SeccionPickDelDia({ pick, loading }) {
  return (
    <section style={{ marginBottom: Theme.Spacing.XXL }}>
      {loading
        ? <PickDelDiaSkeleton />
        : pick
          ? <PickDelDiaCard pick={pick} />
          : <PickDelDiaVacio />
      }
    </section>
  );
}

// ── Sección 2 — Últimos picks ──────────────────────────────────────────────

function SeccionUltimosPicks({ picks, loading }) {
  return (
    <section style={{ marginBottom: Theme.Spacing.XXL }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Theme.Spacing.LG }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: Theme.Colors.TextInverse }}>Últimos picks</h2>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: Theme.Spacing.LG }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ background: Theme.Colors.Surface, borderRadius: Theme.Radius.MD, height: '80px' }} />
          ))}
        </div>
      ) : picks.length === 0 ? (
        <p style={{ color: Theme.Colors.TextAccent, fontSize: '0.9375rem', textAlign: 'center', padding: `${Theme.Spacing.XL} 0` }}>
          Aún no hay picks publicados.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: Theme.Spacing.LG }}>
          {picks.map(pick => (
            <PickCard key={pick.id} {...pick} />
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: Theme.Spacing.XL }}>
        <Button variant="ghost" href="/picks" size="md">Ver todos los picks →</Button>
      </div>
    </section>
  );
}

// ── Sección 3 — Banner VIP ─────────────────────────────────────────────────

function VipBanner() {
  return (
    <section style={{ background: 'rgba(29,158,117,0.06)', border: `1.5px solid ${Theme.Colors.Green}`, borderRadius: Theme.Radius.LG, padding: Theme.Spacing.XL, textAlign: 'center', marginBottom: Theme.Spacing.XXL }}>
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: Theme.Colors.TextInverse, marginBottom: Theme.Spacing.SM, letterSpacing: '-0.01em' }}>
        Accedé a pronósticos premium
      </h2>
      <p style={{ color: Theme.Colors.TextAccent, fontSize: '0.9375rem', lineHeight: 1.55, marginBottom: Theme.Spacing.XL }}>
        Análisis detallado, picks VIP y comunidad exclusiva
      </p>
      <Button variant="primary" href="/vip" size="md">Suscribirse al VIP</Button>
    </section>
  );
}

// ── Sección 4 — Footer ─────────────────────────────────────────────────────

function PageFooter() {
  return (
    <footer style={{ paddingTop: Theme.Spacing.XL, paddingBottom: Theme.Spacing.XL, borderTop: '0.5px solid rgba(184,212,244,0.1)', textAlign: 'center' }}>
      <p style={{ color: Theme.Colors.TextAccent, fontSize: '0.9375rem', fontWeight: 600, marginBottom: Theme.Spacing.SM }}>
        CambaWinner — Pronósticos con datos
      </p>
      <p style={{ color: Theme.Colors.TextMuted, fontSize: '0.75rem', lineHeight: 1.65, maxWidth: '340px', margin: '0 auto' }}>
        Plataforma de análisis deportivo. Las apuestas implican riesgo.
        <br />Solo mayores de 18 años. Jugá con responsabilidad.
      </p>
    </footer>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [pickDelDia,   setPickDelDia]   = useState(null);
  const [ultimosPicks, setUltimosPicks] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      const [pick, picks] = await Promise.all([
        obtenerPickDelDia(),
        obtenerUltimosPicks(3),
      ]);
      setPickDelDia(pick.data);
      setUltimosPicks(picks.data ?? []);
      setLoading(false);
    }
    cargarDatos();
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: `${Theme.Spacing.LG} ${Theme.Spacing.LG} 80px` }}>
      <SeccionPickDelDia pick={pickDelDia} loading={loading} />
      <SeccionUltimosPicks picks={ultimosPicks} loading={loading} />
      <VipBanner />
      <PageFooter />
    </div>
  );
}
