import StatusBadge from '../ui/StatusBadge'
import ConnectionStatus from './ConnectionStatus'

// Compact status strip: queue state + connection. Deliberately shows NO queue position.
export default function QueueStatus({ status, connected = true }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <StatusBadge status={status} />
      <ConnectionStatus connected={connected} />
    </div>
  )
}
