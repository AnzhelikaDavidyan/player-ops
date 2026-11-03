export const PLAYER_STATUSES = [
  'Active',
  'Suspended',
  'Self-excluded',
  'Pending KYC',
  'Closed',
] as const
export type PlayerStatus = (typeof PLAYER_STATUSES)[number]

export const VIP_TIERS = ['Bronze', 'Silver', 'Gold', 'Platinum'] as const
export type VipTier = (typeof VIP_TIERS)[number]

export const COUNTRIES = [
  'AT',
  'BR',
  'CA',
  'CH',
  'DE',
  'DK',
  'FI',
  'IE',
  'NL',
  'NO',
  'NZ',
  'SE',
] as const
export type Country = (typeof COUNTRIES)[number]

export interface Player {
  id: string
  username: string
  email: string
  country: Country
  status: PlayerStatus
  vipTier: VipTier
  balance: number
  /** 0–100; amber from 45, red from 75 */
  riskScore: number
  /** YYYY-MM-DD */
  registeredAt: string
  /** ISO date-time */
  lastLoginAt: string
  depositsTotal: number
  netLoss: number
  currency: 'EUR'
}
