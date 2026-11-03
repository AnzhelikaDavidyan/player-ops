import { configureStore } from '@reduxjs/toolkit'
import { sessionSlice } from '@/features/session/sessionSlice'
import { baseApi } from '@/shared/api/baseApi'

export const store = configureStore({
  reducer: {
    [sessionSlice.reducerPath]: sessionSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
