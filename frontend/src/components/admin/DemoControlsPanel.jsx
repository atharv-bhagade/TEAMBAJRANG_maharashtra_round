import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  resetDemoState,
  testTicketLimitScenario,
  simulateSuccessfulAllocation,
  simulateClaimExpiryFlow,
  simulateLowInventory,
  simulateSoldOut,
  simulateQueueState,
  simulateAdmissionState,
  getState,
} from '../../mock/mockState'
import { useAuth } from '../../hooks/useAuth'

export default function DemoControlsPanel() {
  const navigate = useNavigate()
  const { forceReauth, user } = useAuth()
  const [notification, setNotification] = useState(null)
  const [scenarioResult, setScenarioResult] = useState(null)

  const showNotice = (msg, type = 'success') => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 4000)
  }

  // A. Reset Demo
  const handleResetDemo = () => {
    resetDemoState()
    setScenarioResult(null)
    showNotice('Demo state reset to initial values. Configured events preserved.', 'success')
  }

  // B. Ticket Limit Scenarios
  const runScenario = (booked, requested) => {
    const res = testTicketLimitScenario(booked, requested)
    setScenarioResult(res)
    if (res.allowed) {
      showNotice(res.message, 'success')
    } else {
      showNotice(res.message, 'error')
    }
  }

  // C. Successful Allocation
  const handleSimulateSuccessfulClaim = () => {
    const res = simulateSuccessfulAllocation(2)
    showNotice(`Claim simulated successfully! Allocation ID: ${res.allocationId}. Redirecting to Allocation Result...`, 'success')
    setTimeout(() => {
      navigate('/allocation')
    }, 800)
  }

  // D. Claim Expiry
  const handleSimulateClaimExpiry = () => {
    simulateClaimExpiryFlow()
    showNotice('Claim expiry lifecycle initiated: QUEUED → ADMITTED → EXPIRED. Navigating to queue…', 'warning')
    setTimeout(() => {
      navigate('/queue')
    }, 600)
  }

  // E. Low Inventory / Sold Out
  const handleSimulateLowInventory = () => {
    simulateLowInventory()
    showNotice('Low inventory state activated: Remaining inventory set to 2 seats.', 'warning')
  }

  const handleSimulateSoldOut = () => {
    simulateSoldOut()
    showNotice('Sold out state activated: Remaining inventory set to 0 seats.', 'error')
  }

  // F. Re-authentication
  const handleForceReauth = () => {
    forceReauth(window.location.pathname)
    navigate('/login')
  }

  // G. Queue / Admission
  const handleSimulateQueue = () => {
    simulateQueueState()
    showNotice('Queue simulated (QUEUED / WAITING). Navigating to Waiting Room…', 'info')
    setTimeout(() => {
      navigate('/queue')
    }, 500)
  }

  const handleSimulateAdmission = () => {
    simulateAdmissionState()
    showNotice('Admission simulated (ADMITTED → Claim window active). Navigating to claim screen…', 'success')
    setTimeout(() => {
      navigate('/queue')
    }, 500)
  }

  const appState = getState()

  return (
    <div className="space-y-6 rounded-3xl bg-[#13131F] border border-white/10 p-6 sm:p-8 text-white shadow-2xl">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-400/20 text-amber-300 text-sm font-bold border border-amber-400/30">
              🛠️
            </span>
            <h2 className="font-display text-xl font-bold text-white">
              Demo Controls & Lifecycle Simulator
            </h2>
            <span className="rounded bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/30 uppercase tracking-wider">
              Debug Panel
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate platform business rules, admission lifecycles, and verification flows.
          </p>
        </div>

        {/* Global Reset Button (Section A) */}
        <div>
          <button
            type="button"
            onClick={handleResetDemo}
            className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-rose-600 to-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-950/60 hover:from-rose-500 hover:to-red-500 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>↻</span>
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Toast Notification Banner */}
      {notification && (
        <div
          role="alert"
          className={`p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-between border fd-fade-up ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
              : notification.type === 'error'
              ? 'bg-rose-950/80 border-rose-500/40 text-rose-200'
              : notification.type === 'warning'
              ? 'bg-amber-950/80 border-amber-500/40 text-amber-200'
              : 'bg-indigo-950/80 border-indigo-500/40 text-indigo-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base">
              {notification.type === 'success' ? '✓' : notification.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span>{notification.msg}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-xs opacity-75 hover:opacity-100 underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid of Simulator Controls */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* ================= SECTION B: TICKET LIMIT SCENARIOS ================= */}
        <div className="md:col-span-2 rounded-2xl bg-[#171727] border border-white/5 p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🎟️</span>
              <span>Ticket Limit Scenarios (Max 4 Cumulative Tickets Rule)</span>
            </h3>
            <span className="text-[11px] font-mono text-violet-300 bg-violet-950/70 px-2 py-0.5 rounded border border-violet-500/20">
              Rule: Max 4 / User
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Test exact boundary conditions. Rejected scenarios do not mutate booked state or create allocations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* Scenario 1 */}
            <button
              type="button"
              onClick={() => runScenario(0, 4)}
              className="rounded-xl bg-white/5 p-3 text-left border border-white/10 hover:border-emerald-500/40 hover:bg-white/10 transition-all text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">0 booked → request 4</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  ALLOWED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Total: 4 / 4</p>
            </button>

            {/* Scenario 2 */}
            <button
              type="button"
              onClick={() => runScenario(1, 3)}
              className="rounded-xl bg-white/5 p-3 text-left border border-white/10 hover:border-emerald-500/40 hover:bg-white/10 transition-all text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">1 booked → request 3</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  ALLOWED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Total: 4 / 4</p>
            </button>

            {/* Scenario 3 */}
            <button
              type="button"
              onClick={() => runScenario(2, 2)}
              className="rounded-xl bg-white/5 p-3 text-left border border-white/10 hover:border-emerald-500/40 hover:bg-white/10 transition-all text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">2 booked → request 2</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  ALLOWED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Total: 4 / 4</p>
            </button>

            {/* Scenario 4 */}
            <button
              type="button"
              onClick={() => runScenario(3, 1)}
              className="rounded-xl bg-white/5 p-3 text-left border border-white/10 hover:border-emerald-500/40 hover:bg-white/10 transition-all text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">3 booked → request 1</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  ALLOWED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Total: 4 / 4</p>
            </button>

            {/* Scenario 5 */}
            <button
              type="button"
              onClick={() => runScenario(4, 1)}
              className="rounded-xl bg-rose-950/20 p-3 text-left border border-rose-500/30 hover:border-rose-400 hover:bg-rose-950/40 transition-all text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-rose-200">4 booked → request 1</span>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-500/40">
                  REJECTED
                </span>
              </div>
              <p className="text-[11px] text-rose-300/70 mt-1">Total: 5 &gt; 4</p>
            </button>

            {/* Scenario 6 */}
            <button
              type="button"
              onClick={() => runScenario(2, 3)}
              className="rounded-xl bg-rose-950/20 p-3 text-left border border-rose-500/30 hover:border-rose-400 hover:bg-rose-950/40 transition-all text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-rose-200">2 booked → request 3</span>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-500/40">
                  REJECTED
                </span>
              </div>
              <p className="text-[11px] text-rose-300/70 mt-1">Total: 5 &gt; 4</p>
            </button>

            {/* Scenario 7 */}
            <button
              type="button"
              onClick={() => runScenario(2, 4)}
              className="rounded-xl bg-rose-950/20 p-3 text-left border border-rose-500/30 hover:border-rose-400 hover:bg-rose-950/40 transition-all text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-rose-200">2 booked → request 4</span>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-500/40">
                  REJECTED
                </span>
              </div>
              <p className="text-[11px] text-rose-300/70 mt-1">Total: 6 &gt; 4</p>
            </button>
          </div>

          {/* Interactive Result Feedback Banner */}
          {scenarioResult && (
            <div
              className={`mt-4 p-3.5 rounded-xl text-xs flex items-center gap-2 border fd-fade-up ${
                scenarioResult.allowed
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
              }`}
            >
              <span className="text-base">{scenarioResult.allowed ? '✓' : '✕'}</span>
              <span>{scenarioResult.message}</span>
            </div>
          )}
        </div>

        {/* ================= SECTION C: SUCCESSFUL ALLOCATION ================= */}
        <div className="rounded-2xl bg-[#171727] border border-white/5 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🏆</span>
                <span>Successful Allocation</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Simulates a confirmed claim allocation and renders the existing AllocationResult screen with full event, user, and ticket details.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSimulateSuccessfulClaim}
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 transition-colors cursor-pointer"
          >
            Simulate Successful Claim
          </button>
        </div>

        {/* ================= SECTION D: CLAIM EXPIRY ================= */}
        <div className="rounded-2xl bg-[#171727] border border-white/5 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>⏱️</span>
                <span>Claim Expiry (Terminal)</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Simulates: QUEUED → ADMITTED → CLAIM WINDOW EXPIRES → LOCKED TICKETS RELEASED. Expiry is terminal (no retry allowed).
            </p>
          </div>
          <button
            type="button"
            onClick={handleSimulateClaimExpiry}
            className="w-full rounded-xl bg-amber-600 hover:bg-amber-500 py-3 text-xs font-bold text-white shadow-lg shadow-amber-950/50 transition-colors cursor-pointer"
          >
            Simulate Claim Expiry
          </button>
        </div>

        {/* ================= SECTION E: LOW INVENTORY / SOLD OUT ================= */}
        <div className="rounded-2xl bg-[#171727] border border-white/5 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>📊</span>
                <span>Inventory Edge Cases</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Test low stock availability and sold-out states on active show cards without deleting configured events.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleSimulateLowInventory}
              className="rounded-xl bg-white/10 hover:bg-white/15 py-2.5 text-xs font-bold text-amber-300 border border-amber-500/30 transition-colors cursor-pointer"
            >
              Simulate Low Inventory
            </button>
            <button
              type="button"
              onClick={handleSimulateSoldOut}
              className="rounded-xl bg-white/10 hover:bg-white/15 py-2.5 text-xs font-bold text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
            >
              Simulate Sold Out
            </button>
          </div>
        </div>

        {/* ================= SECTION F: RE-AUTHENTICATION ================= */}
        <div className="rounded-2xl bg-[#171727] border border-white/5 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>🔒</span>
                <span>Session Re-Authentication</span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Invalidates current frontend session, stores current route, redirects to /login with re-auth verification message, and restores route upon login.
            </p>
          </div>
          <button
            type="button"
            onClick={handleForceReauth}
            className="w-full rounded-xl bg-violet-600 hover:bg-violet-500 py-3 text-xs font-bold text-white shadow-lg shadow-violet-950/50 transition-colors cursor-pointer"
          >
            Force Re-authentication
          </button>
        </div>

        {/* ================= SECTION G: QUEUE / ADMISSION ================= */}
        <div className="md:col-span-2 rounded-2xl bg-[#171727] border border-white/5 p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🚶</span>
              <span>Queue & Admission Lifecycle</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              Queue Status: <strong className="text-violet-300 font-mono">{appState.queue?.status || 'IDLE'}</strong>
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Transition state machine between waiting room queueing and active admission with claim window lock.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleSimulateQueue}
              className="rounded-xl bg-white/5 hover:bg-white/10 p-3 text-xs font-semibold text-slate-200 border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>⏳</span>
              <span>Simulate Queue (Waiting Room)</span>
            </button>
            <button
              type="button"
              onClick={handleSimulateAdmission}
              className="rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 p-3 text-xs font-semibold text-emerald-200 border border-emerald-500/40 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>🎫</span>
              <span>Simulate Admission (Claim Active)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
