import Card from '../ui/Card';
import OddsTable from './OddsTable';

export default function MatchCard({ home, away, league, time, odds }) {
  return (
    <Card>
      <div style={{ padding: '16px 16px 0' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '12px',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '0.75rem',
                color: '#5A6B85',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '4px',
              }}
            >
              {league}
            </p>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#0A2540',
                lineHeight: 1.3,
              }}
            >
              {home} <span style={{ color: '#A0A8B5', fontWeight: 400 }}>vs</span> {away}
            </h3>
          </div>
          {time && (
            <span
              style={{
                fontSize: '0.8125rem',
                color: '#5A6B85',
                whiteSpace: 'nowrap',
                marginLeft: '12px',
              }}
            >
              {time}
            </span>
          )}
        </div>
      </div>
      <OddsTable odds={odds} />
    </Card>
  );
}
