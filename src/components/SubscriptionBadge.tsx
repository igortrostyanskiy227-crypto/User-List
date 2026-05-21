import { type SubscriptionStatus, type SubscriptionType, SUBSCRIPTION_LABELS, STATUS_LABELS } from '../types'

const STATUS_COLORS: Record<SubscriptionStatus, { color: string; bg: string }> = {
  active: { color: 'var(--status-active)', bg: 'var(--status-active-dim)' },
  expired: { color: 'var(--status-expired)', bg: 'var(--status-expired-dim)' },
  unactivated: { color: 'var(--status-inactive)', bg: 'var(--status-inactive-dim)' },
  unavailable: { color: 'var(--status-unavailable)', bg: 'var(--status-unavailable-dim)' },
}

interface Props {
  type: SubscriptionType
  status: SubscriptionStatus
  validTo?: string
  purchasedAt?: string
  compact?: boolean
}

export function SubscriptionBadge({ type, status, compact = false }: Props) {
  const { color, bg } = STATUS_COLORS[status]

  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium"
        style={{ color, background: bg }}
      >
        <span
          className="inline-block rounded-full shrink-0"
          style={{ width: 5, height: 5, background: color, opacity: status === 'unavailable' ? 0.5 : 1 }}
        />
        {SUBSCRIPTION_LABELS[type]}
      </span>
    )
  }

  return (
    <div
      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl"
      style={{ background: bg, border: `1px solid ${color}22` }}
    >
      <div className="flex items-center gap-2">
        <span
          className="inline-block rounded-full shrink-0"
          style={{ width: 6, height: 6, background: color, opacity: status === 'unavailable' ? 0.4 : 1 }}
        />
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {SUBSCRIPTION_LABELS[type]}
        </span>
      </div>
      <span className="text-xs" style={{ color }}>
        {STATUS_LABELS[status]}
      </span>
    </div>
  )
}
