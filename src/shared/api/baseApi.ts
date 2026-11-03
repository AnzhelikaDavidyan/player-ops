import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// One API slice for the whole app. Features add endpoints with injectEndpoints,
// so they share one cache and one middleware. Locally /api is proxied to
// json-server; on GitHub Pages it is /player-ops/api, answered by MSW.
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.BASE_URL}api` }),
  tagTypes: ['Player'],
  endpoints: () => ({}),
})
