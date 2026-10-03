import { Spinner } from './Button'

export default function LoadingBlock({ text = 'Loading...' }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center gap-4 py-24 text-slate-600">
      <Spinner className="h-9 w-9 text-brand-600" />
      <p className="text-lg font-medium">{text}</p>
    </div>
  )
}
