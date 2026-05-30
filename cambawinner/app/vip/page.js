'use client';
import { useState, useEffect } from 'react';
import PickCard from '@/components/picks/PickCard';
import ModalTerminos from '@/components/ui/ModalTerminos';
import WaterMark from '@/components/ui/WaterMark';
import { Theme } from '@/lib/theme';
import { useAuth } from '@/lib/context/AuthContext';
import { useSettings } from '@/lib/hooks/useSettings';
import {
  obtenerPickDelDia,
  obtenerPicksRecomendadosVip,
} from '@/lib/services/picksService';

const MONO    = { fontFamily: "'JetBrains Mono', monospace" };
const INTER   = { fontFamily: 'Inter, sans-serif' };
const CONTAINER = { maxWidth: '600px', margin: '0 auto', padding: '16px 16px 80px' };

// ── Utilidades ─────────────────────────────────────────────────────────────

function Divider() {
  return <div style={{ height: '1px', background: 'rgba(184,212,244,0.1)', margin: '24px 0' }} />;
}

function SectionLabel({ children }) {
  return (
    <p style={{ ...INTER, fontSize: '11px', fontWeight: 700, color: Theme.Colors.TextAccent, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
      {children}
    </p>
  );
}

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

// ── Vista 1 — Suscripción ──────────────────────────────────────────────────

const BENEFICIOS = [
  { icono: '⚡', texto: 'Pick del día VIP exclusivo' },
  { icono: '⭐', texto: 'Picks recomendados adicionales' },
  { icono: '📊', texto: 'Análisis extendido y detallado' },
  { icono: '🔒', texto: 'Contenido antes que nadie' },
  { icono: '📱', texto: 'Avisos por canal de WhatsApp' },
];

const FAQ_ITEMS = [
  { q: '¿Cómo recibo los picks VIP?', r: 'En la sección VIP de la web, accesible con tu cuenta una vez activado el acceso.' },
  { q: '¿Puedo cancelar cuando quiera?', r: 'Sí, sin compromiso. Tu acceso dura lo que dura el plan contratado.' },
  { q: '¿Qué métodos de pago aceptan?', r: 'Tigo Money, QR bancario y transferencia.' },
];

function VistaSubscripcion({ settings }) {
  const [plan,    setPlan]    = useState('mensual');
  const [nombre,  setNombre]  = useState('');
  const [usuario, setUsuario] = useState('');
  const [correo,  setCorreo]  = useState('');
  const [error,   setError]   = useState(null);

  function handleSuscribirse() {
    if (!nombre.trim() || !usuario.trim() || !correo.trim()) {
      return setError('Completá todos los campos antes de continuar.');
    }
    setError(null);
    const planTexto = plan === 'semanal'
      ? `Plan Semanal - Bs ${settings.precio_semanal}`
      : `Plan Mensual - Bs ${settings.precio_mensual}`;
    const mensaje =
      `Hola! Quiero suscribirme al VIP de CambaWinner 🎯\n\n` +
      `Nombre: ${nombre}\n` +
      `Usuario: ${usuario}\n` +
      `Correo: ${correo}\n` +
      `Plan: ${planTexto}\n\n` +
      `Quedo a la espera para coordinar el pago.`;
    window.open(`https://wa.me/${settings.whatsapp_numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
  }

  const inputStyle = {
    ...INTER, background: '#fff', border: '1px solid rgba(10,37,64,0.15)', borderRadius: '8px',
    padding: '10px 12px', fontSize: '15px', color: Theme.Colors.TextPrimary,
    width: '100%', boxSizing: 'border-box', outline: 'none',
  };

  const planCard = (key, titulo, precio, periodo, destacado, ahorro) => {
    const sel = plan === key;
    return (
      <div
        key={key}
        onClick={() => setPlan(key)}
        style={{
          flex: 1, minWidth: '140px', background: '#fff', borderRadius: '10px', padding: '16px',
          border: sel
            ? `2px solid ${Theme.Colors.Green}`
            : destacado
              ? `1.5px solid ${Theme.Colors.Green}`
              : '1.5px solid rgba(10,37,64,0.12)',
          cursor: 'pointer', position: 'relative', textAlign: 'center',
          boxShadow: sel ? '0 0 0 3px rgba(29,158,117,0.15)' : 'none',
          transition: 'box-shadow 0.15s',
        }}
      >
        {destacado && (
          <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: Theme.Colors.Green, color: '#fff', borderRadius: '999px', padding: '2px 10px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            MÁS POPULAR
          </div>
        )}
        <p style={{ ...INTER, fontSize: '13px', fontWeight: 600, color: Theme.Colors.TextPrimary, margin: '0 0 8px' }}>{titulo}</p>
        <p style={{ ...MONO, fontSize: '26px', fontWeight: 700, color: Theme.Colors.Green, margin: '0 0 2px' }}>Bs {precio}</p>
        <p style={{ ...INTER, fontSize: '12px', color: Theme.Colors.TextSecondary, margin: 0 }}>{periodo}</p>
        {ahorro && <p style={{ ...INTER, fontSize: '11px', color: Theme.Colors.Green, margin: '6px 0 0' }}>{ahorro}</p>}
      </div>
    );
  };

  const ahorroPct = settings.precio_semanal > 0
    ? Math.round((1 - (settings.precio_mensual / (settings.precio_semanal * 4))) * 100)
    : 0;

  return (
    <div style={CONTAINER}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.3)', borderRadius: '999px', padding: '4px 14px', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px' }}>🔒</span>
          <span style={{ ...INTER, fontSize: '11px', fontWeight: 700, color: Theme.Colors.Green, textTransform: 'uppercase', letterSpacing: '0.08em' }}>CambaWinner VIP</span>
        </div>
        <h1 style={{ ...INTER, fontSize: '1.5rem', fontWeight: 700, color: Theme.Colors.TextInverse, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Pronósticos exclusivos
        </h1>
        <p style={{ ...INTER, fontSize: '14px', color: Theme.Colors.TextAccent, margin: 0, lineHeight: 1.5 }}>
          Accedé a picks VIP con análisis extendido
        </p>
      </div>

      {/* Beneficios */}
      <div style={{ background: Theme.Colors.Surface, borderRadius: Theme.Radius.LG, padding: '16px', marginBottom: '20px' }}>
        <p style={{ ...INTER, fontSize: '11px', fontWeight: 700, color: Theme.Colors.TextPrimary, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px', textAlign: 'center' }}>Qué incluye el VIP</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {BENEFICIOS.map(({ icono, texto }) => (
            <div key={texto} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>{icono}</span>
              <span style={{ ...INTER, fontSize: '14px', color: Theme.Colors.TextPrimary }}>{texto}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Planes */}
      <div style={{ marginBottom: '20px' }}>
        <SectionLabel>Elegí tu plan</SectionLabel>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {planCard('semanal', 'Plan Semanal', settings.precio_semanal, 'por semana', false, null)}
          {planCard('mensual', 'Plan Mensual', settings.precio_mensual, 'por mes', true,
            ahorroPct > 0 ? `Ahorrás ${ahorroPct}% vs semanal` : 'Mejor precio'
          )}
        </div>
      </div>

      {/* Formulario */}
      <div style={{ background: Theme.Colors.Surface, borderRadius: Theme.Radius.LG, padding: '16px', marginBottom: '16px' }}>
        <SectionLabel>Tus datos</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ ...INTER, fontSize: '11px', fontWeight: 600, color: Theme.Colors.TextSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Nombre completo *</label>
            <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" style={inputStyle} />
          </div>
          <div>
            <label style={{ ...INTER, fontSize: '11px', fontWeight: 600, color: Theme.Colors.TextSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Nombre de usuario *</label>
            <input value={usuario} onChange={e => setUsuario(e.target.value)} placeholder="@usuario" style={inputStyle} />
          </div>
          <div>
            <label style={{ ...INTER, fontSize: '11px', fontWeight: 600, color: Theme.Colors.TextSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Correo electrónico *</label>
            <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="tu@email.com" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p style={{ ...INTER, fontSize: '13px', color: Theme.Colors.Error, background: 'rgba(211,47,47,0.08)', border: `1px solid ${Theme.Colors.Error}`, borderRadius: '6px', padding: '10px 12px', margin: '0 0 12px' }}>
          {error}
        </p>
      )}

      {/* Botón WhatsApp */}
      <button
        onClick={handleSuscribirse}
        style={{ ...INTER, width: '100%', background: '#25D366', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', marginBottom: '12px' }}
      >
        📱 Suscribirme por WhatsApp
      </button>

      {/* Nota confianza */}
      <p style={{ ...INTER, fontSize: '12px', color: Theme.Colors.TextAccent, textAlign: 'center', lineHeight: 1.55, margin: '0 0 24px' }}>
        Coordinamos el pago por WhatsApp. Una vez confirmado, activamos tu acceso VIP en minutos.
      </p>

      <Divider />

      {/* FAQ */}
      <div style={{ marginBottom: '24px' }}>
        <SectionLabel>Preguntas frecuentes</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQ_ITEMS.map(({ q, r }) => (
            <div key={q} style={{ background: Theme.Colors.Surface, borderRadius: Theme.Radius.MD, padding: '12px 14px' }}>
              <p style={{ ...INTER, fontSize: '13px', fontWeight: 600, color: Theme.Colors.TextPrimary, margin: '0 0 4px' }}>{q}</p>
              <p style={{ ...INTER, fontSize: '13px', color: Theme.Colors.TextSecondary, margin: 0, lineHeight: 1.5 }}>{r}</p>
            </div>
          ))}
        </div>
      </div>

      <PageFooter />
    </div>
  );
}

// ── Vista 2 — Zona VIP ─────────────────────────────────────────────────────

function VistaVip() {
  const { usuario, perfil } = useAuth();
  const [pickDelDia,        setPickDelDia]        = useState(null);
  const [picksRecomendados, setPicksRecomendados] = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [terminosLocales,   setTerminosLocales]   = useState(false);

  const debeVerTerminos = perfil?.role === 'vip' && !perfil?.terminos_aceptados && !terminosLocales;

  useEffect(() => {
    async function cargar() {
      const [dia, rec] = await Promise.all([
        obtenerPickDelDia(true),
        obtenerPicksRecomendadosVip(),
      ]);
      setPickDelDia(dia.data);
      setPicksRecomendados(rec.data ?? []);
      setLoading(false);
    }
    cargar();
  }, []);

  return (
    <>
      <WaterMark
        username={perfil?.username || perfil?.email || ''}
        email={usuario?.email || ''}
      />
      {debeVerTerminos && (
        <ModalTerminos
          userId={usuario?.id}
          onAceptar={() => setTerminosLocales(true)}
        />
      )}
    <div style={CONTAINER}>
      {/* Header VIP */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(29,158,117,0.12)', border: '1px solid rgba(29,158,117,0.4)', borderRadius: '999px', padding: '4px 14px', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px' }}>🔒</span>
          <span style={{ ...INTER, fontSize: '11px', fontWeight: 700, color: Theme.Colors.Green, textTransform: 'uppercase', letterSpacing: '0.08em' }}>ZONA VIP</span>
        </div>
        <h1 style={{ ...INTER, fontSize: '1.5rem', fontWeight: 700, color: Theme.Colors.TextInverse, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          Tus picks exclusivos
        </h1>
        <p style={{ ...INTER, fontSize: '13px', color: Theme.Colors.TextAccent, margin: 0 }}>
          Contenido premium solo para suscriptores
        </p>
      </div>

      {/* Pick del día VIP */}
      <div style={{ marginBottom: '24px' }}>
        <SectionLabel>⚡ Pick del día VIP</SectionLabel>
        {loading ? (
          <div style={{ background: Theme.Colors.Surface, borderRadius: Theme.Radius.MD, height: '120px', border: '0.5px solid rgba(10,37,64,0.08)' }} />
        ) : pickDelDia ? (
          <PickCard {...pickDelDia} isPickDelDia={true} isVip={true} />
        ) : (
          <div style={{ background: Theme.Colors.Surface, borderRadius: Theme.Radius.LG, padding: '28px 20px', textAlign: 'center', border: '0.5px solid rgba(29,158,117,0.2)' }}>
            <p style={{ fontSize: '28px', margin: '0 0 10px' }}>🔒</p>
            <p style={{ ...INTER, fontSize: '15px', fontWeight: 600, color: Theme.Colors.TextPrimary, margin: '0 0 6px' }}>Pick VIP en camino</p>
            <p style={{ ...INTER, fontSize: '13px', color: Theme.Colors.TextSecondary, margin: 0, lineHeight: 1.55 }}>
              Se publicará pronto. Seguí el canal de WhatsApp para recibir el aviso.
            </p>
          </div>
        )}
      </div>

      {/* Picks recomendados VIP */}
      <div style={{ marginBottom: '24px' }}>
        <SectionLabel>★ Picks recomendados VIP</SectionLabel>
        {loading ? (
          [0, 1].map(i => (
            <div key={i} style={{ background: Theme.Colors.Surface, borderRadius: Theme.Radius.MD, height: '80px', marginBottom: '10px', border: '0.5px solid rgba(10,37,64,0.08)' }} />
          ))
        ) : picksRecomendados.length === 0 ? (
          <p style={{ ...INTER, fontSize: '14px', color: Theme.Colors.TextAccent, textAlign: 'center', padding: '20px 0' }}>
            Los picks recomendados VIP aparecerán aquí.
          </p>
        ) : (
          picksRecomendados.map(pick => (
            <PickCard key={pick.id} {...pick} isPickDelDia={false} isVip={true} />
          ))
        )}
      </div>

      {/* Separador */}
      <div style={{ textAlign: 'center', margin: '16px 0 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ flex: 1, height: '1px', background: 'rgba(184,212,244,0.1)' }} />
        <a href="/picks" style={{ ...INTER, fontSize: '12px', color: Theme.Colors.TextAccent, textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Ver picks free →
        </a>
        <div style={{ flex: 1, height: '1px', background: 'rgba(184,212,244,0.1)' }} />
      </div>

      <PageFooter />
    </div>
    </>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function VipPage() {
  const { perfil, loading: authLoading } = useAuth();
  const { settings } = useSettings();

  const esVipUser = perfil?.role === 'vip' || perfil?.role === 'admin';

  if (authLoading) {
    return (
      <div style={{ ...CONTAINER, textAlign: 'center', paddingTop: '60px' }}>
        <p style={{ ...INTER, color: Theme.Colors.TextAccent }}>Cargando…</p>
      </div>
    );
  }

  if (esVipUser) return <VistaVip />;
  return <VistaSubscripcion settings={settings} />;
}
