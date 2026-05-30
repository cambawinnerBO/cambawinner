'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function InstallBanner() {
  const [mostrar,        setMostrar]        = useState(false);
  const [tipo,           setTipo]           = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const yaCerrado = localStorage.getItem('installBannerCerrado');
    if (yaCerrado) return;

    const ua          = navigator.userAgent;
    const esIOS       = /iPad|iPhone|iPod/.test(ua);
    const esSafari    = /Safari/.test(ua) && !/Chrome/.test(ua) && !/CriOS/.test(ua);
    const esChromeIOS = /CriOS/.test(ua);
    const yaInstalada = window.navigator.standalone === true;
    const esMobil     = window.innerWidth < 768;

    if (!esMobil || yaInstalada) return;

    if (esIOS && esSafari) {
      setTipo('ios-safari');
      setMostrar(true);
    } else if (esIOS && esChromeIOS) {
      setTipo('ios-chrome');
      setMostrar(true);
    } else {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setTipo('android');
        setMostrar(true);
      });
    }
  }, []);

  function cerrar() {
    setMostrar(false);
    localStorage.setItem('installBannerCerrado', 'true');
  }

  async function instalarAndroid() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') cerrar();
  }

  if (!mostrar) return null;

  return (
    <div style={{ position: 'fixed', bottom: '80px', left: '16px', right: '16px', background: '#0A2540', border: '1px solid #1D9E75', borderRadius: '12px', padding: '14px 16px', zIndex: 100, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>

      <button onClick={cerrar} style={{ position: 'absolute', top: '10px', right: '12px', background: 'none', border: 'none', color: '#B8D4F4', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: 0 }}>×</button>

      {tipo === 'android' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image src="/icons/cambawinner-icon-192x192.png" width={36} height={36} style={{ borderRadius: '8px' }} alt="CambaWinner" />
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: '#F5F7FA', margin: 0 }}>
              Instalá CambaWinner
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#B8D4F4', margin: '2px 0 0' }}>
              Accedé más rápido desde tu pantalla de inicio
            </p>
          </div>
          <button onClick={instalarAndroid} style={{ background: '#1D9E75', color: 'white', border: 'none', borderRadius: '6px', padding: '7px 12px', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Instalar
          </button>
        </div>
      )}

      {tipo === 'ios-safari' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Image src="/icons/cambawinner-icon-192x192.png" width={32} height={32} style={{ borderRadius: '8px' }} alt="CambaWinner" />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: '#F5F7FA', margin: 0 }}>
              Instalá CambaWinner en tu iPhone
            </p>
          </div>
          <div style={{ background: 'rgba(29,158,117,0.08)', borderRadius: '8px', padding: '10px 12px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#B8D4F4', margin: 0, lineHeight: 1.6 }}>
              1. Tocá el botón compartir <strong style={{ color: '#F5F7FA' }}>⬆️</strong> abajo{'\n'}
              2. Seleccioná <strong style={{ color: '#F5F7FA' }}>&quot;Añadir a pantalla de inicio&quot;</strong>{'\n'}
              3. Tocá <strong style={{ color: '#F5F7FA' }}>&quot;Añadir&quot;</strong>
            </p>
          </div>
        </div>
      )}

      {tipo === 'ios-chrome' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Image src="/icons/cambawinner-icon-192x192.png" width={32} height={32} style={{ borderRadius: '8px' }} alt="CambaWinner" />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600, color: '#F5F7FA', margin: 0 }}>
              Para instalar usá Safari
            </p>
          </div>
          <div style={{ background: 'rgba(29,158,117,0.08)', borderRadius: '8px', padding: '10px 12px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#B8D4F4', margin: 0, lineHeight: 1.6 }}>
              Chrome en iPhone no permite instalar apps web.{'\n'}
              Abrí <strong style={{ color: '#F5F7FA' }}>cambawinner.site</strong> en Safari y seguí las instrucciones para instalar.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
