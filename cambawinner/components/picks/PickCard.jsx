import Card from '../ui/Card';
import Badge from '../ui/Badge';

const MONO = { fontFamily: "'JetBrains Mono', monospace" };

export default function PickCard({ match, market, odds, stake, result, analysis }) {
  return (
    <Card>
      <div style={{ padding: '16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '10px',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#0A2540',
                marginBottom: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {match}
            </p>
            <p style={{ fontSize: '0.8125rem', color: '#5A6B85' }}>{market}</p>
          </div>
          {result && (
            <div style={{ marginLeft: '12px', flexShrink: 0 }}>
              <Badge result={result} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'baseline' }}>
          {odds != null && (
            <div>
              <span style={{ fontSize: '0.6875rem', color: '#A0A8B5', display: 'block', marginBottom: '1px' }}>
                Cuota
              </span>
              <span style={{ ...MONO, fontSize: '1.125rem', fontWeight: 700, color: '#0A2540' }}>
                {Number(odds).toFixed(2)}
              </span>
            </div>
          )}
          {stake != null && (
            <div>
              <span style={{ fontSize: '0.6875rem', color: '#A0A8B5', display: 'block', marginBottom: '1px' }}>
                Stake
              </span>
              <span style={{ ...MONO, fontSize: '1.125rem', fontWeight: 700, color: '#0A2540' }}>
                {stake}u
              </span>
            </div>
          )}
        </div>

        {analysis && (
          <p
            style={{
              marginTop: '10px',
              fontSize: '0.8125rem',
              color: '#5A6B85',
              lineHeight: 1.55,
              paddingTop: '10px',
              borderTop: '0.5px solid #E5E8EE',
            }}
          >
            {analysis}
          </p>
        )}
      </div>
    </Card>
  );
}
