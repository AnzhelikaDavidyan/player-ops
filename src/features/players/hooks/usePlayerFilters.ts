import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { COUNTRIES, PLAYER_STATUSES, VIP_TIERS } from '@/types'
import type { PlayerSortKey, PlayersQuery, SortOrder } from '../api/playersApi'

const SORT_KEYS = [
  'username',
  'status',
  'country',
  'balance',
  'riskScore',
  'registeredAt',
] as const satisfies readonly PlayerSortKey[]

export const DEFAULT_FILTERS: PlayersQuery = {
  q: '',
  status: '',
  vipTier: '',
  country: '',
  sort: 'riskScore',
  order: 'desc',
  page: 1,
}

/** Returns `value` if it is one of `allowed`, else `fallback`. Guards against hand-edited URLs. */
function oneOf<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T | '',
): T | '' {
  return allowed.includes(value as T) ? (value as T) : fallback
}

/**
 * The Players list filters, stored in the URL (?q=fox&status=Active&page=2)
 * so they survive a reload and can be shared as a link.
 */
export function usePlayerFilters() {
  const [params, setParams] = useSearchParams()

  const filters = useMemo<PlayersQuery>(() => {
    const page = Number(params.get('page'))
    return {
      q: params.get('q') ?? '',
      status: oneOf(params.get('status'), PLAYER_STATUSES, ''),
      vipTier: oneOf(params.get('vip'), VIP_TIERS, ''),
      country: oneOf(params.get('country'), COUNTRIES, ''),
      sort:
        oneOf(params.get('sort'), SORT_KEYS, DEFAULT_FILTERS.sort) ||
        DEFAULT_FILTERS.sort,
      order: (params.get('order') === 'asc'
        ? 'asc'
        : 'desc') satisfies SortOrder,
      page: Number.isInteger(page) && page > 0 ? page : 1,
    }
  }, [params])

  /** Merge `patch` into the filters. Any change other than the page goes back to page 1. */
  const setFilters = useCallback(
    (patch: Partial<PlayersQuery>) => {
      const next = { ...filters, page: 1, ...patch }
      const entries: [string, string][] = [
        ['q', next.q],
        ['status', next.status],
        ['vip', next.vipTier],
        ['country', next.country],
        ['sort', next.sort === DEFAULT_FILTERS.sort ? '' : next.sort],
        ['order', next.order === DEFAULT_FILTERS.order ? '' : next.order],
        ['page', next.page === 1 ? '' : String(next.page)],
      ]
      // Keep the URL short: leave out anything at its default value.
      // Typing in search replaces the history entry instead of adding one per keystroke.
      setParams(
        entries.filter(([, v]) => v !== ''),
        { replace: 'q' in patch },
      )
    },
    [filters, setParams],
  )

  const clearFilters = useCallback(() => setParams({}), [setParams])

  const isFiltered = Boolean(
    filters.q || filters.status || filters.vipTier || filters.country,
  )

  return { filters, setFilters, clearFilters, isFiltered }
}
