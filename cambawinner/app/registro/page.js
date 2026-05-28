'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Theme } from '@/lib/theme';

export default function RegistroPage() {
  const router  = useRouter();
  const { registrar } = useAuth();

  const [form, setForm]       = useState({ nombre: '', username: '', email: '', password: '' });
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [verPassword, setVerPassword] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.nombre || !form.username || !form.email || !form.password)
      return setError('Todos los campos son obligatorios.');
    if (form.password.length < 6)
      return setError('La contraseña debe tener al menos 6 caracteres.');

    setLoading(true);

    const { data: existing } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', form.username)
      .single();

    if (existing) {
      setLoading(false);
      return setError('Ese nombre de usuario ya está en uso.');
    }

    const { error: err } = await registrar(form.email, form.password, form.nombre, form.username);
    setLoading(false);

    if (err) return setError(err);
    router.push('/');
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      background: Theme.Colors.Navy,
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: Theme.Colors.Surface,
        borderRadius: Theme.Radius.LG,
        padding: '32px 24px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src="/logo/cambawinner-isotipo.svg" alt="CambaWinner" width={48} height={48} style={{ display: 'block', margin: '0 auto 12px' }} />
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: Theme.Colors.TextPrimary, marginBottom: '4px' }}>
            Crear cuenta
          </h1>
          <p style={{ fontSize: '0.875rem', color: Theme.Colors.TextSecondary }}>
            Registrate en CambaWinner
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Field label="Nombre" name="nombre" type="text" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" />
          <Field label="Usuario" name="username" type="text" value={form.username} onChange={handleChange} placeholder="@usuario" />
          <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: Theme.Colors.TextSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                name="password"
                type={verPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                style={{ background: '#ffffff', border: '1px solid rgba(10,37,64,0.15)', borderRadius: Theme.Radius.SM, padding: '10px 44px 10px 12px', fontSize: '15px', color: Theme.Colors.TextPrimary, outline: 'none', width: '100%', boxSizing: 'border-box' }}
              />
              <button type="button" onClick={() => setVerPassword(!verPassword)} aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '0', color: '#5A6B85', fontSize: '18px', lineHeight: 1 }}>
                {verPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <p style={{ fontSize: '0.8125rem', color: Theme.Colors.Error, background: 'rgba(211,47,47,0.08)', border: `1px solid ${Theme.Colors.Error}`, borderRadius: Theme.Radius.SM, padding: '10px 12px', margin: 0 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '4px',
              background: loading ? 'rgba(29,158,117,0.5)' : Theme.Colors.Green,
              color: '#ffffff',
              border: 'none',
              borderRadius: Theme.Radius.MD,
              padding: '12px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.15s',
            }}
          >
            {loading ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: Theme.Colors.TextSecondary, marginTop: '20px' }}>
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" style={{ color: Theme.Colors.Green, fontWeight: 600, textDecoration: 'none' }}>
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, name, type, value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: Theme.Colors.TextSecondary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          background: '#ffffff',
          border: `1px solid rgba(10,37,64,0.15)`,
          borderRadius: Theme.Radius.SM,
          padding: '10px 12px',
          fontSize: '15px',
          color: Theme.Colors.TextPrimary,
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}
