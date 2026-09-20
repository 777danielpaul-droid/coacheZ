import { useCallback, useEffect, useRef, useState } from 'react'
import { useAiSettings } from '../context/AiSettingsContext'
import { AiError, isAbort, streamChat, type ChatMessage } from '../lib/ai'
import { loadPuter } from '../lib/puter'
import { buildSystemPrompt, isPromoTurn } from '../lib/persona'
import type { TrainingCard } from '../schemas/trainingCards'

/** Manche Modelle liefern ihre Denkschritte inline in <think>…</think> – die blenden wir aus. */
function visibleText(text: string): string {
  return text.replace(/<think>[\s\S]*?(<\/think>|$)/g, '').trimStart()
}

/** Nachricht im Chat; `promo` markiert Antworten mit (fiktivem) Angebot. */
type UiMessage = ChatMessage & { promo?: boolean }

interface Props {
  card: TrainingCard
  onClose: () => void
}

export function CoachChat({ card, onClose }: Props) {
  const { config, isConfigured, providerLabel, openSettings, settingsOpen } = useAiSettings()

  const [messages, setMessages] = useState<UiMessage[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Escape schließt den Chat – aber nicht, solange die Einstellungen darüber offen sind.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !settingsOpen) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, settingsOpen])

  // Gratis-Chat (Puter): Bibliothek schon beim Öffnen laden, damit das Anmelde-Popup
  // beim ersten Senden nicht vom Browser blockiert wird.
  useEffect(() => {
    if (config.provider === 'puter') void loadPuter().catch(() => {})
  }, [config.provider])

  // Laufende Antwort abbrechen, wenn der Chat geschlossen wird.
  useEffect(() => () => abortRef.current?.abort(), [])

  // Beim Öffnen scrollt die Seite dahinter nicht mit.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, busy, error])

  const send = useCallback(
    async (text: string) => {
      const content = text.trim()
      if (!content || busy) return
      if (!isConfigured) {
        openSettings()
        return
      }

      const history: UiMessage[] = [...messages, { role: 'user', content }]
      const userCount = history.filter((m) => m.role === 'user').length
      const promo = isPromoTurn(card, userCount)
      setMessages([...history, { role: 'assistant', content: '', promo }])
      setInput('')
      setError(null)
      setBusy(true)

      const controller = new AbortController()
      abortRef.current = controller
      let received = false

      try {
        await streamChat({
          config,
          system: buildSystemPrompt(card, userCount),
          messages: history.map(({ role, content }) => ({ role, content })),
          signal: controller.signal,
          onDelta: (chunk) => {
            received = true
            setMessages((current) => {
              const next = current.slice()
              const last = next[next.length - 1]
              if (last?.role === 'assistant') {
                next[next.length - 1] = { ...last, content: last.content + chunk }
              }
              return next
            })
          },
        })
        if (!received) setError('Der Anbieter hat eine leere Antwort geliefert.')
      } catch (err) {
        if (!isAbort(err)) {
          setError(err instanceof AiError ? err.message : 'Es ist ein unerwarteter Fehler aufgetreten.')
        }
      } finally {
        // Leere Antwort-Blase (z. B. nach Fehler/Abbruch ohne Text) entfernen.
        setMessages((current) => {
          const last = current[current.length - 1]
          return last?.role === 'assistant' && last.content === '' ? current.slice(0, -1) : current
        })
        setBusy(false)
        inputRef.current?.focus()
      }
    },
    [busy, card, config, isConfigured, messages, openSettings],
  )

  const stop = () => abortRef.current?.abort()

  const reset = () => {
    abortRef.current?.abort()
    setMessages([])
    setError(null)
    setInput('')
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      void send(input)
    }
  }

  return (
    <div className="chat" role="dialog" aria-modal="true" aria-label={`Chat mit ${card.name}`}>
      <div className="chat__panel">
        <header className="chat__head">
          {card.image ? (
            <img src={card.image} alt="" className="chat__avatar" />
          ) : (
            <span className="chat__avatar chat__avatar--letter">{card.name.charAt(0)}</span>
          )}
          <div className="chat__who">
            <strong>{card.name}</strong>
            <span>{card.role}</span>
          </div>
          <button type="button" className="btn btn--small" onClick={reset} disabled={messages.length === 0}>
            Neu starten
          </button>
          <button type="button" className="btn btn--small" onClick={openSettings}>
            KI
          </button>
          <button type="button" className="icon-btn" aria-label="Chat schließen" onClick={onClose}>
            ×
          </button>
        </header>

        {!isConfigured && (
          <div className="chat__banner">
            <span>Für den Chat fehlt noch ein API-Key ({providerLabel}).</span>
            <button type="button" className="btn btn--small btn--solid" onClick={openSettings}>
              Key eingeben
            </button>
          </div>
        )}

        <div className="chat__list" ref={listRef} aria-live="polite">
          <div className="bubble bubble--coach">{card.greeting}</div>

          {messages.length === 0 && card.starters.length > 0 && (
            <div className="chat__starters">
              {card.starters.map((starter) => (
                <button key={starter} type="button" className="chip" onClick={() => void send(starter)}>
                  {starter}
                </button>
              ))}
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`bubble ${m.role === 'user' ? 'bubble--user' : 'bubble--coach'}`}>
              {m.promo && <span className="bubble__ad">Anzeige · fiktiv</span>}
              {visibleText(m.content) || (busy && i === messages.length - 1 ? <span className="typing">…</span> : null)}
            </div>
          ))}

          {error && <div className="chat__error" role="alert">{error}</div>}
        </div>

        <form
          className="chat__form"
          onSubmit={(e) => {
            e.preventDefault()
            void send(input)
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            rows={2}
            placeholder={`Nachricht an ${card.name} …`}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Nachricht"
          />
          {busy ? (
            <button type="button" className="btn" onClick={stop}>
              Stopp
            </button>
          ) : (
            <button type="submit" className="btn btn--solid" disabled={!input.trim()}>
              Senden
            </button>
          )}
        </form>
        <p className="chat__foot">KI-Persona ohne Fachberatung · Antworten können Fehler enthalten.{card.promo && ' · Angebote in diesem Chat sind erfundene Gags – nichts davon ist real kaufbar.'}</p>
      </div>
    </div>
  )
}
