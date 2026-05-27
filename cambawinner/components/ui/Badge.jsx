const STYLES = {
  ganado:   { background: '#D1F5E8', color: '#0D6B4F' },
  perdido:  { background: '#FDDEDE', color: '#B71C1C' },
  pendiente:{ background: '#FDF3DC', color: '#A66A00' },
  anulado:  { background: '#E8E8E6', color: '#555550' },
};

const LABELS = {
  ganado: 'Ganado',
  perdido: 'Perdido',
  pendiente: 'Pendiente',
  anulado: 'Anulado',
};

export default function Badge({ result }) {
  const style = STYLES[result] ?? STYLES.anulado;
  const label = LABELS[result] ?? result;

  return (
    <span
      style={{
        ...style,
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
