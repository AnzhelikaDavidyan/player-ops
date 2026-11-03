import type { Player } from '../types/player'

// Mock data until a real API exists.
export const players: Player[] = [
  {
    id: '1',
    name: 'Alex Morgan',
    position: 'Forward',
    number: 9,
    status: 'active',
  },
  {
    id: '2',
    name: 'Sam Lee',
    position: 'Midfielder',
    number: 8,
    status: 'active',
  },
  {
    id: '3',
    name: 'Jordan Diaz',
    position: 'Defender',
    number: 4,
    status: 'injured',
  },
  {
    id: '4',
    name: 'Taylor Kim',
    position: 'Goalkeeper',
    number: 1,
    status: 'active',
  },
  {
    id: '5',
    name: 'Casey Brown',
    position: 'Defender',
    number: 5,
    status: 'inactive',
  },
]

export function getPlayer(id: string): Player | undefined {
  return players.find((player) => player.id === id)
}
