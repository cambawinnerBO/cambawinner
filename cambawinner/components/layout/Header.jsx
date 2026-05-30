'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Theme } from '@/lib/theme';
import { useAuth } from '@/lib/context/AuthContext';

const NAV_LINKS = [
  { href: '/',      label: 'Inicio' },
  { href: '/picks', label: 'Picks' },
  { href: '/vip',   label: 'VIP' },
];

function NavLink({ href, label, isActive }) {
  return (
    <Link
      href={href}
      style={{
        color: Theme.Colors.TextAccent,
        textDecoration: 'none',
        fontSize: '15px',
        fontWeight: 500,
        paddingBottom: '4px',
        borderBottom: isActive
          ? `2px solid ${Theme.Colors.Green}`
          : '2px solid transparent',
        transition: 'opacity 0.15s',
      }}
    >
      {label}
    </Link>
  );
}

function VipBadge() {
  return (
    <span style={{
      background: 'rgba(29,158,117,0.15)',
      color: Theme.Colors.Green,
      border: `1px solid ${Theme.Colors.Green}`,
      borderRadius: '9999px',
      padding: '2px 8px',
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.06em',
    }}>
      VIP
    </span>
  );
}

export default function Header({ simple = false }) {
  const pathname            = usePathname();
  const router              = useRouter();
  const { usuario, perfil, logout } = useAuth();

  const mostrarBotonLogin = !usuario && pathname !== '/picks';

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  return (
    <header
      style={{
        background: Theme.Colors.Navy,
        height: '56px',
        padding: `0 ${Theme.Spacing.LG}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '0.5px solid rgba(255,255,255,0.08)',
      }}
    >
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
          <Image
            src="/logo/cambawinner-isotipo.svg"
            alt="CambaWinner logo"
            width={32}
            height={32}
            style={{display:'block'}}
          />
          <span style={{
            fontFamily:'Inter, sans-serif',
            fontSize:'20px',
            fontWeight:600,
            letterSpacing:'-0.02em',
            color:'#F5F7FA',
          }}>
            Camba<span style={{color:'#1D9E75'}}>Winner</span>
          </span>
        </div>
      </Link>

      {!simple && (
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <NavLink key={href} href={href} label={label} isActive={pathname === href} />
          ))}
        </nav>
      )}

      {!simple && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {usuario ? (
            <>
              {perfil?.role === 'admin' && !pathname?.startsWith('/admin') && (
                <Link
                  href="/admin"
                  style={{
                    background: Theme.Colors.Green,
                    color: '#ffffff',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Panel Admin
                </Link>
              )}
              <span style={{ fontSize: '14px', color: Theme.Colors.TextAccent, display: 'flex', alignItems: 'center', gap: '6px' }}>
                {perfil?.nombre ?? usuario.email}
                {perfil?.role === 'vip' && <VipBadge />}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(184,212,244,0.3)',
                  borderRadius: Theme.Radius.SM,
                  color: Theme.Colors.TextAccent,
                  fontSize: '13px',
                  padding: '5px 12px',
                  cursor: 'pointer',
                }}
              >
                Salir
              </button>
            </>
          ) : mostrarBotonLogin ? (
            <Link
              href="/login"
              style={{
                background: Theme.Colors.Green,
                color: '#ffffff',
                borderRadius: Theme.Radius.SM,
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Iniciar sesión
            </Link>
          ) : null}
        </div>
      )}
    </header>
  );
}
