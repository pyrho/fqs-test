export type Tiers = 'Basic' | 'Premium' | 'Pro' | 'Enterprise' | 'Student'

export type YYYYMMDDString = string

export type Plans = {
  id: number
  plan_name: Tiers
  default_amount_cts: number
}

export type OldUser = {
  id: number
  email: string
  sub_plan: Tiers
  mthly_price: number
  start_date: YYYYMMDDString
  ends_at: null | YYYYMMDDString
  active: boolean
}
