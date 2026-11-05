import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FilterPreset, PlayerColumnId, Theme } from '@/types'

interface UiState {
  theme: Theme
  /** Stores hidden, not visible, columns so a column added later shows by default. */
  hiddenColumns: PlayerColumnId[]
  presets: FilterPreset[]
  setTheme: (theme: Theme) => void
  toggleColumn: (id: PlayerColumnId) => void
  /** Saving under an existing name replaces that preset. */
  savePreset: (preset: FilterPreset) => void
  removePreset: (name: string) => void
}

// UI preferences of this browser. Server data stays in RTK Query.
// Read with a selector, useUiStore((s) => s.theme), so a component re-renders
// only when the value it reads changes.
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'system',
      hiddenColumns: [],
      presets: [],
      setTheme: (theme) => set({ theme }),
      toggleColumn: (id) =>
        set((s) => ({
          hiddenColumns: s.hiddenColumns.includes(id)
            ? s.hiddenColumns.filter((c) => c !== id)
            : [...s.hiddenColumns, id],
        })),
      savePreset: (preset) =>
        set((s) => ({
          presets: [...s.presets.filter((p) => p.name !== preset.name), preset],
        })),
      removePreset: (name) =>
        set((s) => ({ presets: s.presets.filter((p) => p.name !== name) })),
    }),
    { name: 'playerops-ui', version: 1 },
  ),
)

/** With no data-theme attribute, global.scss follows the OS setting. */
function applyTheme(theme: Theme) {
  if (theme === 'system') delete document.documentElement.dataset.theme
  else document.documentElement.dataset.theme = theme
}

// Runs outside React: it needs no component, and it sets the saved theme
// before the first render instead of after it.
applyTheme(useUiStore.getState().theme)
useUiStore.subscribe((state, previous) => {
  if (state.theme !== previous.theme) applyTheme(state.theme)
})
