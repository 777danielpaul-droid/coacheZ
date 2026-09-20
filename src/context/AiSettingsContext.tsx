import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  PROVIDERS,
  getProvider,
  type ActiveAiConfig,
  type ProviderId,
} from '../lib/ai'
import { AiSettingsDialog } from '../components/AiSettingsDialog'

interface StoredSettings {
  provider: ProviderId
  keys: Partial<Record<ProviderId, string>>
  models: Partial<Record<ProviderId, string>>
  baseUrls: Partial<Record<ProviderId, string>>
  /** true = localStorage (bleibt nach Schließen), false = nur diese Sitzung */
  remember: boolean
}

interface AiSettingsContextValue {
  settings: StoredSettings
  /** Aktive Konfiguration (Key/Modell des gewählten Anbieters). */
  config: ActiveAiConfig
  isConfigured: boolean
  providerLabel: string
  setProvider: (id: ProviderId) => void
  setApiKey: (key: string) => void
  setModel: (model: string) => void
  setBaseUrl: (url: string) => void
  setRemember: (remember: boolean) => void
  clearKeys: () => void
  settingsOpen: boolean
  openSettings: () => void
  closeSettings: () => void
}

const STORAGE_KEY = 'try-dont-try:ai'

const DEFAULTS: StoredSettings = {
  // Standard: Gratis-Chat ohne Key (Puter). Eigene Keys sind weiterhin möglich.
  provider: 'puter',
  keys: {},
  models: {},
  baseUrls: {},
  remember: true,
}

const AiSettingsContext = createContext<AiSettingsContextValue | null>(null)

function safeGet(storage: Storage): string | null {
  try {
    return storage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function load(): StoredSettings {
  if (typeof window === 'undefined') return DEFAULTS
  const raw = safeGet(window.localStorage) ?? safeGet(window.sessionStorage)
  if (!raw) return DEFAULTS
  try {
    const parsed = JSON.parse(raw) as Partial<StoredSettings> & { baseUrl?: string }
    const provider = PROVIDERS.some((p) => p.id === parsed.provider) ? parsed.provider! : DEFAULTS.provider
    return {
      provider,
      keys: parsed.keys && typeof parsed.keys === 'object' ? parsed.keys : {},
      models: parsed.models && typeof parsed.models === 'object' ? parsed.models : {},
      // Ältere Version speicherte nur eine einzelne URL (für "custom").
      baseUrls:
        parsed.baseUrls && typeof parsed.baseUrls === 'object'
          ? parsed.baseUrls
          : typeof parsed.baseUrl === 'string' && parsed.baseUrl
            ? { custom: parsed.baseUrl }
            : {},
      remember: parsed.remember !== false,
    }
  } catch {
    return DEFAULTS
  }
}

export function AiSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoredSettings>(load)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Persistieren: "merken" → localStorage, sonst nur sessionStorage.
  useEffect(() => {
    try {
      const json = JSON.stringify(settings)
      const [target, other] = settings.remember
        ? [window.localStorage, window.sessionStorage]
        : [window.sessionStorage, window.localStorage]
      target.setItem(STORAGE_KEY, json)
      other.removeItem(STORAGE_KEY)
    } catch {
      /* Storage blockiert (z. B. privater Modus) – Einstellungen gelten dann nur bis zum Reload */
    }
  }, [settings])

  const setProvider = useCallback(
    (provider: ProviderId) => setSettings((s) => ({ ...s, provider })),
    [],
  )
  const setApiKey = useCallback(
    (key: string) => setSettings((s) => ({ ...s, keys: { ...s.keys, [s.provider]: key } })),
    [],
  )
  const setModel = useCallback(
    (model: string) => setSettings((s) => ({ ...s, models: { ...s.models, [s.provider]: model } })),
    [],
  )
  const setBaseUrl = useCallback(
    (url: string) => setSettings((s) => ({ ...s, baseUrls: { ...s.baseUrls, [s.provider]: url } })),
    [],
  )
  const setRemember = useCallback((remember: boolean) => setSettings((s) => ({ ...s, remember })), [])
  const clearKeys = useCallback(() => setSettings((s) => ({ ...s, keys: {} })), [])
  const openSettings = useCallback(() => setSettingsOpen(true), [])
  const closeSettings = useCallback(() => setSettingsOpen(false), [])

  const value = useMemo<AiSettingsContextValue>(() => {
    const info = getProvider(settings.provider)
    const config: ActiveAiConfig = {
      provider: settings.provider,
      apiKey: settings.keys[settings.provider] ?? '',
      model: settings.models[settings.provider] ?? '',
      baseUrl: settings.baseUrls[settings.provider] ?? '',
    }
    // "Eigene URL" gilt als eingerichtet, sobald Key ODER eigene Adresse angegeben ist
    // (lokale Server brauchen keinen Key).
    // Puter braucht keinen Key; "Eigene URL" gilt als eingerichtet, sobald Key ODER
    // eigene Adresse angegeben ist (lokale Server brauchen keinen Key).
    const isConfigured =
      info.kind === 'puter' ||
      (info.keyRequired
        ? config.apiKey.trim().length > 0
        : config.apiKey.trim().length > 0 || config.baseUrl.trim().length > 0)
    return {
      settings,
      config,
      isConfigured,
      providerLabel: info.label,
      setProvider,
      setApiKey,
      setModel,
      setBaseUrl,
      setRemember,
      clearKeys,
      settingsOpen,
      openSettings,
      closeSettings,
    }
  }, [
    settings,
    settingsOpen,
    setProvider,
    setApiKey,
    setModel,
    setBaseUrl,
    setRemember,
    clearKeys,
    openSettings,
    closeSettings,
  ])

  return (
    <AiSettingsContext.Provider value={value}>
      {children}
      {settingsOpen && <AiSettingsDialog />}
    </AiSettingsContext.Provider>
  )
}

export function useAiSettings(): AiSettingsContextValue {
  const ctx = useContext(AiSettingsContext)
  if (!ctx) throw new Error('useAiSettings muss innerhalb von AiSettingsProvider verwendet werden')
  return ctx
}
