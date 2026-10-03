import { Spinner } from './Button'

export default function LoadingBlock({ text = 'Loading...' }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center gap-4 py-20 text-slate-300">
      <Spinner className="h-9 w-9 text-violet-400" />
      <p className="text-base font-medium text-slate-300 font-display">{text}</p>
    </div>
  )
}
