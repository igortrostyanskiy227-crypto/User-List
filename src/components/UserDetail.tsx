import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Phone, Calendar, CheckCircle2, Clock, AlertCircle, Ban, X
} from 'lucide-react'
import { type User, type SubscriptionStatus, SUBSCRIPTION_LABELS, STATUS_LABELS } from '../types'
import { groupByStatus, deduplicateExpired, formatDate } from '../utils/subscriptions'

interface SectionProps {
  title: string
  icon: React.ReactNode
  color: string
  children: React.ReactNode
}

function Section({ title, icon, color, children }: SectionProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span style={{ color }}>{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color }}>
          {title}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {children}
      </div>
    </div>
  )
}

interface SubItemProps {
  label: string
  status: SubscriptionStatus
  dateLabel?: string
  dateValue?: string
}

const STATUS_META: Record<SubscriptionStatus, { color: string; bg: string }> = {
  active: { color: 'var(--status-active)', bg: 'var(--status-active-dim)' },
  expired: { color: 'var(--status-expired)', bg: 'var(--status-expired-dim)' },
  unactivated: { color: 'var(--status-inactive)', bg: 'var(--status-inactive-dim)' },
  unavailable: { color: 'var(--status-unavailable)', bg: 'var(--status-unavailable-dim)' },
}

function SubItem({ label, status, dateLabel, dateValue }: SubItemProps) {
  const { color, bg } = STATUS_META[status]
  return (
    <div
      className="flex items-center justify-between px-3.5 py-2.5 rounded-xl gap-3"
      style={{ background: bg, border: `1px solid ${color}18` }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="shrink-0 rounded-full"
          style={{
            width: 6,
            height: 6,
            background: color,
            opacity: status === 'unavailable' ? 0.4 : 1,
          }}
        />
        <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
          {label}
        </span>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-0.5">
        <span className="text-[11px] font-medium" style={{ color }}>
          {STATUS_LABELS[status]}
        </span>
        {dateLabel && dateValue && (
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
            {dateLabel} {dateValue}
          </span>
        )}
      </div>
    </div>
  )
}

interface Props {
  user: User | null
  onClose: () => void
}

export function UserDetail({ user, onClose }: Props) {
  return (
    <AnimatePresence mode="wait">
      {user ? (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
          className="h-full flex flex-col overflow-hidden"
          style={{ background: 'var(--panel)', borderLeft: '1px solid var(--border)' }}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex items-start justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-base font-semibold select-none shrink-0"
                style={{
                  background: 'var(--primary-dim)',
                  color: 'var(--primary)',
                  border: '1px solid rgba(84,159,213,0.25)',
                }}
              >
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {user.name}
                </h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  Пользователь с {formatDate(user.registeredAt)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--surface)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Contacts */}
          <div
            className="mx-6 mb-5 px-4 py-3 rounded-xl flex flex-col gap-2"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2.5">
              <Mail size={13} style={{ color: 'var(--text-muted)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2.5">
                <Phone size={13} style={{ color: 'var(--text-muted)' }} />
                <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                  {user.phone}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2.5">
              <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Зарегистрирован {formatDate(user.registeredAt)}
              </span>
            </div>
          </div>

          {/* Subscriptions */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-5 min-h-0">
            <DetailSections user={user} />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full flex flex-col items-center justify-center gap-3"
          style={{
            background: 'var(--panel)',
            borderLeft: '1px solid var(--border)',
          }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <CheckCircle2 size={20} style={{ color: 'var(--text-muted)' }} />
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Выберите пользователя
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function DetailSections({ user }: { user: User }) {
  const groups = groupByStatus(user.subscriptions)
  const dedupExpired = deduplicateExpired(groups.expired)

  return (
    <>
      {groups.active.length > 0 && (
        <Section
          title="Активные"
          color="var(--status-active)"
          icon={<CheckCircle2 size={13} />}
        >
          {groups.active.map(sub => (
            <SubItem
              key={sub.id}
              label={SUBSCRIPTION_LABELS[sub.type]}
              status="active"
              dateLabel="до"
              dateValue={formatDate(sub.validTo)}
            />
          ))}
        </Section>
      )}

      {groups.unactivated.length > 0 && (
        <Section
          title="Не активированы"
          color="var(--status-inactive)"
          icon={<Clock size={13} />}
        >
          {groups.unactivated.map(sub => (
            <SubItem
              key={sub.id}
              label={SUBSCRIPTION_LABELS[sub.type]}
              status="unactivated"
              dateLabel="куплена"
              dateValue={formatDate(sub.purchasedAt)}
            />
          ))}
        </Section>
      )}

      {dedupExpired.length > 0 && (
        <Section
          title="Истекшие"
          color="var(--status-expired)"
          icon={<AlertCircle size={13} />}
        >
          {dedupExpired.map(sub => (
            <SubItem
              key={sub.id}
              label={SUBSCRIPTION_LABELS[sub.type]}
              status="expired"
              dateLabel="истекла"
              dateValue={formatDate(sub.validTo)}
            />
          ))}
        </Section>
      )}

      {groups.unavailable.length > 0 && (
        <Section
          title="Недоступны"
          color="var(--status-unavailable)"
          icon={<Ban size={13} />}
        >
          {groups.unavailable.map(sub => (
            <SubItem
              key={sub.id}
              label={SUBSCRIPTION_LABELS[sub.type]}
              status="unavailable"
            />
          ))}
        </Section>
      )}
    </>
  )
}
