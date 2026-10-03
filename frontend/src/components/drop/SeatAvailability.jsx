import ProgressBar from '../ui/ProgressBar'

export default function SeatAvailability({ remaining, total, className = '' }) {
  return (
    <div className={className}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-5xl font-extrabold leading-none tracking-tight text-slate-900 tabular-nums">
            {remaining}
          </p>
          <p className="mt-1 text-sm font-medium text-slate-600">tickets remaining</p>
        </div>
        <p className="text-right text-sm text-slate-500">
          <span className="font-semibold text-slate-700 tabular-nums">{total}</span> total tickets
        </p>
      </div>
      <ProgressBar value={remaining} max={total} label={`${remaining} of ${total} tickets remaining`} className="mt-4" />
    </div>
  )
}
