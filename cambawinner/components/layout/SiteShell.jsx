'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';
import BottomNav from './BottomNav';

export default function SiteShell({ children }) {
  const pathname   = usePathname();
  const enAdmin    = pathname?.startsWith('/admin');

  return (
    <>
      {!enAdmin && <Header />}
      <main className={!enAdmin ? 'pb-20 md:pb-0' : undefined}>
        {children}
      </main>
      {!enAdmin && <BottomNav />}
    </>
  );
}
