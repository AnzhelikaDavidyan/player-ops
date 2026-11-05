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

/** URL params for `f`. Anything at its default value is left out to keep the URL short. */
function toEntries(f: PlayersQuery): [string, string][] {
  const entries: [string, string][] = [
    ['q', f.q],
    ['status', f.status],
    ['vip', f.vipTier],
    ['country', f.country],
    ['sort', f.sort === DEFAULT_FILTERS.sort ? '' : f.sort],
    ['order', f.order === DEFAULT_FILTERS.order ? '' : f.order],
    ['page', f.page === 1 ? '' : String(f.page)],
  ]
  return entries.filter(([, v]) => v !== '')
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
      // Typing in search replaces the history entry instead of adding one per keystroke.
      setParams(toEntries(next), { replace: 'q' in patch })
    },
    [filters, setParams],
  )

  const clearFilters = useCallback(() => setParams({}), [setParams])

  /** Open a saved view. It goes through the URL, so old values are checked like any other link. */
  const applySearch = useCallback(
    (search: string) => setParams(new URLSearchParams(search)),
    [setParams],
  )

  // The current view for saving; a view always opens on its first page.
  const search = new URLSearchParams(
    toEntries({ ...filters, page: 1 }),
  ).toString()

  const isFiltered = Boolean(
    filters.q || filters.status || filters.vipTier || filters.country,
  )

  return { filters, setFilters, clearFilters, applySearch, search, isFiltered }
}
