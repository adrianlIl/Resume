export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

export function getThemePreference(): ThemePreference {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  return 'system'
}

export function getSystemTheme(): ResolvedTheme {
  const isDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  return isDark ? 'dark' : 'light'
}

export function resolveTheme(pref: ThemePreference): ResolvedTheme {
  return pref === 'system' ? getSystemTheme() : pref
}

export function applyResolvedTheme(theme: ResolvedTheme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

export function setThemePreference(pref: ThemePreference) {
  localStorage.setItem(STORAGE_KEY, pref)
  applyResolvedTheme(resolveTheme(pref))
}

export function watchSystemThemeChange(onChange: (theme: ResolvedTheme) => void) {
  if (!window.matchMedia) return () => {}
  const mql = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = () => onChange(mql.matches ? 'dark' : 'light')

  if ('addEventListener' in mql) {
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }

  // Safari / older
  // @ts-expect-error legacy API
  mql.addListener(handler)
  // @ts-expect-error legacy API
  return () => mql.removeListener(handler)
}

