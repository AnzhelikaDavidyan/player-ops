const euro = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
})
const date = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

/** 1234.5 → "€1,234.50" */
export const formatEur = (amount: number) => euro.format(amount)

/** "2024-12-13" → "13 Dec 2024" */
export const formatDate = (iso: string) => date.format(new Date(iso))
