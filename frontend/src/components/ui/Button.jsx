import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-55 active:scale-[0.98]'

const variants = {
  primary:
    'bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-700 hover:shadow-brand-700/30',
  secondary: 'bg-white text-slate-800 ring-1 ring-slate-300 hover:bg-slate-50',
  ghost: 'text-slate-700 hover:bg-slate-100',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
}

const sizes = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-3 text-base',
  lg: 'px-7 py-4 text-lg',
}

export function Spinner({ className = 'h-5 w-5' }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export default function Button({
  as,
  to,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  className = '',
  children,
  disabled,
  ...rest
}) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    )
  }
  const Tag = as || 'button'
  return (
    <Tag
      className={cls}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      type={Tag === 'button' ? rest.type || 'button' : undefined}
      {...rest}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {loading && loadingText ? loadingText : children}
    </Tag>
  )
}
