import Link from 'next/link';

const VARIANT_STYLES = {
  primary: {
    background: '#1D9E75',
    color: '#ffffff',
    border: '1.5px solid #1D9E75',
  },
  secondary: {
    background: 'transparent',
    color: '#1D9E75',
    border: '1.5px solid #1D9E75',
  },
  ghost: {
    background: 'transparent',
    color: '#B8D4F4',
    border: '1.5px solid transparent',
  },
};

const SIZE_STYLES = {
  sm: { padding: '6px 14px', fontSize: '0.8125rem', borderRadius: '6px' },
  md: { padding: '9px 20px', fontSize: '0.9375rem', borderRadius: '8px' },
  lg: { padding: '12px 28px', fontSize: '1rem',     borderRadius: '8px' },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  children,
  disabled,
  className,
  ...props
}) {
  const style = {
    ...VARIANT_STYLES[variant],
    ...SIZE_STYLES[size],
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    textDecoration: 'none',
    transition: 'opacity 0.15s',
    lineHeight: 1,
  };

  if (href) {
    return (
      <Link href={href} style={style} className={className} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
