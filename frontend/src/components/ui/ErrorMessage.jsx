export default function ErrorMessage({ children }) {
  if (!children) return null
  return (
    <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200">
      {children}
    </p>
  )
}
