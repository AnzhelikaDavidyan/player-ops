import type { Country, VipTier } from './player'

export type Product = 'casino' | 'sport'
export type BonusStatus = 'Active' | 'Paused' | 'Draft'
export type AssignmentMode = 'auto' | 'manual'

interface BonusBase {
  id: string
  name: string
  code: string
  status: BonusStatus
  assignment: AssignmentMode
  validFrom: string
  validTo: string
  minVip: VipTier
  /** Empty means every country */
  countries: Country[]
}

/** One member per bonus type: `type` decides the shape of `rules`. */
export type Bonus = BonusBase &
  (
    | {
        product: 'casino'
        type: 'welcome' | 'reload'
        rules: {
          matchPercent: number
          maxBonus: number
          minDeposit: number
          wagering: number
        }
      }
    | {
        product: 'casino'
        type: 'free_spins'
        rules: {
          spins: number
          spinValue: number
          game: string
          wagering: number
        }
      }
    | {
        product: 'casino'
        type: 'cashback'
        rules: {
          percent: number
          maxCashback: number
          period: 'daily' | 'weekly' | 'monthly'
        }
      }
    | {
        product: 'casino'
        type: 'no_deposit'
        rules: { amount: number; maxWin: number; wagering: number }
      }
    | {
        product: 'sport'
        type: 'free_bet'
        rules: { amount: number; minOdds: number }
      }
    | {
        product: 'sport'
        type: 'acca_boost'
        rules: { minLegs: number; table: { legs: number; percent: number }[] }
      }
    | {
        product: 'sport'
        type: 'risk_free'
        rules: {
          maxStake: number
          refundAs: 'free bet' | 'cash' | 'bonus funds'
        }
      }
    | {
        product: 'sport'
        type: 'odds_boost'
        rules: { boostPercent: number; maxStake: number; market: string }
      }
  )

export type BonusType = Bonus['type']
