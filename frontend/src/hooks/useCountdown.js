import { useEffect, useState } from 'react'

// Seconds remaining until `deadline` (epoch ms). Ticks every 250ms.
export function useCountdown(deadline) {
  const compute = () => (deadline ? Math.max(0, Math.ceil((deadline - Date.now()) / 1000)) : 0)
  const [seconds, setSeconds] = useState(compute)

  useEffect(() => {
    setSeconds(compute())
    if (!deadline) return undefined
    const id = setInterval(() => setSeconds(compute()), 250)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline])

  return seconds
}

export function formatClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
