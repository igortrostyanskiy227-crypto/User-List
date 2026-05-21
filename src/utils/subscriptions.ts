import { type Subscription, type SubscriptionStatus, type SubscriptionType } from '../types'

export function groupByStatus(subscriptions: Subscription[]): Record<SubscriptionStatus, Subscription[]> {
  const groups: Record<SubscriptionStatus, Subscription[]> = {
    active: [],
    expired: [],
    unactivated: [],
    unavailable: [],
  }
  for (const sub of subscriptions) {
    groups[sub.status].push(sub)
  }
  return groups
}

// Among expired subscriptions keep only the latest per type
export function deduplicateExpired(expired: Subscription[]): Subscription[] {
  const latest: Map<SubscriptionType, Subscription> = new Map()
  for (const sub of expired) {
    const existing = latest.get(sub.type)
    if (!existing || (sub.validTo ?? '') > (existing.validTo ?? '')) {
      latest.set(sub.type, sub)
    }
  }
  return Array.from(latest.values())
}

export function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function countActiveSubscriptions(subscriptions: Subscription[]): number {
  return subscriptions.filter(s => s.status === 'active').length
}
