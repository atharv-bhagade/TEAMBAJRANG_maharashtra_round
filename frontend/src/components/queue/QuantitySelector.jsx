import { useEffect } from 'react'

// Controlled selector used on Drop Details, BEFORE joining the queue.
// The value lives in the centralized store (selection.requestedQuantity).
export default function QuantitySelector({ value, max, onChange, disabled = false }) {
  const safeVal = max <= 0 ? 0 : Math.min(Math.max(1, value || 1), max)

  useEffect(() => {
    if (max > 0 && (value > max || value < 1)) {
      onChange(safeVal)
    }
  }, [value, max, safeVal, onChange])

  const btn =
    'grid h-14 w-14 place-items-center rounded-2xl bg-[#1D1D2B] text-2xl font-bold text-[#F5F5FA] border border-white/10 transition-all hover:bg-[#28283C] hover:border-violet-500/40 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-[#1D1D2B] disabled:hover:border-white/10 sm:h-12 sm:w-12 shadow-md'

  return (
    <div className="w-full text-center sm:text-left">
      <p id="qty-label" className="text-sm font-semibold text-slate-300">
        How many tickets do you want?
      </p>
      <div className="mt-3 flex items-center justify-center sm:justify-start gap-5" role="group" aria-labelledby="qty-label">
        <button
          type="button"
          className={btn}
          onClick={() => onChange(safeVal - 1)}
          disabled={disabled || safeVal <= 1}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <output
          aria-live="polite"
          aria-label={`Quantity ${safeVal}`}
          className="w-14 text-center font-display text-4xl font-extrabold tabular-nums text-white"
        >
          {safeVal}
        </output>
        <button
          type="button"
          className={btn}
          onClick={() => onChange(safeVal + 1)}
          disabled={disabled || safeVal >= max}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        {max > 0
          ? `You can select up to ${max} ticket${max === 1 ? '' : 's'}.`
          : 'You have reached the maximum ticket limit for this drop.'}
      </p>
    </div>
  )
}
