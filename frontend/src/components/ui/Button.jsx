import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-55 active:scale-[0.98]'

const variants = {
  primary:
    'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-violet-950/50 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 hover:shadow-violet-600/30 border border-violet-400/20',
  secondary:
    'bg-[#1D1D2B] text-[#F5F5FA] border border-white/10 hover:bg-[#28283C] hover:border-white/20 shadow-md',
  ghost:
    'text-slate-300 hover:text-white hover:bg-white/5',
  outline:
    'border border-violet-500/40 text-violet-300 hover:bg-violet-950/30 hover:border-violet-400',
  danger:
    'bg-rose-600/90 text-white hover:bg-rose-500 border border-rose-500/30 shadow-lg shadow-rose-950/40',
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
