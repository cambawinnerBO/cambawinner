'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Theme } from '@/lib/theme';

const NAV_LINKS = [
  { href: '/',       label: 'Inicio' },
  { href: '/cuotas', label: 'Cuotas' },
  { href: '/picks',  label: 'Picks' },
  { href: '/vip',    label: 'VIP' },
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

export default function Header() {
  const pathname = usePathname();
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
      <Link
        href="/"
        style={{
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '20px',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        <span style={{ color: '#ffffff' }}>Camba</span>
        <span style={{ color: Theme.Colors.Green }}>Winner</span>
      </Link>

      <nav className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map(({ href, label }) => (
          <NavLink
            key={href}
            href={href}
            label={label}
            isActive={pathname === href}
          />
        ))}
      </nav>
    </header>
  );
}
