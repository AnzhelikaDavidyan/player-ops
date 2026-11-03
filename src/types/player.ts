export type PlayerStatus = 'active' | 'injured' | 'inactive'

export interface Player {
  id: string
  name: string
  position: string
  number: number
  status: PlayerStatus
}
