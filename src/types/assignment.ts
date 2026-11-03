export interface Assignment {
  id: string
  bonusId: string
  playerId: string
  reason: string
  expiresAt: string
  amountOverride: number | null
  notify: boolean
  createdAt: string
}
