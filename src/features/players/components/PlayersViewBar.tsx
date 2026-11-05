import { useRef, useState, type FormEvent } from 'react'
import { useUiStore } from '@/shared/store/uiStore'
import { HIDEABLE_COLUMNS } from './playerColumns'
import styles from './PlayersViewBar.module.scss'

interface PlayersViewBarProps {
  /** The current view as a query string; empty when nothing is filtered or sorted. */
  search: string
  onApply: (search: string) => void
}

export function PlayersViewBar({ search, onApply }: PlayersViewBarProps) {
  const presets = useUiStore((s) => s.presets)
  const removePreset = useUiStore((s) => s.removePreset)

  return (
    <div className={styles.bar}>
      <ul className={styles.presets} aria-label="Saved views">
        {presets.map((p) => (
          <li key={p.name} className={styles.preset}>
            <button
              type="button"
              aria-pressed={p.search === search}
              onClick={() => onApply(p.search)}
            >
              {p.name}
            </button>
            <button
              type="button"
              aria-label={`Delete saved view ${p.name}`}
              onClick={() => removePreset(p.name)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <SaveView search={search} />
      <ColumnPicker />
    </div>
  )
}

function SaveView({ search }: { search: string }) {
  const savePreset = useUiStore((s) => s.savePreset)
  const [name, setName] = useState('')
  const menu = useRef<HTMLDetailsElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    savePreset({ name: name.trim(), search })
    setName('')
    if (menu.current) menu.current.open = false
  }

  return (
    <details ref={menu} className={styles.menu} name="players-view">
      <summary>Save view</summary>
      <form className={styles.popover} onSubmit={handleSubmit}>
        {search ? (
          <>
            <label>
              <span>View name</span>
              <input
                value={name}
                maxLength={30}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <button type="submit" disabled={!name.trim()}>
              Save
            </button>
          </>
        ) : (
          <p>Set a filter or sort first, then save it as a view.</p>
        )}
      </form>
    </details>
  )
}

function ColumnPicker() {
  const hiddenColumns = useUiStore((s) => s.hiddenColumns)
  const toggleColumn = useUiStore((s) => s.toggleColumn)

  return (
    <details className={styles.menu} name="players-view">
      <summary>Columns</summary>
      <fieldset className={styles.popover}>
        <legend className="visually-hidden">Visible columns</legend>
        {HIDEABLE_COLUMNS.map((col) => (
          <label key={col.id} className={styles.check}>
            <input
              type="checkbox"
              checked={!hiddenColumns.includes(col.id)}
              onChange={() => toggleColumn(col.id)}
            />
            {col.label}
          </label>
        ))}
      </fieldset>
    </details>
  )
}
