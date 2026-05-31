'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PickCard from '@/components/picks/PickCard';
import WaterMark from '@/components/ui/WaterMark';
import { Theme } from '@/lib/theme';
import { useAuth } from '@/lib/context/AuthContext';
import { obtenerHistorialVip, obtenerEstadisticasVip } from '@/lib/services/picksService';

const MONO    = { fontFamily: "'JetBrains Mono', monospace" };
const INTER   = { fontFamily: 'Inter, sans-serif' };
const CONTAINER = { maxWidth: '600px', margin: '0 auto', padding: '16px 16px 80px' };

const FILTROS = [
  { key: 'todos',    label: 'Todos'    },
  { key: 'ganados',  label: 'Ganados'  },
  { key: 'perdidos', label: 'Perdidos' },
  { key: 'anulados', label: 'Anulados' },
];

// ── Stats ──────────────────────────────────────────────────────────────────

function StatsRow({ stats }) {
  const NUM = { ...MONO, fontSize: '20px', fontWeight: 600, color: Theme.Colors.Green };
  const LBL = { ...INTER, fontSize: '11px', color: Theme.Colors.TextAccent, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' };
  const DIV = { width: '1px', height: '32px', background: 'rgba(29,158,117,0.2)', flexShrink: 0 };

  if (!stats) return null;
  const yieldVal = stats.yield ?? 0;
  const ganancia = stats.ganancia ?? 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)', borderRadius: Theme.Radius.LG, padding: Theme.Spacing.LG, marginBottom: Theme.Spacing.MD }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={NUM}>{`${yieldVal >= 0 ? '+' : ''}${yieldVal.toFixed(1)}%`}</span>
        <span style={LBL}>Rentabilidad</span>
      </div>
      <div style={DIV} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={NUM}>{stats.totalPicks}</span>
        <span style={LBL}>Picks</span>
      </div>
      <div style={DIV} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={NUM}>{`${ganancia >= 0 ? '+' : ''}Bs ${ganancia}`}</span>
        <span style={LBL}>Ganancia</span>
      </div>
    </div>
  );
}

// ── Barra de resultados ────────────────────────────────────────────────────

function BarraResultados({ stats }) {
  if (!stats || stats.totalPicks === 0) return null;

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', gap: '2px' }}>
        {stats.ganados  > 0 && <div style={{ flex: stats.ganados,  background: '#1D9E75' }} />}
        {stats.perdidos > 0 && <div style={{ flex: stats.perdidos, background: '#D32F2F' }} />}
        {stats.anulados > 0 && <div style={{ flex: stats.anulados, background: '#888780' }} />}
      </div>
      <p style={{ ...INTER, fontSize: '11px', color: '#B8D4F4', textAlign: 'center', marginTop: '6px' }}>
        <span style={{ color: '#1D9E75' }}>{stats.ganados} ganados</span>
        {' · '}
        <span style={{ color: '#D32F2F' }}>{stats.perdidos} perdidos</span>
        {' · '}
        <span style={{ color: '#888780' }}>{stats.anulados} anulados</span>
      </p>
    </div>
  );
}

// ── Filtros ────────────────────────────────────────────────────────────────

function FiltroTabs({ filtro, setFiltro, counts }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '2px' }}>
      {FILTROS.map(({ key, label }) => {
        const activo = filtro === key;
        return (
          <button
            key={key}
            onClick={() => setFiltro(key)}
            style={{ background: activo ? Theme.Colors.Green : 'transparent', color: activo ? '#fff' : Theme.Colors.TextAccent, border: activo ? 'none' : '1px solid rgba(184,212,244,0.3)', borderRadius: '999px', padding: '6px 14px', ...INTER, fontSize: '13px', fontWeight: activo ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {label} ({counts[key] ?? 0})
          </button>
        );
      })}
    </div>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────

function PageFooter() {
  return (
    <footer style={{ paddingTop: '24px', borderTop: '0.5px solid rgba(184,212,244,0.1)', textAlign: 'center' }}>
      <p style={{ ...INTER, color: Theme.Colors.TextMuted, fontSize: '0.75rem', lineHeight: 1.65, maxWidth: '340px', margin: '0 auto' }}>
        Plataforma de análisis deportivo. Las apuestas implican riesgo.
        <br />Solo mayores de 18 años. Jugá con responsabilidad.
      </p>
    </footer>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function HistorialVipPage() {
  const router = useRouter();
  const { usuario, perfil, loading: authLoading } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [stats,     setStats]     = useState(null);
  const [filtro,    setFiltro]    = useState('todos');
  const [loading,   setLoading]   = useState(true);

  const esVip = perfil?.role === 'vip' || perfil?.role === 'admin';

  useEffect(() => {
    if (authLoading) return;
    if (!usuario || !esVip) { router.push('/vip'); return; }

    async function cargar() {
      const [histData, statsData] = await Promise.all([
        obtenerHistorialVip(100),
        obtenerEstadisticasVip(),
      ]);
      setHistorial(histData.data ?? []);
      setStats(statsData);
      setLoading(false);
    }
    cargar();
  }, [authLoading, esVip, usuario]);

  const RESULT_MAP = { ganados: 'ganado', perdidos: 'perdido', anulados: 'anulado' };
  const picksFiltered = filtro === 'todos'
    ? historial
    : historial.filter(p => p.result === RESULT_MAP[filtro]);

  const counts = {
    todos:    historial.length,
    ganados:  historial.filter(p => p.result === 'ganado').length,
    perdidos: historial.filter(p => p.result === 'perdido').length,
    anulados: historial.filter(p => p.result === 'anulado').length,
  };

  if (authLoading || loading) {
    return (
      <div style={{ ...CONTAINER, paddingTop: '60px', textAlign: 'center' }}>
        <p style={{ ...INTER, color: Theme.Colors.TextAccent }}>Cargando…</p>
      </div>
    );
  }

  return (
    <>
      <WaterMark
        username={perfil?.username || perfil?.email || ''}
        email={usuario?.email || ''}
      />
      <div style={CONTAINER}>
        {/* Header */}
        <div style={{ position: 'relative', textAlign: 'center', marginBottom: '24px' }}>
          <Link href="/vip" style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', ...INTER, color: '#B8D4F4', fontSize: '13px', textDecoration: 'none' }}>
            ← Volver
          </Link>
          <h1 style={{ ...INTER, fontSize: '1.25rem', fontWeight: 700, color: Theme.Colors.TextInverse, margin: 0 }}>
            Historial VIP
          </h1>
        </div>

        <StatsRow stats={stats} />
        <BarraResultados stats={stats} />
        <FiltroTabs filtro={filtro} setFiltro={setFiltro} counts={counts} />

        {picksFiltered.length === 0 ? (
          <p style={{ ...INTER, color: Theme.Colors.TextAccent, textAlign: 'center', padding: '20px 0', fontSize: '14px', lineHeight: 1.6 }}>
            {historial.length === 0
              ? 'Los picks resueltos aparecerán aquí cuando marqués resultados desde el panel.'
              : 'No hay picks en esta categoría.'}
          </p>
        ) : (
          picksFiltered.map(pick => (
            <PickCard key={pick.id} {...pick} isPickDelDia={pick.is_pick_del_dia} isVip={true} />
          ))
        )}

        <PageFooter />
      </div>
    </>
  );
}
