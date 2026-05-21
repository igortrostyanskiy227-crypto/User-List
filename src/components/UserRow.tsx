import { motion } from 'framer-motion'
import { type User, type SubscriptionStatus } from '../types'
import { SubscriptionBadge } from './SubscriptionBadge'
import { countActiveSubscriptions } from '../utils/subscriptions'
import { ChevronRight } from 'lucide-react'

interface Props {
  user: User
  selected: boolean
  onClick: () => void
  index: number
}

const STATUS_ORDER: SubscriptionStatus[] = ['active', 'unactivated', 'expired', 'unavailable']

export function UserRow({ user, selected, onClick, index }: Props) {
  const activeCount = countActiveSubscriptions(user.subscriptions)

  // Pick the most prominent subscription statuses for preview (1-3 unique active/unactivated)
  const previewSubs = STATUS_ORDER
    .flatMap(status => user.subscriptions.filter(s => s.status === status))
    .slice(0, 3)

  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      onClick={onClick}
      className="w-full text-left px-4 py-3.5 flex items-center gap-4 transition-colors rounded-xl group"
      style={{
        background: selected ? 'var(--surface-hover)' : 'transparent',
        border: `1px solid ${selected ? 'var(--border-hover)' : 'transparent'}`,
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.background = 'var(--surface)'
          e.currentTarget.style.borderColor = 'var(--border)'
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'transparent'
        }
      }}
    >
      {/* Avatar */}
      <div
        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium select-none"
        style={{
          background: selected ? 'var(--primary-dim)' : 'var(--surface)',
          color: selected ? 'var(--primary)' : 'var(--text-secondary)',
          border: `1px solid ${selected ? 'rgba(84,159,213,0.3)' : 'var(--border)'}`,
        }}
      >
        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-medium truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {user.name}
          </span>
          {activeCount > 0 && (
            <span
              className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-md tabular-nums"
              style={{ background: 'var(--status-active-dim)', color: 'var(--status-active)' }}
            >
              {activeCount}
            </span>
          )}
        </div>
        <div
          className="text-xs truncate mt-0.5"
          style={{ color: 'var(--text-muted)' }}
        >
          {user.email}
        </div>
      </div>

      {/* Subscription preview chips */}
      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        {previewSubs.map(sub => (
          <SubscriptionBadge key={sub.id} type={sub.type} status={sub.status} compact />
        ))}
      </div>

      {/* Arrow */}
      <ChevronRight
        size={14}
        className="shrink-0 transition-all"
        style={{
          color: selected ? 'var(--primary)' : 'var(--text-muted)',
          opacity: selected ? 1 : 0,
        }}
      />
    </motion.button>
  )
}
