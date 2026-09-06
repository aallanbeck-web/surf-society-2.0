import type { Member, Tier } from './types'
import { TIERS } from './mockData'

/** Rental days included per month for a tier name, or null if unlimited. */
export function getIncludedDays(tierName: string): number | null {
  const tier = TIERS.find((t) => t.name === tierName)
  return tier ? tier.includedDaysPerMonth : null
}

/** Rental days remaining this month for a member's tier, or null if their tier is unlimited. */
export function getDaysRemaining(member: Pick<Member, 'tier' | 'daysUsedThisMonth'>): number | null {
  const tier = TIERS.find((t) => t.name === member.tier)
  if (!tier || tier.includedDaysPerMonth === null) return null
  return Math.max(0, tier.includedDaysPerMonth - member.daysUsedThisMonth)
}

/** The next tier up from this one, or null if already on the top tier. */
export function getNextTier(tierName: string): Tier | null {
  const idx = TIERS.findIndex((t) => t.name === tierName)
  if (idx === -1 || idx === TIERS.length - 1) return null
  return TIERS[idx + 1]
}

/** True when a member is at or near their monthly included-days limit and could upgrade. */
export function isNearingDayLimit(member: Pick<Member, 'tier' | 'daysUsedThisMonth'>): boolean {
  const remaining = getDaysRemaining(member)
  return remaining !== null && remaining <= 1 && getNextTier(member.tier) !== null
}
