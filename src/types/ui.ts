export const THEMES = ['system', 'light', 'dark'] as const
export type Theme = (typeof THEMES)[number]

/** Players table columns a user can hide. The Player column always stays. */
export const PLAYER_COLUMN_IDS = [
  'status',
  'country',
  'vip',
  'balance',
  'risk',
  'registered',
] as const
export type PlayerColumnId = (typeof PLAYER_COLUMN_IDS)[number]

export interface FilterPreset {
  name: string
  /** URL query string of the view, e.g. "status=Active&vip=Gold". */
  search: string
}
