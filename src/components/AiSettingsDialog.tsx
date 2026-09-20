import { useEffect, useRef, useState } from 'react'
import { useAiSettings } from '../context/AiSettingsContext'
import {
  AiError,
  PROVIDERS,
  getProvider,
  isAbort,
  streamChat,
  type ProviderId,
} from '../lib/ai'
import { loadPuter } from '../lib/puter'
import { loadModels, pickBestModel, type ModelList } from '../lib/models'

const MAX_ROWS = 150

type TestState =
  | { status: 'idle' }
  | { status: 'running' }
  | { status: 'ok'; reply: string }
  | { status: 'error'; message: string }

export function AiSettingsDialog() {
  const {
    settings,
    config,
    isConfigured,
    setProvider,
    setApiKey,
    setModel,
    setBaseUrl,
    setRemember,
    clearKeys,
    closeSettings,
  } = useAiSettings()

  const [showKey, setShowKey] = useState(false)
  const [test, setTest] = useState<TestState>({ status: 'idle' })
  const [list, setList] = useState<ModelList | null>(null)
  const [loadingModels, setLoadingModels] = useState(false)
  const [filter, setFilter] = useState('')
  const [onlyFree, setOnlyFree] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const modelRef = useRef(config.model)
  modelRef.current = config.model
  const provider = getProvider(settings.provider)
  const isPuter = provider.kind === 'puter'
  const [puterInfo, setPuterInfo] = useState('')

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSettings()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      abortRef.current?.abort()
    }
  }, [closeSettings])

  // Jede Änderung macht ein altes Testergebnis ungültig.
  useEffect(() => {
    setTest({ status: 'idle' })
  }, [settings.provider, config.apiKey, config.model, config.baseUrl])

  // Modellliste laden (mit kurzer Verzögerung, damit beim Tippen des Keys nicht jede Taste eine Anfrage auslöst).
  useEffect(() => {
    const controller = new AbortController()
    setLoadingModels(true)
    setFilter('')
    const timer = window.setTimeout(async () => {
      try {
        const result = await loadModels(config, controller.signal)
        setList(result)
        // Noch kein Modell gewählt: automatisch das beste Gratis-Modell eintragen.
        if (result.source === 'live' && !modelRef.current) {
          const best = pickBestModel(config.provider, result.models)
          if (best) setModel(best.id)
        }
        setLoadingModels(false)
      } catch (err) {
        if (!isAbort(err)) setLoadingModels(false)
      }
    }, 500)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
    // config-Felder einzeln, damit nur relevante Änderungen neu laden
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.provider, config.apiKey, config.baseUrl])

  const models = list?.models ?? []
  const best = list ? pickBestModel(config.provider, models) : null
  const hasFree = models.some((m) => m.free)
  const activeModel = config.model || provider.defaultModel
  const needle = filter.trim().toLowerCase()
  const freeOnly = onlyFree && hasFree
  const visible = models
    .filter((m) => (!freeOnly || m.free) && (!needle || m.id.toLowerCase().includes(needle)))
    .slice(0, MAX_ROWS)
  const exactMatch = models.some((m) => m.id.toLowerCase() === needle)

  const runTest = async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setTest({ status: 'running' })
    let reply = ''
    try {
      await streamChat({
        config,
        system: 'Antworte ausschließlich mit dem Wort: Verbunden',
        messages: [{ role: 'user', content: 'Test' }],
        signal: controller.signal,
        onDelta: (t) => {
          reply += t
        },
      })
      setTest({ status: 'ok', reply: reply.trim() || 'Verbunden' })
    } catch (err) {
      if (isAbort(err)) return
      setTest({
        status: 'error',
        message: err instanceof AiError ? err.message : 'Unbekannter Fehler beim Test.',
      })
    }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="ai-settings-title">
      <div className="modal__backdrop" onClick={closeSettings} />
      <div className="modal__panel">
        <div className="modal__head">
          <h2 id="ai-settings-title" className="modal__title">
            KI-Einstellungen
          </h2>
          <button type="button" className="icon-btn" aria-label="Schließen" onClick={closeSettings}>
            ×
          </button>
        </div>

        <p className="modal__intro">
          Damit chatten die Coaches mit dir – jeder mit eigener Persona. Nutze den Gratis-Chat über
          Puter (ohne API-Key) oder hinterlege den API-Key deines KI-Anbieters.
        </p>

        <div className="field">
          <label htmlFor="ai-provider">Anbieter</label>
          <select
            id="ai-provider"
            value={settings.provider}
            onChange={(e) => setProvider(e.target.value as ProviderId)}
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {provider.baseUrlEditable && (
          <div className="field">
            <label htmlFor="ai-base-url">Basis-URL{settings.provider === 'custom' ? '' : ' (optional)'}</label>
            <input
              id="ai-base-url"
              type="url"
              value={config.baseUrl}
              placeholder={provider.baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            <small>Ohne „/chat/completions“, z. B. http://localhost:11434/v1 für Ollama.</small>
          </div>
        )}

        {isPuter && (
          <div className="field">
            <p className="modal__note">
              Kein API-Key nötig: Der Chat läuft über dein kostenloses Konto bei Puter (puter.com).
              Beim ersten Senden öffnet sich ein Anmeldefenster; die Nutzung wird über dein
              monatliches Gratis-Guthaben bei Puter abgerechnet – für den Betreiber dieser Seite
              entstehen keine Kosten. Beim Öffnen des Chats wird dafür ein Skript von js.puter.com
              geladen.
            </p>
            <div className="field__row">
              <button
                type="button"
                className="btn"
                onClick={async () => {
                  setPuterInfo('')
                  try {
                    const api = await loadPuter()
                    await api.auth.signIn()
                    setPuterInfo('Bei Puter angemeldet.')
                  } catch {
                    setPuterInfo('Anmeldung nicht abgeschlossen.')
                  }
                }}
              >
                Jetzt bei Puter anmelden
              </button>
              {puterInfo && <span className="models__status">{puterInfo}</span>}
            </div>
          </div>
        )}

        {!isPuter && (
        <div className="field">
          <label htmlFor="ai-key">API-Key</label>
          <div className="field__row">
            <input
              id="ai-key"
              type={showKey ? 'text' : 'password'}
              value={config.apiKey}
              placeholder={provider.keyPlaceholder}
              onChange={(e) => setApiKey(e.target.value)}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <button type="button" className="btn btn--small" onClick={() => setShowKey((v) => !v)}>
              {showKey ? 'Verbergen' : 'Zeigen'}
            </button>
          </div>
          <small>Key erhältst du hier: {provider.keyHelp}</small>
        </div>
        )}

        <div className="field">
          <label htmlFor="ai-model-filter">Modell</label>

          <div className="models__status" role="status" aria-live="polite">
            {loadingModels
              ? 'Lade verfügbare Modelle …'
              : list?.source === 'live'
                ? `${models.length} Modelle geladen${hasFree ? ` · ${models.filter((m) => m.free).length} gratis` : ''}`
                : list?.reason
                  ? `${list.reason.replace(/[.\s]+$/, '')} – bekannte Modelle werden angezeigt.`
                  : 'Bekannte Modelle'}
          </div>

          <div className="field__row">
            <input
              id="ai-model-filter"
              type="text"
              value={filter}
              placeholder="Suchen oder eigenen Modellnamen eingeben …"
              onChange={(e) => setFilter(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
            {best && best.id !== activeModel && (
              <button type="button" className="btn btn--small" onClick={() => setModel(best.id)}>
                Empfohlenes
              </button>
            )}
          </div>

          {hasFree && models.some((m) => !m.free) && (
            <label className="check check--inline">
              <input type="checkbox" checked={onlyFree} onChange={(e) => setOnlyFree(e.target.checked)} />
              <span>Nur gratis anzeigen</span>
            </label>
          )}

          <ul className="models" role="listbox" aria-label="Verfügbare Modelle">
            {needle && !exactMatch && (
              <li>
                <button
                  type="button"
                  role="option"
                  aria-selected={activeModel === filter.trim()}
                  className="models__row"
                  onClick={() => {
                    setModel(filter.trim())
                    setFilter('')
                  }}
                >
                  <span className="models__id">„{filter.trim()}“ als Modellnamen verwenden</span>
                </button>
              </li>
            )}
            {visible.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={m.id === activeModel}
                  className={`models__row ${m.id === activeModel ? 'models__row--active' : ''}`}
                  onClick={() => setModel(m.id)}
                >
                  <span className="models__id">{m.id}</span>
                  <span className="models__badges">
                    {m.id === best?.id && <span className="badge badge--best">Empfohlen</span>}
                    {m.free && <span className="badge badge--free">Gratis</span>}
                  </span>
                </button>
              </li>
            ))}
            {visible.length === 0 && !needle && !loadingModels && (
              <li className="models__empty">Keine Modelle gefunden.</li>
            )}
          </ul>

          <small>
            Aktiv: <strong>{activeModel}</strong>
            {!config.model && ' (Standard)'}
          </small>
          <small>{provider.freeNote}</small>
        </div>

        {!isPuter && (
          <>
        <label className="check">
          <input
            type="checkbox"
            checked={settings.remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>Auf diesem Gerät merken (sonst nur bis zum Schließen des Tabs)</span>
        </label>

        <p className="modal__note">
          Der Key wird nur in deinem Browser gespeichert und direkt an den Anbieter gesendet – es
          gibt keinen eigenen Server dazwischen. Nutze am besten einen Key mit Ausgabenlimit und
          gib ihn nicht auf fremden oder öffentlichen Geräten ein.
        </p>
          </>
        )}

        <div className="modal__actions">
          <button
            type="button"
            className="btn"
            onClick={runTest}
            disabled={!isConfigured || test.status === 'running'}
          >
            {test.status === 'running' ? 'Teste …' : 'Verbindung testen'}
          </button>
          {!isPuter && (
            <button type="button" className="btn btn--ghost" onClick={clearKeys}>
              Alle Keys löschen
            </button>
          )}
          <button type="button" className="btn btn--solid" onClick={closeSettings}>
            Fertig
          </button>
        </div>

        <div className="modal__status" role="status" aria-live="polite">
          {test.status === 'ok' && <span className="status status--ok">✓ Verbunden – {test.reply}</span>}
          {test.status === 'error' && <span className="status status--err">{test.message}</span>}
        </div>
      </div>
    </div>
  )
}
