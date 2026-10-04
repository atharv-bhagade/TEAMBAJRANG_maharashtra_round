import { useState, useEffect, useRef, useCallback } from 'react'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateCaptchaCode(length = 5) {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return result
}

export default function HumanVerificationModal({
  isOpen,
  onClose,
  onSuccess,
  event,
  quantity,
}) {
  const [step, setStep] = useState(1) // 1: Visual Canvas Captcha, 2: Interaction Pattern Test
  const [captchaCode, setCaptchaCode] = useState(() => generateCaptchaCode())
  const [userInput, setUserInput] = useState('')
  const [captchaError, setCaptchaError] = useState('')
  const [step1Done, setStep1Done] = useState(false)

  // Interaction Test states: mode can be 'hold' or 'target'
  const [interactionMode, setInteractionMode] = useState('hold') // 'hold' | 'target'
  
  // Hold-down verification state
  const [holding, setHolding] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const holdIntervalRef = useRef(null)

  // 3-Click Target test state
  const [clicksCount, setClicksCount] = useState(0)
  const [targetPos, setTargetPos] = useState({ top: 40, left: 50 })

  const [verifyingSuccess, setVerifyingSuccess] = useState(false)
  const canvasRef = useRef(null)

  // Draw procedural canvas CAPTCHA with noise, angles, and distortion
  const renderCanvas = useCallback((code) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#151522')
    gradient.addColorStop(1, '#0D0D18')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Noise dots
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = `rgba(${120 + Math.random() * 100}, ${100 + Math.random() * 100}, 245, ${0.15 + Math.random() * 0.25})`
      ctx.beginPath()
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // Distorted noise lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(168, 85, 247, ${0.25 + Math.random() * 0.2})`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(Math.random() * 20, Math.random() * height)
      ctx.bezierCurveTo(
        width * 0.3,
        Math.random() * height,
        width * 0.7,
        Math.random() * height,
        width - Math.random() * 10,
        Math.random() * height
      )
      ctx.stroke()
    }

    // Characters with random font sizes, rotations and offset
    const charWidth = (width - 30) / code.length
    for (let i = 0; i < code.length; i++) {
      const char = code[i]
      ctx.save()
      const x = 20 + i * charWidth
      const y = height / 2 + (Math.random() * 8 - 4)
      ctx.translate(x, y)
      const angle = (Math.random() * 30 - 15) * (Math.PI / 180)
      ctx.rotate(angle)

      ctx.font = `bold ${26 + Math.floor(Math.random() * 5)}px "Sora", "Inter", sans-serif`
      ctx.fillStyle = i % 2 === 0 ? '#E0E7FF' : '#C084FC'
      ctx.shadowColor = 'rgba(168, 85, 247, 0.5)'
      ctx.shadowBlur = 8
      ctx.fillText(char, -8, 8)
      ctx.restore()
    }
  }, [])

  useEffect(() => {
    if (isOpen && step === 1) {
      const newCode = generateCaptchaCode()
      setCaptchaCode(newCode)
      setUserInput('')
      setCaptchaError('')
      setTimeout(() => renderCanvas(newCode), 50)
    }
  }, [isOpen, step, renderCanvas])

  const refreshCaptcha = () => {
    const newCode = generateCaptchaCode()
    setCaptchaCode(newCode)
    setUserInput('')
    setCaptchaError('')
    renderCanvas(newCode)
  }

  // Handle Step 1 Verification
  const verifyStep1 = (e) => {
    if (e) e.preventDefault()
    if (!userInput.trim()) {
      setCaptchaError('Please enter the characters shown above.')
      return
    }

    if (userInput.trim().toUpperCase() === captchaCode.toUpperCase()) {
      setCaptchaError('')
      setStep1Done(true)
      // Advance to step 2 after brief check
      setTimeout(() => {
        setStep(2)
      }, 350)
    } else {
      setCaptchaError('Security code does not match. Please try again.')
      refreshCaptcha()
    }
  }

  // Step 2: Hold down handlers
  const startHold = () => {
    if (verifyingSuccess) return
    setHolding(true)
    const startTime = Date.now()
    const targetDuration = 1200 // 1.2s to reach 100%

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(100, Math.floor((elapsed / targetDuration) * 100))
      setHoldProgress(progress)

      if (progress >= 100) {
        clearInterval(holdIntervalRef.current)
        completeVerification()
      }
    }, 20)
  }

  const endHold = () => {
    if (holdProgress >= 100) return
    setHolding(false)
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current)
    }
    setHoldProgress(0)
  }

  // Step 2: 3-Click Target handler
  const handleTargetClick = () => {
    const nextCount = clicksCount + 1
    setClicksCount(nextCount)
    if (nextCount >= 3) {
      completeVerification()
    } else {
      // Randomly move target within container (15% to 80%)
      setTargetPos({
        top: 20 + Math.floor(Math.random() * 55),
        left: 20 + Math.floor(Math.random() * 60),
      })
    }
  }

  const completeVerification = () => {
    setVerifyingSuccess(true)
    setTimeout(() => {
      onSuccess()
    }, 700)
  }

  if (!isOpen) return null

  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (holdProgress / 100) * circumference

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-[#13131F] border border-white/10 p-6 sm:p-8 shadow-2xl shadow-purple-950/40 fd-fade-up">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-950/80 px-2.5 py-0.5 text-xs font-semibold text-violet-300 border border-violet-500/30">
              🛡️ Security Check
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">
              Verify To Complete Booking
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {event?.title} · <strong className="text-white">{quantity} ticket{quantity > 1 ? 's' : ''}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close verification"
          >
            ✕
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-medium">
          <div
            className={`flex items-center gap-2 rounded-xl p-2.5 border transition-all ${
              step1Done
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                : step === 1
                ? 'bg-violet-950/40 border-violet-500/40 text-violet-200'
                : 'bg-white/5 border-white/5 text-slate-500'
            }`}
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white/10 text-[10px]">
              {step1Done ? '✓' : '1'}
            </span>
            <span>Visual CAPTCHA</span>
          </div>
          <div
            className={`flex items-center gap-2 rounded-xl p-2.5 border transition-all ${
              verifyingSuccess
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                : step === 2
                ? 'bg-violet-950/40 border-violet-500/40 text-violet-200'
                : 'bg-white/5 border-white/5 text-slate-500'
            }`}
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white/10 text-[10px]">
              {verifyingSuccess ? '✓' : '2'}
            </span>
            <span>Presence Test</span>
          </div>
        </div>

        {/* ================= STEP 1: VISUAL CANVAS CAPTCHA ================= */}
        {step === 1 && (
          <div className="mt-6 space-y-4">
            <p className="text-xs text-slate-300">
              Enter the 5 characters shown in the security image:
            </p>

            {/* Canvas Container */}
            <div className="flex items-center gap-3">
              <div className="overflow-hidden rounded-2xl border border-white/15 shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={220}
                  height={68}
                  className="block cursor-pointer"
                  onClick={refreshCaptcha}
                  title="Click to refresh image"
                />
              </div>

              <button
                type="button"
                onClick={refreshCaptcha}
                className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
                title="Generate new image"
              >
                <span>↻</span>
                <span>Refresh</span>
              </button>
            </div>

            <form onSubmit={verifyStep1} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={5}
                  value={userInput}
                  onChange={(e) => {
                    setUserInput(e.target.value.toUpperCase())
                    setCaptchaError('')
                  }}
                  placeholder="Enter code (e.g. 9K3XM)"
                  className="block w-full rounded-xl border border-white/15 bg-[#1B1B2A] px-4 py-3 text-lg font-mono tracking-widest text-white placeholder:text-slate-500 placeholder:text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 text-center uppercase"
                  autoFocus
                />
              </div>

              {captchaError && (
                <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/30">
                  {captchaError}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/50 hover:from-violet-500 hover:to-indigo-500 transition-all cursor-pointer"
              >
                Verify Code & Continue →
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP 2: HUMAN PRESENCE INTERACTION TEST ================= */}
        {step === 2 && (
          <div className="mt-6 space-y-4">
            {/* Interaction mode tab */}
            <div className="flex rounded-xl bg-black/40 p-1 border border-white/5 text-xs">
              <button
                type="button"
                onClick={() => { setInteractionMode('hold'); setClicksCount(0); }}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  interactionMode === 'hold'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Hold to Confirm
              </button>
              <button
                type="button"
                onClick={() => { setInteractionMode('target'); setHoldProgress(0); }}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  interactionMode === 'target'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tap Target (3x)
              </button>
            </div>

            {/* Mode A: Press & Hold with Animated Circular Progress */}
            {interactionMode === 'hold' && (
              <div className="text-center py-4">
                <p className="text-xs text-slate-300 mb-6">
                  Press and hold the button below until the circle fills completely.
                </p>

                <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
                  {/* SVG Circular Progress Ring */}
                  <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-white/10"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-violet-500 transition-all"
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>

                  {/* Interactive Button */}
                  <button
                    type="button"
                    onMouseDown={startHold}
                    onMouseUp={endHold}
                    onMouseLeave={endHold}
                    onTouchStart={startHold}
                    onTouchEnd={endHold}
                    disabled={verifyingSuccess}
                    className={`h-24 w-24 rounded-full font-semibold text-xs transition-all flex flex-col items-center justify-center select-none shadow-xl cursor-pointer ${
                      verifyingSuccess
                        ? 'bg-emerald-500 text-white scale-105'
                        : holding
                        ? 'bg-violet-600 text-white scale-95 shadow-violet-900/80 ring-4 ring-violet-400/50'
                        : 'bg-[#1E1E2F] hover:bg-[#28283E] text-slate-200 border border-white/10'
                    }`}
                  >
                    {verifyingSuccess ? (
                      <span className="text-2xl">✓</span>
                    ) : holding ? (
                      <>
                        <span className="text-lg font-bold">{holdProgress}%</span>
                        <span className="text-[10px] text-violet-200">HOLDING</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">👆</span>
                        <span className="text-[11px] font-bold mt-0.5">PRESS & HOLD</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Mode B: 3-Click Target Challenge */}
            {interactionMode === 'target' && (
              <div className="py-2">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                  <span>Click the target indicator:</span>
                  <span className="font-bold text-violet-300 font-mono">
                    Progress: {clicksCount} / 3
                  </span>
                </div>

                <div className="relative h-44 w-full rounded-2xl bg-black/50 border border-white/10 overflow-hidden">
                  <div
                    onClick={handleTargetClick}
                    style={{
                      top: `${targetPos.top}%`,
                      left: `${targetPos.left}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-violet-600 text-white font-bold cursor-pointer shadow-lg shadow-violet-950 transition-all duration-150 hover:scale-110 active:scale-95 ring-4 ring-violet-400/30"
                  >
                    <span>🎯</span>
                  </div>
                </div>
                <p className="mt-2 text-center text-[11px] text-slate-400">
                  Target repositioning simulates human reflex pattern validation.
                </p>
              </div>
            )}

            {verifyingSuccess && (
              <div className="rounded-xl bg-emerald-950/70 border border-emerald-500/40 p-3 text-center text-sm font-semibold text-emerald-200 fd-fade-up">
                ✓ Verification Complete! Finalizing booking…
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <p className="mt-6 text-center text-[11px] text-slate-500">
          Instant booking confirmation will be attached to your account upon verification.
        </p>
      </div>
    </div>
  )
}
