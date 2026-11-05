import { useCallback } from 'react'
import { useLocation, useSearchParams } from 'react-router'
import { TRANSACTION_TYPES, type TransactionType } from '@/types'

export const PROFILE_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'limits', label: 'Limits' },
  { id: 'bonuses', label: 'Bonuses' },
] as const

export type ProfileTab = (typeof PROFILE_TABS)[number]['id']

/** Query string for a tab. Overview is the default, so it needs none. */
export const tabSearch = (tab: ProfileTab) =>
  tab === 'overview' ? '' : `?tab=${tab}`

/**
 * The open tab and transaction filter, stored in the URL
 * (?tab=transactions&type=Deposit) so they survive a reload and can be shared.
 */
export function useProfileParams() {
  const [params, setParams] = useSearchParams()
  const { state } = useLocation()

  const tab =
    PROFILE_TABS.find((t) => t.id === params.get('tab'))?.id ?? 'overview'

  const wanted = params.get('type')
  const txType: TransactionType | '' =
    TRANSACTION_TYPES.find((t): boolean => t === wanted) ?? ''

  const setTxType = useCallback(
    (type: TransactionType | '') =>
      setParams(
        type ? { tab: 'transactions', type } : { tab: 'transactions' },
        // Keeps the way back to the filtered players list.
        { state },
      ),
    [setParams, state],
  )

  return { tab, txType, setTxType }
}
