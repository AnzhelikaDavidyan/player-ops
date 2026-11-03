import seed from '../../db.json'
import type {
  Assignment,
  AuditEntry,
  Bonus,
  Limits,
  Player,
  Transaction,
} from '@/types'

export interface Db {
  players: Player[]
  transactions: Transaction[]
  limits: Limits[]
  bonuses: Bonus[]
  assignments: Assignment[]
  auditLog: AuditEntry[]
}

export type Collection = keyof Db
export type Row = Db[Collection][number]

// JSON imports are typed loosely (status: string, not PlayerStatus). db.json is
// written by scripts/seed.mjs to match these types, so the cast is safe.
// structuredClone gives the mock its own copy to change; a page reload resets it.
export const db: Db = structuredClone(seed) as unknown as Db
