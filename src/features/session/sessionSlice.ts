import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Role } from '@/types'

interface SessionState {
  role: Role
}

const initialState: SessionState = { role: 'admin' }

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setRole(state, action: PayloadAction<Role>) {
      state.role = action.payload
    },
  },
  selectors: {
    selectRole: (state) => state.role,
  },
})

export const { setRole } = sessionSlice.actions
export const { selectRole } = sessionSlice.selectors

export const ROLE_LABELS = {
  admin: 'Admin',
  crm: 'CRM manager',
  support: 'Support agent',
} as const satisfies Record<Role, string>
