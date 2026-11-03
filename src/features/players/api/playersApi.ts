import { baseApi } from '@/shared/api/baseApi'
import type { Country, Player, PlayerStatus, VipTier } from '@/types'

export const PAGE_SIZE = 8

export type PlayerSortKey =
  'username' | 'status' | 'country' | 'balance' | 'riskScore' | 'registeredAt'
export type SortOrder = 'asc' | 'desc'

/** Everything the Players list can ask for. Empty string means "no filter". */
export interface PlayersQuery {
  q: string
  status: PlayerStatus | ''
  vipTier: VipTier | ''
  country: Country | ''
  sort: PlayerSortKey
  order: SortOrder
  page: number
}

export interface PlayersPage {
  items: Player[]
  total: number
}

const totalFrom = (headers: Headers | undefined) =>
  Number(headers?.get('X-Total-Count') ?? 0)

export const playersApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getPlayers: b.query<PlayersPage, PlayersQuery>({
      query: ({ q, status, vipTier, country, sort, order, page }) => ({
        url: '/players',
        // fetchBaseQuery drops undefined values, so empty filters leave the URL.
        params: {
          q: q || undefined,
          status: status || undefined,
          vipTier: vipTier || undefined,
          country: country || undefined,
          _sort: sort,
          _order: order,
          _page: page,
          _limit: PAGE_SIZE,
        },
      }),
      transformResponse: (items: Player[], meta) => ({
        items,
        total: totalFrom(meta?.response?.headers),
      }),
      providesTags: (result) => [
        ...(result?.items.map((p) => ({ type: 'Player' as const, id: p.id })) ??
          []),
        { type: 'Player', id: 'LIST' },
      ],
    }),

    /** Total player count for the sidebar badge; also tells us the API is up. */
    getPlayersTotal: b.query<number, void>({
      query: () => ({ url: '/players', params: { _limit: 1 } }),
      transformResponse: (_items: Player[], meta) =>
        totalFrom(meta?.response?.headers),
      providesTags: [{ type: 'Player', id: 'LIST' }],
    }),

    getPlayer: b.query<Player, string>({
      query: (id) => `/players/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Player', id }],
    }),
  }),
})

export const {
  useGetPlayersQuery,
  useGetPlayersTotalQuery,
  useGetPlayerQuery,
} = playersApi
