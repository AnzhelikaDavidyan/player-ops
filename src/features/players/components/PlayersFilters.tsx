import { useEffect, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { COUNTRIES, PLAYER_STATUSES, VIP_TIERS } from '@/types'
import type { PlayersQuery } from '../api/playersApi'
import styles from './PlayersFilters.module.scss'

interface PlayersFiltersProps {
  filters: PlayersQuery
  onChange: (patch: Partial<PlayersQuery>) => void
  onClear: () => void
}

export function PlayersFilters({
  filters,
  onChange,
  onClear,
}: PlayersFiltersProps) {
  // The input updates on every keystroke; the URL (and so the request) only
  // after 300 ms of no typing, so typing "luckyfox" sends one request, not eight.
  const [text, setText] = useState(filters.q)
  const debouncedText = useDebounce(text.trim(), 300)

  useEffect(() => {
    // Only push once typing has settled, so a Clear in the middle is not undone.
    if (debouncedText === text.trim() && debouncedText !== filters.q) {
      onChange({ q: debouncedText })
    }
  }, [debouncedText, text, filters.q, onChange])

  return (
    <div className={styles.toolbar}>
      <label className={styles.wide}>
        <span>Search</span>
        <input
          type="search"
          placeholder="Username, email or player ID"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </label>

      <label>
        <span>Status</span>
        <select
          value={filters.status}
          onChange={(e) =>
            onChange({ status: e.target.value as PlayersQuery['status'] })
          }
        >
          <option value="">All</option>
          {PLAYER_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>

      <label>
        <span>VIP tier</span>
        <select
          value={filters.vipTier}
          onChange={(e) =>
            onChange({ vipTier: e.target.value as PlayersQuery['vipTier'] })
          }
        >
          <option value="">All</option>
          {VIP_TIERS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>

      <label>
        <span>Country</span>
        <select
          value={filters.country}
          onChange={(e) =>
            onChange({ country: e.target.value as PlayersQuery['country'] })
          }
        >
          <option value="">All</option>
          {COUNTRIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>

      <button
        type="button"
        className={styles.clear}
        onClick={() => {
          setText('')
          onClear()
        }}
      >
        Clear filters
      </button>
    </div>
  )
}
