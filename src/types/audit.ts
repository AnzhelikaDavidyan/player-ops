export type Role = 'admin' | 'crm' | 'support'

export type AuditAction =
  | 'player.status'
  | 'limits.update'
  | 'bonus.assign'
  | 'bonus.create'
  | 'bonus.update'
  | 'bonus.status'

export interface AuditEntry {
  id: string
  at: string
  role: Role
  action: AuditAction
  /** Player or bonus ID */
  target: string
  detail: string
}
