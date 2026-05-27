export default function Card({ children, className = '' }) {
  return (
    <div
      className={className}
      style={{
        background: '#F5F7FA',
        borderRadius: '8px',
        border: '0.5px solid #E5E8EE',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
