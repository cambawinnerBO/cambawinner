'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { Theme } from '@/lib/theme';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password)
      return setError('Todos los campos son obligatorios.');

    setLoading(true);
    const { error: err } = await login(form.email, form.password);
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
            Iniciar sesión
          </h1>
          <p style={{ fontSize: '0.875rem', color: Theme.Colors.TextSecondary }}>
            Accedé a tu cuenta CambaWinner
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" />
          <Field label="Contraseña" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Tu contraseña" />

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
            {loading ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: Theme.Colors.TextSecondary, marginTop: '20px' }}>
          ¿No tenés cuenta?{' '}
          <Link href="/registro" style={{ color: Theme.Colors.Green, fontWeight: 600, textDecoration: 'none' }}>
            Registrate
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
