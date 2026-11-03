export const TRANSACTION_TYPES = [
  'Deposit',
  'Withdrawal',
  'Bet',
  'Win',
  'Bonus',
] as const
export type TransactionType = (typeof TRANSACTION_TYPES)[number]

export type TransactionStatus = 'Completed' | 'Pending' | 'Failed'

export interface Transaction {
  id: string
  playerId: string
  type: TransactionType
  amount: number
  status: TransactionStatus
  /** Payment method for deposits and withdrawals, game or sport otherwise */
  method: string
  createdAt: string
}
