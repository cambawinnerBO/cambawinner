const MONO = { fontFamily: "'JetBrains Mono', monospace" };

function findMaxes(odds) {
  if (!odds?.length) return { odd1: null, oddX: null, odd2: null };
  return {
    odd1: Math.max(...odds.map((o) => parseFloat(o.odd1) || 0)),
    oddX: Math.max(...odds.map((o) => parseFloat(o.oddX) || 0)),
    odd2: Math.max(...odds.map((o) => parseFloat(o.odd2) || 0)),
  };
}

function OddCell({ value, isMax }) {
  return (
    <td
      style={{
        ...MONO,
        textAlign: 'center',
        padding: '10px 12px',
        fontSize: '0.9375rem',
        fontWeight: isMax ? 700 : 400,
        color: isMax ? '#1D9E75' : '#0A2540',
      }}
    >
      {value ?? '—'}
    </td>
  );
}

export default function OddsTable({ odds }) {
  if (!odds?.length) {
    return (
      <p style={{ color: '#A0A8B5', fontSize: '0.875rem', padding: '12px' }}>
        Sin cuotas disponibles.
      </p>
    );
  }

  const maxes = findMaxes(odds);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E5E8EE' }}>
            {['Casa', '1', 'X', '2', ''].map((h) => (
              <th
                key={h}
                style={{
                  padding: '8px 12px',
                  textAlign: h === 'Casa' || h === '' ? 'left' : 'center',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#5A6B85',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {odds.map((row, i) => (
            <tr
              key={i}
              style={{
                borderBottom: '0.5px solid #E5E8EE',
                background: i % 2 === 0 ? '#ffffff' : '#F5F7FA',
              }}
            >
              <td style={{ padding: '10px 12px', fontWeight: 500, fontSize: '0.875rem', color: '#0A2540' }}>
                {row.bookmaker}
              </td>
              <OddCell value={row.odd1} isMax={parseFloat(row.odd1) === maxes.odd1} />
              <OddCell value={row.oddX} isMax={parseFloat(row.oddX) === maxes.oddX} />
              <OddCell value={row.odd2} isMax={parseFloat(row.odd2) === maxes.odd2} />
              <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                {row.affiliateUrl && (
                  <a
                    href={row.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...MONO,
                      display: 'inline-block',
                      padding: '5px 12px',
                      background: '#1D9E75',
                      color: '#ffffff',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Apostar →
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
