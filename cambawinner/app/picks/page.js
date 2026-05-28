'use client';
import { useState, useEffect } from 'react';
import PickCard from '@/components/picks/PickCard';
import Button from '@/components/ui/Button';
import { Theme } from '@/lib/theme';
import { useAuth } from '@/lib/context/AuthContext';
import {
  obtenerHistorialPicks,
  obtenerEstadisticasCompletas,
} from '@/lib/services/picksService';

const MONO = { fontFamily: "'JetBrains Mono', monospace" };

const FILTROS = [
  { key: 'todos',      label: 'Todos' },
  { key: 'ganados',    label: 'Ganados' },
  { key: 'perdidos',   label: 'Perdidos' },
  { key: 'pendientes', label: 'Pendientes' },
];

// ── Stats ──────────────────────────────────────────────────────────────────

function StatsRow({ stats }) {
  const NUM = { ...MONO, fontSize: '20px', fontWeight: 600, color: Theme.Colors.Green };
  const LBL = { fontSize: '11px', color: Theme.Colors.TextAccent, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' };
  const DIV = { width: '1px', height: '32px', background: 'rgba(29,158,117,0.2)', flexShrink: 0 };

  const yieldVal   = stats?.yield ?? 0;
  const isPositive = yieldVal >= 0;
  const ganancia   = stats?.ganancia ?? 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)', borderRadius: Theme.Radius.LG, padding: Theme.Spacing.LG, marginBottom: Theme.Spacing.MD }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={NUM}>{stats ? `${isPositive ? '+' : ''}${yieldVal.toFixed(1)}%` : '…'}</span>
        <span style={LBL}>Rentabilidad</span>
      </div>
      <div style={DIV} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={NUM}>{stats ? stats.totalPicks : '…'}</span>
        <span style={LBL}>Picks</span>
      </div>
      <div style={DIV} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={NUM}>{stats ? `${ganancia >= 0 ? '+' : ''}Bs ${ganancia}` : '…'}</span>
        <span style={LBL}>Ganancia</span>
      </div>
    </div>
  );
}

// ── Barra de resultados ────────────────────────────────────────────────────

function BarraResultados({ stats }) {
  if (!stats || stats.totalPicks === 0) return null;

  const pctGanados  = (stats.ganados  / stats.totalPicks * 100);
  const pctPerdidos = (stats.perdidos / stats.totalPicks * 100);
  const pctAnulados = (stats.anulados / stats.totalPicks * 100);

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', gap: '2px' }}>
        <div style={{ width: pctGanados  + '%', background: '#1D9E75' }} />
        <div style={{ width: pctPerdidos + '%', background: '#D32F2F' }} />
        <div style={{ width: pctAnulados + '%', background: '#888780' }} />
      </div>
      <p style={{ fontSize: '11px', color: '#B8D4F4', textAlign: 'center', marginTop: '6px' }}>
        {stats.ganados} ganados · {stats.perdidos} perdidos · {stats.anulados} anulados
      </p>
    </div>
  );
}

// ── Filtros ────────────────────────────────────────────────────────────────

function FiltroTabs({ filtro, onFiltro, stats }) {
  const counts = {
    todos:      stats?.totalPicks  ?? '…',
    ganados:    stats?.ganados     ?? '…',
    perdidos:   stats?.perdidos    ?? '…',
    pendientes: stats?.pendientes  ?? '…',
  };

  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: Theme.Spacing.LG, overflowX: 'auto', paddingBottom: '2px' }}>
      {FILTROS.map(({ key, label }) => {
        const activo = filtro === key;
        return (
          <button
            key={key}
            onClick={() => onFiltro(key)}
            style={{
              background: activo ? Theme.Colors.Green : 'transparent',
              color: activo ? '#fff' : Theme.Colors.TextAccent,
              border: activo ? 'none' : '1px solid rgba(184,212,244,0.3)',
              borderRadius: '999px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: activo ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {label} ({counts[key]})
          </button>
        );
      })}
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function PickSkeleton() {
  return (
    <div style={{ background: Theme.Colors.Surface, borderRadius: Theme.Radius.MD, padding: '16px', marginBottom: '10px', border: '0.5px solid rgba(10,37,64,0.08)' }}>
      {[{ w: '70%', h: '16px' }, { w: '50%', h: '12px' }, { w: '40%', h: '12px' }, { w: '100%', h: '56px' }].map((s, i) => (
        <div key={i} style={{ width: s.w, height: s.h, background: '#e8eaed', borderRadius: '4px', marginBottom: '8px' }} />
      ))}
    </div>
  );
}

// ── Banner VIP ─────────────────────────────────────────────────────────────

function VipBannerPicks() {
  return (
    <section style={{ background: 'rgba(29,158,117,0.06)', border: `1.5px solid ${Theme.Colors.Green}`, borderRadius: Theme.Radius.LG, padding: Theme.Spacing.XL, textAlign: 'center', margin: `${Theme.Spacing.XL} 0` }}>
      <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: Theme.Colors.TextInverse, marginBottom: Theme.Spacing.SM }}>
        ¿Querés picks antes que nadie?
      </h2>
      <p style={{ color: Theme.Colors.TextAccent, fontSize: '0.9375rem', lineHeight: 1.55, marginBottom: Theme.Spacing.LG }}>
        Los suscriptores VIP reciben análisis extendido y picks exclusivos.
      </p>
      <Button variant="primary" href="/vip" size="md">Suscribirse al VIP</Button>
    </section>
  );
}

// ── Muro de registro ───────────────────────────────────────────────────────

function MuroRegistro() {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', background: 'rgba(29,158,117,0.05)', border: '1px solid rgba(29,158,117,0.2)', borderRadius: '12px', margin: '16px 0' }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 600, color: '#F5F7FA', margin: '0 0 8px' }}>
        Accede o registrate para ver el historial
      </p>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#B8D4F4', margin: '0 0 24px', lineHeight: 1.5 }}>
        Accedé gratis a todos los picks publicados con sus resultados y análisis.
        Sin costo, sin compromiso.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '280px', margin: '0 auto' }}>
        <a href="/registro" style={{ background: '#1D9E75', color: 'white', padding: '12px 24px', borderRadius: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px', textDecoration: 'none', textAlign: 'center' }}>
          Crear cuenta gratis
        </a>
        <a href="/login" style={{ background: 'transparent', color: '#1D9E75', border: '1px solid #1D9E75', padding: '12px 24px', borderRadius: '8px', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '15px', textDecoration: 'none', textAlign: 'center' }}>
          Ya tengo cuenta
        </a>
      </div>
    </div>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────

function PageFooter() {
  return (
    <footer style={{ paddingTop: Theme.Spacing.XL, paddingBottom: Theme.Spacing.XL, borderTop: '0.5px solid rgba(184,212,244,0.1)', textAlign: 'center' }}>
      <p style={{ color: Theme.Colors.TextMuted, fontSize: '0.75rem', lineHeight: 1.65, maxWidth: '340px', margin: '0 auto' }}>
        Plataforma de análisis deportivo. Las apuestas implican riesgo.
        <br />Solo mayores de 18 años. Jugá con responsabilidad.
      </p>
    </footer>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

const CONTAINER = { maxWidth: '600px', margin: '0 auto', padding: `16px 16px 80px` };

function TituloPagina() {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#F5F7FA', marginBottom: '4px' }}>
        Historial de picks
      </h1>
      <p style={{ fontSize: '12px', color: '#B8D4F4', margin: 0 }}>
        Todos los pronósticos publicados con resultado verificable
      </p>
    </div>
  );
}

export default function PicksPage() {
  const { usuario, loading: authLoading } = useAuth();
  const [picks,   setPicks]   = useState([]);
  const [stats,   setStats]   = useState(null);
  const [filtro,  setFiltro]  = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuario) return;
    obtenerEstadisticasCompletas().then(setStats);
  }, [usuario]);

  useEffect(() => {
    if (!usuario) return;
    async function cargarPicks() {
      setLoading(true);
      const { data } = await obtenerHistorialPicks(filtro);
      setPicks(data ?? []);
      setLoading(false);
    }
    cargarPicks();
  }, [filtro, usuario]);

  if (!authLoading && !usuario) {
    return (
      <div style={CONTAINER}>
        <TituloPagina />
        <MuroRegistro />
      </div>
    );
  }

  return (
    <div style={CONTAINER}>
      <TituloPagina />

      <StatsRow stats={stats} />
      <BarraResultados stats={stats} />
      <FiltroTabs filtro={filtro} onFiltro={setFiltro} stats={stats} />

      {authLoading || loading ? (
        [0, 1, 2].map(i => <PickSkeleton key={i} />)
      ) : picks.length === 0 ? (
        <p style={{ color: Theme.Colors.TextAccent, fontSize: '0.9375rem', textAlign: 'center', padding: `${Theme.Spacing.XL} 0` }}>
          No hay picks en esta categoría.
        </p>
      ) : (
        picks.map(pick => <PickCard key={pick.id} {...pick} />)
      )}

      <VipBannerPicks />
      <PageFooter />
    </div>
  );
}
