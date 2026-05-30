'use client';

export default function WaterMark({ username, email }) {
  const texto = `${username} · ${email}`;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999, overflow: 'hidden', userSelect: 'none' }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${(i * 12) % 100}%`,
            left: `${(i * 17) % 100}%`,
            transform: 'rotate(-35deg)',
            whiteSpace: 'nowrap',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 400,
            color: 'rgba(10,37,64,0.09)',
            letterSpacing: '0.05em',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {texto}
        </div>
      ))}
    </div>
  );
}
