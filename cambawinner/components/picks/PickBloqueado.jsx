export default function PickBloqueado({ isPickDelDia }) {
  return (
    <div style={{ background: 'white', borderRadius: '8px', border: '0.5px solid #E5E8EE', padding: '16px', marginBottom: '10px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ marginBottom: '8px' }}>
        {isPickDelDia ? (
          <span style={{ background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.3)', borderRadius: '999px', padding: '3px 10px', fontSize: '10px', fontWeight: 600, color: '#1D9E75', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ⚡ Pick del día VIP
          </span>
        ) : (
          <span style={{ background: 'rgba(90,107,133,0.08)', border: '1px solid rgba(90,107,133,0.2)', borderRadius: '999px', padding: '3px 10px', fontSize: '10px', fontWeight: 600, color: '#5A6B85', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ★ Recomendado VIP
          </span>
        )}
      </div>

      <div style={{ filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none', marginBottom: '12px' }}>
        <div style={{ height: '16px', background: '#E5E8EE', borderRadius: '4px', width: '70%', marginBottom: '8px' }} />
        <div style={{ height: '12px', background: '#E5E8EE', borderRadius: '4px', width: '45%', marginBottom: '8px' }} />
        <div style={{ height: '12px', background: '#E5E8EE', borderRadius: '4px', width: '55%' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>🔒</span>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#5A6B85', margin: 0, textAlign: 'center' }}>
          Contenido exclusivo para suscriptores VIP
        </p>
        <a href="/vip" style={{ background: '#1D9E75', color: 'white', padding: '7px 16px', borderRadius: '999px', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
          Quiero ser VIP →
        </a>
      </div>
    </div>
  );
}
