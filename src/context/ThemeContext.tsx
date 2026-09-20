import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Theme = 'dark' | 'light'

export const DEFAULT_ACCENT = '#f5f5f5'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  /** Vom Nutzer gewählte Rahmen-/Akzentfarbe – unabhängig von Dark/Light. */
  accent: string
  setAccent: (hex: string) => void
  resetAccent: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const THEME_KEY = 'try-dont-try:theme'
const ACCENT_KEY = 'try-dont-try:accent'

const HEX_RE = /^#[0-9a-f]{6}$/i

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(THEME_KEY)
  if (stored === 'dark' || stored === 'light') return stored
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
  return prefersLight ? 'light' : 'dark'
}

function getInitialAccent(): string {
  if (typeof window === 'undefined') return DEFAULT_ACCENT
  const stored = window.localStorage.getItem(ACCENT_KEY)
  return stored && HEX_RE.test(stored) ? stored : DEFAULT_ACCENT
}

function toRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

/** Liefert Schwarz oder Weiß – je nachdem, was auf der Farbe besser lesbar ist. */
function readableOn(hex: string): string {
  const { r, g, b } = toRgb(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#000000' : '#ffffff'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [accent, setAccentState] = useState<string>(getInitialAccent)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--user-accent', accent)
    root.style.setProperty('--color-on-accent', readableOn(accent))
    const { r, g, b } = toRgb(accent)
    root.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.7)`)
    // Karten-Verlauf: Akzent zu ~35 % mit Schwarz gemischt
    root.style.setProperty(
      '--accent-deep',
      `rgb(${Math.round(r * 0.35)}, ${Math.round(g * 0.35)}, ${Math.round(b * 0.35)})`,
    )
    window.localStorage.setItem(ACCENT_KEY, accent)
  }, [accent])

  const setAccent = useCallback((hex: string) => {
    if (HEX_RE.test(hex)) setAccentState(hex.toLowerCase())
  }, [])
  const resetAccent = useCallback(() => setAccentState(DEFAULT_ACCENT), [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
      accent,
      setAccent,
      resetAccent,
    }),
    [theme, accent, setAccent, resetAccent],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme muss innerhalb von ThemeProvider verwendet werden')
  return ctx
}
