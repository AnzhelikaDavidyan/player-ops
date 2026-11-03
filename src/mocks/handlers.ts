import { delay, http, HttpResponse } from 'msw'
import { db, type Collection, type Db, type Row } from './db'

// A small in-browser stand-in for json-server 0.17, for builds that have no
// backend (GitHub Pages). It supports what the app uses: field filters, q,
// _sort/_order, _page/_limit with X-Total-Count, and GET/POST/PUT/PATCH/DELETE.

// The leading * matches any origin, so these handlers also work in Node tests,
// where a relative path has no page URL to resolve against.
const API = `*${import.meta.env.BASE_URL}api`
const LATENCY_MS = 400 // same delay as `npm run api`

const COLLECTIONS = Object.keys(db) as Collection[]
const CONTROL_PARAMS = new Set(['q', '_sort', '_order', '_page', '_limit'])

function rows(name: Collection): Row[] {
  return db[name]
}

function query(list: Row[], params: URLSearchParams) {
  let result = list

  // ?status=Active&status=Suspended keeps rows matching either value.
  for (const key of new Set(params.keys())) {
    if (CONTROL_PARAMS.has(key)) continue
    const wanted = params.getAll(key)
    result = result.filter((row) =>
      wanted.includes(String(row[key as keyof Row])),
    )
  }

  // Full-text search over every top-level string or number field.
  const q = params.get('q')?.toLowerCase()
  if (q) {
    result = result.filter((row) =>
      Object.values(row).some(
        (v) =>
          (typeof v === 'string' || typeof v === 'number') &&
          String(v).toLowerCase().includes(q),
      ),
    )
  }

  const sort = params.get('_sort')
  if (sort) {
    const dir = params.get('_order') === 'desc' ? -1 : 1
    result = [...result].sort((a, b) => {
      const x = a[sort as keyof Row] as unknown as string | number
      const y = b[sort as keyof Row] as unknown as string | number
      return (x > y ? 1 : x < y ? -1 : 0) * dir
    })
  }

  const total = result.length
  const limit = Number(params.get('_limit'))
  if (limit > 0) {
    const page = Math.max(1, Number(params.get('_page')) || 1)
    result = result.slice((page - 1) * limit, page * limit)
  }

  return { result, total }
}

function collectionHandlers(name: Collection) {
  const list = () => rows(name)
  const find = (id: unknown) => list().findIndex((r) => r.id === id)
  const notFound = () => HttpResponse.json({}, { status: 404 })

  return [
    http.get(`${API}/${name}`, async ({ request }) => {
      await delay(LATENCY_MS)
      const { result, total } = query(list(), new URL(request.url).searchParams)
      return HttpResponse.json(result, {
        headers: { 'X-Total-Count': String(total) },
      })
    }),

    http.get(`${API}/${name}/:id`, async ({ params }) => {
      await delay(LATENCY_MS)
      const row = list()[find(params.id)]
      return row ? HttpResponse.json(row) : notFound()
    }),

    http.post(`${API}/${name}`, async ({ request }) => {
      await delay(LATENCY_MS)
      const body = (await request.json()) as Partial<Row>
      const row = { ...body, id: body.id ?? crypto.randomUUID() } as Row
      ;(list() as Row[]).push(row)
      return HttpResponse.json(row, { status: 201 })
    }),

    http.put(`${API}/${name}/:id`, async ({ params, request }) => {
      await delay(LATENCY_MS)
      const i = find(params.id)
      if (i < 0) return notFound()
      const row = {
        ...((await request.json()) as object),
        id: params.id,
      } as Row
      list()[i] = row
      return HttpResponse.json(row)
    }),

    http.patch(`${API}/${name}/:id`, async ({ params, request }) => {
      await delay(LATENCY_MS)
      const i = find(params.id)
      const current = list()[i]
      if (!current) return notFound()
      const row = {
        ...current,
        ...((await request.json()) as object),
        id: current.id,
      } as Row
      list()[i] = row
      return HttpResponse.json(row)
    }),

    http.delete(`${API}/${name}/:id`, async ({ params }) => {
      await delay(LATENCY_MS)
      const i = find(params.id)
      if (i < 0) return notFound()
      list().splice(i, 1)
      return HttpResponse.json({})
    }),
  ]
}

export const handlers = COLLECTIONS.flatMap((name) => collectionHandlers(name))

export type { Db }
