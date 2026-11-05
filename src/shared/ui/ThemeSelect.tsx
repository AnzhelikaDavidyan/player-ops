import { useUiStore } from '@/shared/store/uiStore'
import { THEMES, type Theme } from '@/types'
import styles from './ThemeSelect.module.scss'

const LABELS = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
} as const satisfies Record<Theme, string>

export function ThemeSelect() {
  const theme = useUiStore((s) => s.theme)
  const setTheme = useUiStore((s) => s.setTheme)

  return (
    <label className={styles.theme}>
      <span>Theme</span>
      <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
        {THEMES.map((t) => (
          <option key={t} value={t}>
            {LABELS[t]}
          </option>
        ))}
      </select>
    </label>
  )
}
