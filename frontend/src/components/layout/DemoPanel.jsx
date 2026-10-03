import { useState } from 'react'
import { useMockState } from '../../hooks/useMockState'
import { inventoryIsConsistent } from '../../mock/mockState'
import { QUEUE_STATUS, ALLOCATION_STATUS, DROP_STATUS } from '../../mock/mockData'
import {
  simulateAdmission,
  simulateCooldown,
  simulateReAuth,
  simulateClosed,
  setDropStatus,
  setTicketsOwned,
  setForceClaimFailure,
  simulateAllocationState,
  shortenClaimWindow,
  resetDemo,
} from '../../mock/demoControls'

function Btn({ onClick, children, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ring-1 transition-colors ${
        active ? 'bg-amber-300 text-amber-950 ring-amber-400' : 'bg-white/10 text-white ring-white/20 hover:bg-white/20'
      }`}
    >
      {children}
    </button>
  )
}

function Row({ label, children }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

// MOCK / DEMO ONLY: not part of the product. Simulates server decisions.
export default function DemoPanel() {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const { queue, user, drop, allocation, demo, session } = useMockState()

  async function admit() {
    setNote('')
    try {
      await simulateAdmission()
    } catch (e) {
      setNote(e.message)
    }
  }

  return (
    <aside className="fixed bottom-4 right-4 z-40 max-w-[calc(100vw-2rem)]" aria-label="Demo controls (mock only)">
      {open ? (
        <div className="max-h-[80vh] w-80 space-y-4 overflow-y-auto rounded-2xl bg-slate-900 p-4 text-white shadow-2xl ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">Demo controls <span className="ml-1 rounded bg-amber-300 px-1.5 py-0.5 text-[10px] font-bold text-amber-950">MOCK</span></p>
            <button type="button" onClick={() => setOpen(false)} className="text-sm text-slate-300 hover:text-white" aria-label="Close demo controls">✕</button>
          </div>
          <p className="text-xs text-slate-400">Simulates server decisions for Phase 1. Not part of the product.</p>
          <div className="rounded-lg bg-white/5 p-2.5 text-xs tabular-nums ring-1 ring-white/10" aria-label="Inventory">
            <p>remaining <b>{drop.remainingSeats}</b> · locked <b>{drop.lockedSeats}</b> · allocated <b>{drop.allocatedSeats}</b></p>
            <p className="mt-0.5 text-slate-400">total {drop.totalSeats} · {inventoryIsConsistent(drop) ? '✓ sums to total' : '✗ INVARIANT BROKEN'}</p>
            <p className="mt-0.5 text-slate-400">requested {queue.requestedQuantity} · locked for me {queue.lockedQuantity}</p>
          </div>
          {note && <p role="alert" className="rounded-lg bg-rose-500/20 p-2 text-xs text-rose-100">{note}</p>}
          <Row label="Queue state">
            <Btn onClick={admit} active={queue.status === QUEUE_STATUS.ADMITTED}>Simulate Admission</Btn>
            <Btn onClick={() => shortenClaimWindow(5)}>Expire in 5s</Btn>
            <Btn onClick={simulateCooldown} active={queue.status === QUEUE_STATUS.COOLDOWN}>Cooldown</Btn>
            <Btn onClick={simulateReAuth} active={queue.status === QUEUE_STATUS.RE_AUTH_REQUIRED}>Re-auth</Btn>
            <Btn onClick={simulateClosed} active={queue.status === QUEUE_STATUS.CLOSED}>Closed</Btn>
          </Row>
          <Row label="Drop state">
            {Object.values(DROP_STATUS).map((s) => (
              <Btn key={s} onClick={() => setDropStatus(s)} active={drop.status === s}>{s}</Btn>
            ))}
          </Row>
          <Row label="Tickets owned">
            {[0, 1, 2, 3, 4].map((n) => (
              <Btn key={n} onClick={() => setTicketsOwned(n)} active={user.ticketsOwned === n}>{n}</Btn>
            ))}
          </Row>
          <Row label="Next claim">
            <Btn onClick={() => setForceClaimFailure(!demo.forceClaimFailure)} active={demo.forceClaimFailure}>Force failure</Btn>
          </Row>
          <Row label="Allocation state">
            {Object.values(ALLOCATION_STATUS).map((s) => (
              <Btn key={s} onClick={() => simulateAllocationState(s)} active={allocation.status === s}>{s}</Btn>
            ))}
          </Row>
          <Row label="Session">
            <Btn onClick={() => window.location.reload()}>Simulate refresh</Btn>
            <Btn onClick={() => { resetDemo(); window.location.assign('/') }}>Reset all</Btn>
          </Row>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xl ring-1 ring-white/10 hover:bg-slate-800"
        >
          🛠 Demo controls
        </button>
      )}
    </aside>
  )
}
