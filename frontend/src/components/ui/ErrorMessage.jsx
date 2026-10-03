export default function ErrorMessage({ children }) {
  if (!children) return null
  return (
    <p role="alert" className="rounded-xl bg-rose-950/50 px-4 py-3 text-sm font-medium text-rose-300 border border-rose-500/30 shadow-sm flex items-center gap-2">
      <span aria-hidden="true" className="text-base text-rose-400">⚠️</span>
      <span>{children}</span>
    </p>
  )
}
