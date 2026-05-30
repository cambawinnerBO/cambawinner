'use client';
import { useState } from 'react';
import { aceptarTerminos } from '@/lib/services/authService';

export default function ModalTerminos({ userId, onAceptar }) {
  const [aceptado, setAceptado] = useState(false);
  const [loading,  setLoading]  = useState(false);

  async function handleAceptar() {
    if (!aceptado) return;
    setLoading(true);
    await aceptarTerminos(userId);
    onAceptar();
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(10,37,64,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '12px', padding: '28px 24px', maxWidth: '420px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>

        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 600, color: '#0A2540', margin: '0 0 4px', textAlign: 'center' }}>
          Términos del servicio VIP
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#A0A8B5', textAlign: 'center', margin: '0 0 20px' }}>
          Leé atentamente antes de continuar
        </p>

        <div style={{ background: '#F5F7FA', borderRadius: '8px', padding: '16px', marginBottom: '20px', fontSize: '13px', color: '#0A2540', fontFamily: 'Inter, sans-serif', lineHeight: 1.7 }}>
          <p style={{ fontWeight: 600, margin: '0 0 8px' }}>1. Uso personal e intransferible</p>
          <p style={{ margin: '0 0 12px', color: '#5A6B85' }}>
            El contenido VIP es exclusivo para tu cuenta. No está permitido compartir, redistribuir ni publicar los picks en ningún medio.
          </p>
          <p style={{ fontWeight: 600, margin: '0 0 8px' }}>2. Identificación en el contenido</p>
          <p style={{ margin: '0 0 12px', color: '#5A6B85' }}>
            Cada pick lleva tu identificación de usuario. Si el contenido es filtrado o compartido, podemos rastrear su origen.
          </p>
          <p style={{ fontWeight: 600, margin: '0 0 8px' }}>3. Cancelación por incumplimiento</p>
          <p style={{ margin: '0 0 12px', color: '#5A6B85' }}>
            El incumplimiento de estos términos resulta en la cancelación inmediata de la suscripción sin derecho a reembolso.
          </p>
          <p style={{ fontWeight: 600, margin: '0 0 8px' }}>4. Sin garantía de resultados</p>
          <p style={{ margin: 0, color: '#5A6B85' }}>
            CambaWinner proporciona análisis deportivo basado en datos. Las apuestas implican riesgo. Nunca apostés más de lo planificado.
          </p>
        </div>

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginBottom: '20px' }}>
          <input
            type="checkbox"
            checked={aceptado}
            onChange={e => setAceptado(e.target.checked)}
            style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#1D9E75', cursor: 'pointer', flexShrink: 0 }}
          />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#0A2540', lineHeight: 1.5 }}>
            Leí y acepto los términos del servicio VIP de CambaWinner
          </span>
        </label>

        <button
          onClick={handleAceptar}
          disabled={!aceptado || loading}
          style={{ width: '100%', padding: '12px', background: aceptado ? '#1D9E75' : '#A0A8B5', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 600, cursor: aceptado ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}
        >
          {loading ? 'Guardando...' : 'Acepto y continúo →'}
        </button>
      </div>
    </div>
  );
}
