'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Star, Lock } from 'lucide-react';
import { Theme } from '@/lib/theme';

const NAV_TABS = [
  { href: '/',      label: 'Inicio', Icon: Home },
  { href: '/picks', label: 'Picks',  Icon: Star },
  { href: '/vip',   label: 'VIP',    Icon: Lock },
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
        gap: '2px',
        height: '100%',
        color: isActive ? Theme.Colors.Green : Theme.Colors.TextAccent,
        opacity: isActive ? 1 : 0.6,
        textDecoration: 'none',
        transition: 'color 0.15s, opacity 0.15s',
      }}
    >
      <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
      <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400, letterSpacing: '0.03em' }}>
        {label}
      </span>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="flex md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        height: '64px',
        background: Theme.Colors.Navy,
        borderTop: '1px solid rgba(29,158,117,0.2)',
        justifyContent: 'space-around',
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
