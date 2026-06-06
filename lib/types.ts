export type Tier = 'silver' | 'gold' | 'diamond'

export interface Member {
  id: string
  phone: string
  name: string
  rides_count: number
  tier: Tier
  expires_at: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Advantage {
  id: string
  title: string
  description: string
  icon: string
  required_tier: Tier
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Update {
  id: string
  title: string
  body: string
  type: 'reward' | 'collection' | 'commission' | 'general'
  commission_days: number | null
  is_active: boolean
  created_at: string
}

export const TIER_THRESHOLDS = {
  silver:  { min: 0,   max: 59  },
  gold:    { min: 60,  max: 149 },
  diamond: { min: 150, max: Infinity },
}

export function getTierFromRides(rides: number): Tier {
  if (rides >= 150) return 'diamond'
  if (rides >= 60)  return 'gold'
  return 'silver'
}

export function getTierProgress(rides: number): number {
  if (rides >= 150) return 100
  if (rides >= 60)  return Math.round(((rides - 60) / 90) * 100)
  return Math.round((rides / 60) * 100)
}

export function getRidesUntilNext(rides: number): { count: number; nextTier: Tier } | null {
  if (rides >= 150) return null
  if (rides >= 60)  return { count: 150 - rides, nextTier: 'diamond' }
  return { count: 60 - rides, nextTier: 'gold' }
}
