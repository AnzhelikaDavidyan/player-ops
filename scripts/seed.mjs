// Generates db.json for json-server. Deterministic: the same seed gives the same
// 30 players every time, so screenshots and tests stay stable.
// Run with `npm run seed` (this overwrites db.json, including your UI edits).
import { writeFileSync } from 'node:fs'

let s = 104382
function rand() {
  s = (s + 0x6d2b79f5) | 0
  let t = Math.imul(s ^ (s >>> 15), 1 | s)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const pick = (arr) => arr[Math.floor(rand() * arr.length)]
const round2 = (n) => Math.round(n * 100) / 100

const ADJ = ['lucky', 'silver', 'midnight', 'golden', 'rapid', 'quiet', 'royal', 'neon', 'arctic', 'wild', 'crimson', 'velvet', 'lunar', 'urban', 'stellar']
const NOUN = ['fox', 'ace', 'river', 'falcon', 'joker', 'tiger', 'comet', 'raven', 'dice', 'wolf', 'spin', 'lotus', 'rook', 'pike', 'orca']
const DOMAINS = ['mail.de', 'gmx.at', 'outlook.com', 'gmail.com', 'proton.me', 'web.de']
const COUNTRIES = ['DE', 'AT', 'FI', 'SE', 'NO', 'NL', 'IE', 'CA', 'NZ', 'BR', 'CH', 'DK']
const TIERS = ['Bronze', 'Bronze', 'Bronze', 'Silver', 'Silver', 'Gold', 'Gold', 'Platinum']
// Weighted: most players are active
const STATUSES = [...Array(12).fill('Active'), 'Suspended', 'Suspended', 'Self-excluded', 'Pending KYC', 'Pending KYC', 'Closed']

const NOW = Date.UTC(2026, 10, 3, 12)
const DAY = 86_400_000
const HOUR = 3_600_000

const players = []
const limits = []
const transactions = []
const usedNames = new Set()
const usedIds = new Set()

for (let i = 0; i < 30; i++) {
  // Player 0 is the fixed demo player used throughout the plan and designs.
  let username = 'luckyfox_92'
  let id = 'PL-104382'
  if (i > 0) {
    do username = `${pick(ADJ)}${pick(NOUN)}_${10 + Math.floor(rand() * 89)}`
    while (usedNames.has(username))
    do id = `PL-${104400 + i * 211 + Math.floor(rand() * 150)}`
    while (usedIds.has(id))
  }
  usedNames.add(username)
  usedIds.add(id)

  const depositsTotal = Math.round((200 + rand() * 24000) / 10) * 10
  players.push({
    id,
    username,
    email: `${username.replace('_', '.')}@${pick(DOMAINS)}`,
    country: i === 0 ? 'DE' : pick(COUNTRIES),
    status: i === 0 ? 'Active' : pick(STATUSES),
    vipTier: i === 0 ? 'Gold' : pick(TIERS),
    balance: round2(rand() * 4500),
    riskScore: i === 0 ? 82 : Math.round(Math.pow(rand(), 1.6) * 100),
    registeredAt: new Date(NOW - Math.floor(rand() * 900 + 2) * DAY).toISOString().slice(0, 10),
    lastLoginAt: new Date(NOW - Math.floor(rand() * 96) * HOUR).toISOString(),
    depositsTotal,
    netLoss: Math.round(depositsTotal * (0.15 + rand() * 0.55)),
    currency: 'EUR',
  })

  const daily = pick([50, 100, 200, 300, 500])
  const weekly = daily * pick([3, 4, 5])
  const monthly = weekly * pick([2, 3, 4])
  limits.push({
    id,
    depositDaily: i === 0 ? 200 : daily,
    depositWeekly: i === 0 ? 500 : weekly,
    depositMonthly: i === 0 ? 1000 : monthly,
    lossMonthly: i === 0 ? 800 : Math.round((monthly * 0.8) / 10) * 10,
    sessionMinutes: i === 0 ? 120 : pick([60, 90, 120, 180, 240]),
    updatedAt: new Date(NOW - Math.floor(rand() * 60) * DAY).toISOString(),
  })

  const TX_TYPES = ['Deposit', 'Bet', 'Bet', 'Bet', 'Win', 'Win', 'Withdrawal', 'Bonus']
  let t = Date.UTC(2026, 10, 3, 14, 52)
  const count = 9 + Math.floor(rand() * 8)
  for (let k = 0; k < count; k++) {
    const type = k === 0 ? 'Deposit' : pick(TX_TYPES)
    const amount =
      type === 'Deposit' ? pick([20, 50, 100, 200, 500])
      : type === 'Withdrawal' ? Math.round(50 + rand() * 600)
      : type === 'Bonus' ? pick([10, 25, 50])
      : round2(1 + rand() * 80)
    const isPayment = type === 'Deposit' || type === 'Withdrawal'
    transactions.push({
      id: `TX-${id.slice(3)}-${k + 1}`,
      playerId: id,
      type,
      amount,
      status: rand() < 0.08 ? (type === 'Withdrawal' ? 'Pending' : 'Failed') : 'Completed',
      method: isPayment ? pick(['Visa', 'Trustly', 'Skrill', 'Mastercard'])
        : type === 'Bonus' ? 'Bonus wallet'
        : pick(['Slots', 'Live casino', 'Football', 'Tennis']),
      createdAt: new Date(t).toISOString(),
    })
    t -= Math.floor(1 + rand() * 60) * HOUR
  }
}

const bonuses = [
  { id: 'b1', product: 'casino', type: 'welcome', name: 'Welcome 100% up to €200', code: 'WELCOME-100', status: 'Active', assignment: 'auto', validFrom: '2026-01-01', validTo: '2026-12-31', minVip: 'Bronze', countries: [], rules: { matchPercent: 100, maxBonus: 200, minDeposit: 20, wagering: 35 } },
  { id: 'b2', product: 'casino', type: 'reload', name: 'Weekend reload 50%', code: 'RELOAD-WKND-50', status: 'Active', assignment: 'manual', validFrom: '2026-10-01', validTo: '2026-12-31', minVip: 'Silver', countries: [], rules: { matchPercent: 50, maxBonus: 100, minDeposit: 20, wagering: 30 } },
  { id: 'b3', product: 'casino', type: 'free_spins', name: '50 free spins on Book of Ra', code: 'SPINS-BOR-50', status: 'Active', assignment: 'manual', validFrom: '2026-11-01', validTo: '2026-11-30', minVip: 'Bronze', countries: ['DE', 'AT', 'CH'], rules: { spins: 50, spinValue: 0.2, game: 'Book of Ra', wagering: 25 } },
  { id: 'b4', product: 'casino', type: 'cashback', name: 'Weekly cashback 10%', code: 'CASHBACK-10', status: 'Active', assignment: 'auto', validFrom: '2026-09-01', validTo: '2027-03-31', minVip: 'Gold', countries: [], rules: { percent: 10, maxCashback: 500, period: 'weekly' } },
  { id: 'b5', product: 'casino', type: 'no_deposit', name: '€10 no-deposit trial', code: 'TRY-10', status: 'Draft', assignment: 'manual', validFrom: '2026-12-01', validTo: '2027-01-31', minVip: 'Bronze', countries: ['FI', 'SE', 'NO'], rules: { amount: 10, maxWin: 100, wagering: 50 } },
  { id: 'b6', product: 'casino', type: 'reload', name: 'High-roller reload 25%', code: 'HR-RELOAD-25', status: 'Paused', assignment: 'manual', validFrom: '2026-08-01', validTo: '2026-12-31', minVip: 'Platinum', countries: [], rules: { matchPercent: 25, maxBonus: 1000, minDeposit: 500, wagering: 20 } },
  { id: 'b7', product: 'sport', type: 'free_bet', name: '€10 free bet', code: 'FREEBET-10', status: 'Active', assignment: 'manual', validFrom: '2026-10-15', validTo: '2026-12-15', minVip: 'Bronze', countries: [], rules: { amount: 10, minOdds: 1.8 } },
  { id: 'b8', product: 'sport', type: 'acca_boost', name: 'Acca boost up to 50%', code: 'ACCA-50', status: 'Active', assignment: 'auto', validFrom: '2026-08-01', validTo: '2027-05-31', minVip: 'Bronze', countries: [], rules: { minLegs: 3, table: [{ legs: 3, percent: 5 }, { legs: 5, percent: 15 }, { legs: 8, percent: 30 }, { legs: 12, percent: 50 }] } },
  { id: 'b9', product: 'sport', type: 'risk_free', name: 'Risk-free first bet', code: 'RISKFREE-50', status: 'Active', assignment: 'manual', validFrom: '2026-09-01', validTo: '2026-12-31', minVip: 'Bronze', countries: ['IE', 'CA', 'NZ'], rules: { maxStake: 50, refundAs: 'free bet' } },
  { id: 'b10', product: 'sport', type: 'odds_boost', name: 'Champions League odds boost', code: 'UCL-BOOST', status: 'Paused', assignment: 'auto', validFrom: '2026-09-15', validTo: '2027-05-31', minVip: 'Silver', countries: [], rules: { boostPercent: 20, maxStake: 25, market: 'Match result' } },
  { id: 'b11', product: 'sport', type: 'free_bet', name: '€25 VIP free bet', code: 'VIP-FB-25', status: 'Draft', assignment: 'manual', validFrom: '2026-12-01', validTo: '2026-12-31', minVip: 'Gold', countries: [], rules: { amount: 25, minOdds: 1.5 } },
]

const active = players.filter((p) => p.status === 'Active')
const REASONS = ['Retention: deposit dropped this month', 'Birthday gift', 'VIP host request', 'Complaint goodwill', 'Win-back campaign', 'Retention: inactive for 14 days']
const assignments = [['b2', 1], ['b3', 0], ['b7', 2], ['b7', 3], ['b9', 4], ['b2', 5]].map(([bonusId, idx], k) => ({
  id: `as${k + 1}`,
  bonusId,
  playerId: active[idx].id,
  reason: REASONS[k],
  expiresAt: new Date(NOW + (7 + k) * DAY).toISOString().slice(0, 10),
  amountOverride: null,
  notify: true,
  createdAt: new Date(NOW - (k + 1) * 3 * HOUR).toISOString(),
}))

const auditLog = assignments.map((a, k) => ({
  id: `au${k + 1}`,
  at: a.createdAt,
  role: 'crm',
  action: 'bonus.assign',
  target: a.playerId,
  detail: `Assigned ${bonuses.find((b) => b.id === a.bonusId).code}: ${a.reason}`,
}))
const suspended = players.find((p) => p.status === 'Suspended')
if (suspended) {
  auditLog.push({ id: 'au7', at: new Date(NOW - 20 * HOUR).toISOString(), role: 'admin', action: 'player.status', target: suspended.id, detail: 'Active → Suspended: chargeback under review' })
}
auditLog.push({ id: 'au8', at: new Date(NOW - 26 * HOUR).toISOString(), role: 'support', action: 'limits.update', target: 'PL-104382', detail: 'Weekly deposit limit lowered on player request' })

const db = { players, transactions, limits, bonuses, assignments, auditLog }
writeFileSync(new URL('../db.json', import.meta.url), JSON.stringify(db, null, 2) + '\n')
console.log(`db.json: ${players.length} players, ${transactions.length} transactions, ${bonuses.length} bonuses`)
