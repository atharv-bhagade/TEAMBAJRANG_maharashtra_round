export default function ConnectionStatus({ connected = true }) {
  return (
    <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
      <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
        {connected && <span className="fd-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400" />}
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-slate-400'}`} />
      </span>
      {connected ? 'Connected' : 'Reconnecting…'}
    </p>
  )
}
