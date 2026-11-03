/** Responsible-gaming limits. `id` is the player ID, so GET /limits/PL-104382 works. */
export interface Limits {
  id: string
  depositDaily: number
  depositWeekly: number
  depositMonthly: number
  lossMonthly: number
  sessionMinutes: number
  updatedAt: string
}
