'use client';
import { usePathname } from 'next/navigation';
import Header from './Header';
import BottomNav from './BottomNav';

export default function SiteShell({ children }) {
  const pathname   = usePathname();
  const enAdmin    = pathname?.startsWith('/admin');
  const esAuthPage = pathname === '/login' || pathname === '/registro';

  return (
    <>
      {!enAdmin && <Header simple={esAuthPage} />}
      <main className={!enAdmin && !esAuthPage ? 'pb-20 md:pb-0' : undefined}>
        {children}
      </main>
      {!enAdmin && !esAuthPage && <BottomNav />}
    </>
  );
}
