'use client';
import { useState, useEffect } from 'react';

const MONO = { fontFamily: "'JetBrains Mono', monospace" };

const RESULTADO = {
  ganado:  { bg: 'rgba(29,158,117,0.1)',  border: '#1D9E75', color: '#1D9E75', icono: '✓', label: 'GANADO'  },
  perdido: { bg: 'rgba(211,47,47,0.08)',  border: '#D32F2F', color: '#D32F2F', icono: '✗', label: 'PERDIDO' },
  anulado: { bg: 'rgba(136,135,128,0.1)', border: '#888780', color: '#888780', icono: '—', label: 'ANULADO' },
};

function BadgeResultado({ result }) {
  const cfg = RESULTADO[result];
  if (!cfg) return null;
  return (
    <div style={{ textAlign: 'center', margin: '8px 0' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: cfg.bg, border: `1.5px solid ${cfg.border}`, borderRadius: '999px', padding: '10px 24px' }}>
        <span style={{ fontSize: '14px', fontWeight: 900, color: cfg.color, fontFamily: 'Inter, sans-serif' }}>{cfg.icono}</span>
        <span style={{ ...MONO, fontSize: '15px', fontWeight: 700, color: cfg.color, letterSpacing: '0.08em' }}>{cfg.label}</span>
      </div>
    </div>
  );
}

export default function Temporizador({ matchDate, result }) {
  const [tiempo, setTiempo] = useState(null);

  useEffect(() => {
    if (!matchDate) return;

    const intervalo = setInterval(() => {
      const ahora   = new Date();
      const partido = new Date(matchDate);
      const diff    = partido - ahora;

      if (diff > 0) {
        const horas    = Math.floor(diff / 3600000);
        const minutos  = Math.floor((diff % 3600000) / 60000);
        const segundos = Math.floor((diff % 60000) / 1000);
        setTiempo({ tipo: 'cuenta', horas, minutos, segundos });
      } else {
        setTiempo({ tipo: 'jugando' });
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [matchDate]);

  if (!matchDate) return null;

  if (result && result !== 'pendiente') {
    return <BadgeResultado result={result} />;
  }

  if (!tiempo) return null;

  if (tiempo.tipo === 'jugando') {
    return (
      <div style={{ textAlign: 'center', margin: '8px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '999px', padding: '4px 12px', width: 'fit-content' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#DC2626', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <span style={{ ...MONO, fontSize: '11px', fontWeight: 600, color: '#DC2626', letterSpacing: '0.05em' }}>EN JUEGO</span>
        </div>
      </div>
    );
  }

  const { horas, minutos, segundos } = tiempo;
  return (
    <div style={{ textAlign: 'center', margin: '6px 0' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(29,158,117,0.12)', border: '1px solid #1D9E75', borderRadius: '999px', padding: '5px 16px' }}>
        <span style={{ fontSize: '10px', color: '#0A2540', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, opacity: 0.6 }}>Empieza en</span>
        <span style={{ ...MONO, fontSize: '14px', fontWeight: 700, color: '#0F6E56', letterSpacing: '0.05em' }}>
          {String(horas).padStart(2, '0')}:{String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
