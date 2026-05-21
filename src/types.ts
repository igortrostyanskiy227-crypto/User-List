export type SubscriptionType =
  | 'wind'
  | 'relief'
  | 'metar'
  | 'notam'
  | 'sigmet'

export type SubscriptionStatus =
  | 'active'
  | 'expired'
  | 'unactivated'
  | 'unavailable'

export interface Subscription {
  id: string
  type: SubscriptionType
  status: SubscriptionStatus
  purchasedAt?: string
  validFrom?: string
  validTo?: string
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  registeredAt: string
  subscriptions: Subscription[]
}

export const SUBSCRIPTION_LABELS: Record<SubscriptionType, string> = {
  wind: 'Ветер',
  relief: 'Рельеф',
  metar: 'Погода METAR',
  notam: 'NOTAM',
  sigmet: 'SIGMET / AIRMET',
}

export const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: 'Активна',
  expired: 'Истекла',
  unactivated: 'Не активирована',
  unavailable: 'Недоступна',
}
