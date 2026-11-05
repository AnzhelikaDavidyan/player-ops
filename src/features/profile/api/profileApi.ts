import { baseApi } from '@/shared/api/baseApi'
import type {
  Assignment,
  AuditEntry,
  Bonus,
  Limits,
  Transaction,
  TransactionType,
} from '@/types'

export interface TransactionsQuery {
  playerId: string
  /** Empty string means every type. */
  type: TransactionType | ''
}

export const profileApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // Each { playerId, type } pair is its own cache entry, so going back to a
    // filter already seen shows it at once, with no request.
    getTransactions: b.query<Transaction[], TransactionsQuery>({
      query: ({ playerId, type }) => ({
        url: '/transactions',
        params: {
          playerId,
          type: type || undefined,
          _sort: 'createdAt',
          _order: 'desc',
        },
      }),
    }),

    getLimits: b.query<Limits, string>({
      query: (playerId) => `/limits/${playerId}`,
      providesTags: (_result, _error, id) => [{ type: 'Limits', id }],
    }),

    getPlayerHistory: b.query<AuditEntry[], string>({
      query: (playerId) => ({
        url: '/auditLog',
        params: { target: playerId, _sort: 'at', _order: 'desc' },
      }),
      providesTags: (_result, _error, id) => [{ type: 'Audit', id }],
    }),

    getPlayerAssignments: b.query<Assignment[], string>({
      query: (playerId) => ({
        url: '/assignments',
        params: { playerId, _sort: 'createdAt', _order: 'desc' },
      }),
      providesTags: (_result, _error, id) => [{ type: 'Assignment', id }],
    }),

    getBonuses: b.query<Bonus[], void>({
      query: () => '/bonuses',
      providesTags: [{ type: 'Bonus', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetTransactionsQuery,
  useGetLimitsQuery,
  useGetPlayerHistoryQuery,
  useGetPlayerAssignmentsQuery,
  useGetBonusesQuery,
} = profileApi
