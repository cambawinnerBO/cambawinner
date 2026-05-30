import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/context/AuthContext';
import SiteShell from '@/components/layout/SiteShell';
import InstallBanner from '@/components/ui/InstallBanner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://cambawinner.site'),
  title: 'CambaWinner — Pronósticos con datos',
  description: 'Comparador de cuotas y pronósticos deportivos para Bolivia',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/cambawinner-icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CambaWinner',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  openGraph: {
    title: 'CambaWinner',
    description: 'Pronósticos con datos',
    url: 'https://cambawinner.site',
    siteName: 'CambaWinner',
    locale: 'es_BO',
    type: 'website',
    images: [{ url: '/icons/cambawinner-icon-512x512.png' }],
  },
};

export const viewport = {
  themeColor: '#0A2540',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <AuthProvider>
          <SiteShell>{children}</SiteShell>
          <InstallBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
