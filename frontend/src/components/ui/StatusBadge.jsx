import Badge from './Badge'

// Status is conveyed with both an icon/shape and text, never colour alone.
const map = {
  // drop
  UPCOMING: ['brand', '◷', 'Upcoming'],
  OPEN: ['green', '●', 'Open'],
  SOLD_OUT: ['red', '✕', 'Sold out'],
  CLOSED: ['slate', '■', 'Drop closed'],
  // queue
  NOT_JOINED: ['slate', '○', 'Not joined'],
  WAITING: ['amber', '◔', "You're in the queue"],
  ADMITTED: ['green', '✓', "You're in!"],
  COMPLETED: ['brand', '✓', 'Tickets confirmed'],
  EXPIRED: ['red', '✕', 'Claim window expired'],
  COOLDOWN: ['amber', '⏸', 'Cooldown'],
  RE_AUTH_REQUIRED: ['amber', '🔒', 'Please sign in again to continue'],
  // allocation
  NONE: ['slate', '○', 'None'],
  PROCESSING: ['brand', '◔', 'Processing'],
  SUCCESS: ['green', '✓', 'Tickets confirmed'],
  FAILED: ['red', '!', 'Failed'],
}

export default function StatusBadge({ status, className = '' }) {
  const [tone, icon, label] = map[status] || ['slate', '○', status]
  return (
    <Badge tone={tone} icon={icon} className={className}>
      <span className="sr-only">Status: </span>
      {label}
    </Badge>
  )
}
