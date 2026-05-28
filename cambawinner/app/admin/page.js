'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Theme } from '@/lib/theme';
import {
  publicarPick,
  obtenerPicksPendientes,
  marcarResultado,
  obtenerUltimosPicks,
} from '@/lib/services/picksService';
import {
  obtenerTodosLosUsuarios,
  activarVip,
  revocarVip,
} from '@/lib/services/adminService';

const TABS   = ['Pick del Día', 'Picks', 'Resultados', 'Usuarios VIP'];
const MONO   = { fontFamily: "'JetBrains Mono', monospace" };
const inputS = {
  background: '#fff',
  border: '1px solid rgba(10,37,64,0.15)',
  borderRadius: '6px',
  padding: '9px 12px',
  fontSize: '14px',
  color: Theme.Colors.TextPrimary,
  width: '100%',
  boxSizing: 'border-box',
};

// ── Primitivos ─────────────────────────────────────────────────

function Card({ children, style }) {
  return (
    <div style={{ background: Theme.Colors.Surface, borderRadius: Theme.Radius.LG, padding: '20px', marginBottom: '12px', ...style }}>
      {children}
    </div>
  );
}

function Alert({ text, type = 'error' }) {
  if (!text) return null;
  const ok = type === 'success';
  return (
    <p style={{ fontSize: '13px', color: ok ? Theme.Colors.Green : Theme.Colors.Error, background: ok ? 'rgba(29,158,117,0.08)' : 'rgba(211,47,47,0.08)', border: `1px solid ${ok ? Theme.Colors.Green : Theme.Colors.Error}`, borderRadius: '6px', padding: '9px 12px', margin: '10px 0 0' }}>
      {text}
    </p>
  );
}

function Label({ children }) {
  return <label style={{ fontSize: '11px', fontWeight: 600, color: Theme.Colors.TextSecondary, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>{children}</label>;
}

function Field({ label, children }) {
  return <div style={{ marginBottom: '12px' }}><Label>{label}</Label>{children}</div>;
}

function OutlineBtn({ label, color, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ background: 'transparent', border: `1.5px solid ${color}`, color, borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap' }}>
      {label}
    </button>
  );
}

function RoleBadge({ role }) {
  const c = { admin: Theme.Colors.Warning, vip: Theme.Colors.Green, free: Theme.Colors.Muted };
  const col = c[role] ?? Theme.Colors.Muted;
  return (
    <span style={{ background: `${col}22`, color: col, border: `1px solid ${col}`, borderRadius: '9999px', padding: '2px 8px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
      {role}
    </span>
  );
}

function ResultChip({ result }) {
  const c = { ganado: Theme.Colors.Success, perdido: Theme.Colors.Error, pendiente: Theme.Colors.Warning, anulado: Theme.Colors.Muted };
  return <span style={{ fontSize: '11px', fontWeight: 700, color: c[result] ?? Theme.Colors.Muted, textTransform: 'uppercase', marginLeft: '6px' }}>{result}</span>;
}

// ── Formulario de pick (compartido Tab1 y Tab2) ────────────────

function boliviaToUTC(fechaLocal) {
  if (!fechaLocal) return null;
  const fecha = new Date(fechaLocal);
  const utc   = new Date(fecha.getTime() + (4 * 60 * 60 * 1000));
  return utc.toISOString();
}

const FORM0 = { match: '', league: '', match_date: '', market: '', odds: '', stake: '3', confidence: 'Alta', analysis: '', is_vip: false, is_pick_del_dia: true };

function PickForm({ defaultDelDia = true, onSuccess }) {
  const [form, setForm]     = useState({ ...FORM0, is_pick_del_dia: defaultDelDia });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]       = useState(null);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg(null);
    if (!form.match || !form.league || !form.market || !form.odds || !form.analysis)
      return setMsg({ type: 'error', text: 'Completá todos los campos obligatorios (*).' });
    if (form.analysis.length < 50)
      return setMsg({ type: 'error', text: 'El análisis debe tener al menos 50 caracteres.' });
    if (Number(form.odds) < 1.01)
      return setMsg({ type: 'error', text: 'La cuota mínima es 1.01.' });

    setLoading(true);
    const { error } = await publicarPick({
      match: form.match, league: form.league,
      match_date: boliviaToUTC(form.match_date),
      market: form.market, odds: parseFloat(form.odds),
      stake: parseInt(form.stake), confidence: form.confidence,
      analysis: form.analysis, is_vip: form.is_vip,
      is_pick_del_dia: form.is_pick_del_dia,
    });
    setLoading(false);
    if (error) return setMsg({ type: 'error', text: error });
    setForm({ ...FORM0, is_pick_del_dia: defaultDelDia });
    setMsg({ type: 'success', text: 'Pick publicado ✓' });
    onSuccess?.();
  }

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0 16px' }}>
          <Field label="Partido *"><input name="match" value={form.match} onChange={onChange} placeholder="Bolívar vs The Strongest" style={inputS} /></Field>
          <Field label="Liga *"><input name="league" value={form.league} onChange={onChange} placeholder="División Profesional" style={inputS} /></Field>
          <Field label="Fecha del partido">
              <input name="match_date" type="datetime-local" value={form.match_date} onChange={onChange} style={inputS} />
              <p style={{ fontSize: '11px', color: '#B8D4F4', margin: '4px 0 0' }}>Ingresá la hora en tiempo boliviano (BOT)</p>
            </Field>
          <Field label="Mercado *"><input name="market" value={form.market} onChange={onChange} placeholder="1X2 — Local gana" style={inputS} /></Field>
          <Field label="Cuota *"><input name="odds" type="number" step="0.01" min="1.01" value={form.odds} onChange={onChange} placeholder="2.10" style={{ ...inputS, ...MONO }} /></Field>
          <Field label="Stake (1-10)">
            <select name="stake" value={form.stake} onChange={onChange} style={inputS}>
              {Array.from({ length: 10 }, (_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
            </select>
          </Field>
          <Field label="Confianza">
            <select name="confidence" value={form.confidence} onChange={onChange} style={inputS}>
              <option>Baja</option><option>Media</option><option>Alta</option>
            </select>
          </Field>
          <Field label="Tipo">
            <div style={{ display: 'flex', padding: '9px 0' }}>
              <label style={{display:'flex', alignItems:'center', gap:'6px', cursor:'pointer'}}>
                <input type="radio" name="tipo" value="free" checked={form.is_vip === false} onChange={() => setForm(p => ({ ...p, is_vip: false }))} />
                <span style={{color:'#0A2540', fontSize:'14px'}}>Free</span>
              </label>
              <label style={{display:'flex', alignItems:'center', gap:'6px', cursor:'pointer', marginLeft:'16px'}}>
                <input type="radio" name="tipo" value="vip" checked={form.is_vip === true} onChange={() => setForm(p => ({ ...p, is_vip: true }))} />
                <span style={{color:'#1D9E75', fontSize:'14px', fontWeight:500}}>VIP</span>
              </label>
            </div>
          </Field>
        </div>

        <Field label="Análisis * (mín. 50 chars)">
          <textarea name="analysis" value={form.analysis} onChange={onChange} rows={4} placeholder="Análisis del partido..." style={{ ...inputS, resize: 'vertical', lineHeight: 1.55 }} />
        </Field>

        <label style={{display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', marginBottom:'14px'}}>
          <input type="checkbox" checked={form.is_pick_del_dia} onChange={e => setForm(p => ({ ...p, is_pick_del_dia: e.target.checked }))} />
          <span style={{fontSize:'14px', color:'#0A2540'}}>Marcar como Pick del Día</span>
        </label>

        <Alert text={msg?.text} type={msg?.type} />

        <button type="submit" disabled={loading} style={{ marginTop: '12px', background: loading ? 'rgba(29,158,117,0.5)' : Theme.Colors.Green, color: '#fff', border: 'none', borderRadius: '8px', padding: '11px 24px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Publicando…' : defaultDelDia ? 'Publicar pick del día' : 'Publicar pick'}
        </button>
      </form>
    </Card>
  );
}

// ── Tab 1 — Pick del Día ───────────────────────────────────────

function TabPickDelDia() {
  return (
    <>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: Theme.Colors.TextInverse, marginBottom: '16px' }}>Publicar Pick del Día</h2>
      <PickForm defaultDelDia={true} />
    </>
  );
}

// ── Tab 2 — Picks ──────────────────────────────────────────────

function TabPicks() {
  const [picks, setPicks]   = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    const { data } = await obtenerUltimosPicks(10);
    setPicks(data ?? []);
    setCargando(false);
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  return (
    <>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: Theme.Colors.TextInverse, marginBottom: '16px' }}>Publicar Pick</h2>
      <PickForm defaultDelDia={false} onSuccess={cargar} />

      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: Theme.Colors.TextInverse, margin: '24px 0 12px' }}>Últimos 10 picks</h2>
      {cargando ? <p style={{ color: Theme.Colors.TextAccent }}>Cargando…</p>
        : picks.length === 0 ? <p style={{ color: Theme.Colors.TextAccent }}>No hay picks publicados.</p>
        : picks.map(p => (
          <Card key={p.id} style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: Theme.Colors.TextPrimary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.match}</p>
                <p style={{ fontSize: '12px', color: Theme.Colors.TextSecondary, margin: '2px 0 0' }}>{p.market} · Stake {p.stake}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ ...MONO, fontSize: '14px', fontWeight: 700, color: Theme.Colors.TextPrimary }}>{Number(p.odds).toFixed(2)}</span>
                <ResultChip result={p.result} />
              </div>
            </div>
          </Card>
        ))
      }
    </>
  );
}

// ── Tab 3 — Resultados ─────────────────────────────────────────

function TabResultados() {
  const [picks, setPicks]       = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(null);
  const [msg, setMsg]           = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    const { data, error } = await obtenerPicksPendientes();
    if (error) setMsg({ type: 'error', text: error });
    setPicks(data ?? []);
    setCargando(false);
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  async function marcar(id, result, odds, stake) {
    setProcesando(id);
    setMsg(null);
    const { error } = await marcarResultado(id, result, odds, stake);
    setProcesando(null);
    setMsg(error
      ? { type: 'error', text: error }
      : { type: 'success', text: `Resultado guardado: ${result} ✓` }
    );
    cargar();
  }

  return (
    <>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: Theme.Colors.TextInverse, marginBottom: '12px' }}>Marcar resultados</h2>
      <Alert text={msg?.text} type={msg?.type} />
      {cargando ? <p style={{ color: Theme.Colors.TextAccent, marginTop: '8px' }}>Cargando picks pendientes…</p>
        : picks.length === 0 ? <p style={{ color: Theme.Colors.TextAccent, marginTop: '8px' }}>No hay picks pendientes.</p>
        : picks.map(p => (
          <Card key={p.id} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: Theme.Colors.TextPrimary, margin: 0 }}>{p.match}</p>
                <p style={{ fontSize: '12px', color: Theme.Colors.TextSecondary, margin: '2px 0 0' }}>
                  {p.market} · Cuota <span style={MONO}>{Number(p.odds).toFixed(2)}</span> · Stake {p.stake}
                </p>
                {p.match_date && <p style={{ fontSize: '11px', color: Theme.Colors.TextMuted, margin: '2px 0 0' }}>{new Date(p.match_date).toLocaleString('es-BO')}</p>}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                <OutlineBtn label="✓ Ganado"  color={Theme.Colors.Green} disabled={procesando === p.id} onClick={() => marcar(p.id, 'ganado',  p.odds, p.stake)} />
                <OutlineBtn label="✗ Perdido" color={Theme.Colors.Error} disabled={procesando === p.id} onClick={() => marcar(p.id, 'perdido', p.odds, p.stake)} />
                <OutlineBtn label="— Anulado" color={Theme.Colors.Muted} disabled={procesando === p.id} onClick={() => marcar(p.id, 'anulado', p.odds, p.stake)} />
              </div>
            </div>
          </Card>
        ))
      }
    </>
  );
}

// ── Tab 4 — Usuarios VIP ───────────────────────────────────────

function UsuarioItem({ u, onUpdate }) {
  const [plan, setPlan]   = useState('semanal');
  const [abierto, setAbierto] = useState(false);
  const [loading, setLoading] = useState(false);

  async function activar() {
    setLoading(true);
    await activarVip(u.id, plan);
    setLoading(false);
    setAbierto(false);
    onUpdate();
  }

  async function revocar() {
    setLoading(true);
    await revocarVip(u.id);
    setLoading(false);
    onUpdate();
  }

  return (
    <Card style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: Theme.Colors.TextPrimary, margin: 0 }}>
              {u.nombre ?? '—'} <span style={{ color: Theme.Colors.TextSecondary, fontWeight: 400 }}>@{u.username ?? '—'}</span>
            </p>
            <RoleBadge role={u.role ?? 'free'} />
          </div>
          <p style={{ fontSize: '12px', color: Theme.Colors.TextSecondary, margin: 0 }}>{u.email ?? '—'}</p>
          {u.vip_vence && <p style={{ fontSize: '11px', color: Theme.Colors.TextMuted, margin: '2px 0 0' }}>VIP vence: {new Date(u.vip_vence).toLocaleDateString('es-BO')}</p>}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {u.role === 'free' && (
            abierto
              ? <>
                  <select value={plan} onChange={e => setPlan(e.target.value)} style={{ ...inputS, width: 'auto', padding: '5px 8px', fontSize: '13px' }}>
                    <option value="semanal">Plan Semanal (7 días)</option>
                    <option value="mensual">Plan Mensual (30 días)</option>
                  </select>
                  <OutlineBtn label={loading ? '…' : 'Activar'} color={Theme.Colors.Green} disabled={loading} onClick={activar} />
                  <OutlineBtn label="✕" color={Theme.Colors.Muted} disabled={loading} onClick={() => setAbierto(false)} />
                </>
              : <OutlineBtn label="Activar VIP" color={Theme.Colors.Green} disabled={false} onClick={() => setAbierto(true)} />
          )}
          {u.role === 'vip' && <OutlineBtn label="Revocar VIP" color={Theme.Colors.Error} disabled={loading} onClick={revocar} />}
        </div>
      </div>
    </Card>
  );
}

function TabVip() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    const { data, error } = await obtenerTodosLosUsuarios();
    if (error) setError(error);
    setUsuarios(data ?? []);
    setCargando(false);
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  return (
    <>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: Theme.Colors.TextInverse, marginBottom: '12px' }}>Usuarios</h2>
      {error && <Alert text={error} type="error" />}
      {cargando ? <p style={{ color: Theme.Colors.TextAccent }}>Cargando usuarios…</p>
        : usuarios.length === 0 ? <p style={{ color: Theme.Colors.TextAccent }}>No hay usuarios registrados.</p>
        : usuarios.map(u => <UsuarioItem key={u.id} u={u} onUpdate={cargar} />)
      }
    </>
  );
}

// ── Page ───────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [tabActivo, setTabActivo] = useState(0);

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  return (
    <div style={{ minHeight: '100vh', background: Theme.Colors.Navy, paddingBottom: '80px' }}>
      {/* Header del panel */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(29,158,117,0.2)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/admin" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: Theme.Colors.TextInverse, margin: 0 }}>Panel Admin · CambaWinner</h1>
          </Link>
          <span style={{ background: 'rgba(29,158,117,0.15)', color: Theme.Colors.Green, border: `1px solid ${Theme.Colors.Green}`, borderRadius: '9999px', padding: '2px 10px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em' }}>ADMIN</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => window.open('https://www.cambawinner.site', '_blank')}
            style={{ background: 'transparent', border: `1px solid ${Theme.Colors.Green}`, color: Theme.Colors.Green, borderRadius: '6px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' }}
          >
            Ver sitio →
          </button>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(184,212,244,0.3)', color: Theme.Colors.TextAccent, borderRadius: '6px', padding: '6px 14px', fontSize: '13px', cursor: 'pointer' }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 20px', overflowX: 'auto' }}>
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => setTabActivo(i)} style={{ background: 'transparent', border: 'none', borderBottom: tabActivo === i ? `2px solid ${Theme.Colors.Green}` : '2px solid transparent', color: tabActivo === i ? Theme.Colors.Green : Theme.Colors.TextAccent, padding: '14px 16px', fontSize: '14px', fontWeight: tabActivo === i ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.15s' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '24px 16px' }}>
        {tabActivo === 0 && <TabPickDelDia />}
        {tabActivo === 1 && <TabPicks />}
        {tabActivo === 2 && <TabResultados />}
        {tabActivo === 3 && <TabVip />}
      </div>
    </div>
  );
}
