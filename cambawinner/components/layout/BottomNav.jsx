'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Star, Lock } from 'lucide-react';
import { Theme } from '@/lib/theme';

const NAV_TABS = [
  { href: '/',       label: 'Inicio', Icon: Home },
  { href: '/cuotas', label: 'Cuotas', Icon: BarChart2 },
  { href: '/picks',  label: 'Picks',  Icon: Star },
  { href: '/vip',    label: 'VIP',    Icon: Lock },
];

function NavTab({ href, label, Icon, isActive }) {
  return (
    <Link
      href={href}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3px',
        padding: '10px 0',
        color: isActive ? Theme.Colors.Green : Theme.Colors.TextAccent,
        opacity: isActive ? 1 : 0.6,
        textDecoration: 'none',
        transition: 'color 0.15s, opacity 0.15s',
      }}
    >
      <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
      <span style={{ fontSize: '11px', fontWeight: isActive ? 600 : 400, letterSpacing: '0.02em' }}>
        {label}
      </span>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="flex md:hidden"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: Theme.Colors.Navy,
        borderTop: '0.5px solid rgba(255,255,255,0.1)',
        zIndex: 50,
      }}
    >
      {NAV_TABS.map(({ href, label, Icon }) => (
        <NavTab
          key={href}
          href={href}
          label={label}
          Icon={Icon}
          isActive={pathname === href}
        />
      ))}
    </nav>
  );
}
