import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// One API slice for the whole app. Features add endpoints with injectEndpoints,
// so they share one cache and one middleware. /api is proxied to json-server.
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Player'],
  endpoints: () => ({}),
})
