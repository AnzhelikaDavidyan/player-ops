const euro = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
})
const euroWhole = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})
const date = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const dateTime = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

/** 1234.5 → "€1,234.50" */
export const formatEur = (amount: number) => euro.format(amount)

/** 12080 → "€12,080" */
export const formatEurWhole = (amount: number) => euroWhole.format(amount)

/** "2024-12-13" → "13 Dec 2024" */
export const formatDate = (iso: string) => date.format(new Date(iso))

/** "2026-11-03T14:52:00.000Z" → "03 Nov, 14:52" (in the viewer's time zone) */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso))
