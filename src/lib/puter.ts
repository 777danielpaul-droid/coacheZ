/**
 * Anbindung an Puter.js (https://docs.puter.com) – "User-Pays"-Modell:
 * Es gibt keinen API-Key. Wer chattet, meldet sich (kostenlos) bei Puter an, und
 * die KI-Nutzung läuft über das monatliche Gratis-Guthaben des eigenen Puter-Kontos.
 * Für den Betreiber der Seite entstehen keine Kosten.
 *
 * Das Skript wird erst geladen, wenn diese Funktion genutzt wird (nicht beim Seitenaufruf).
 */
import { AiError } from './errors'

interface PuterChunk {
  text?: string
}

interface PuterModel {
  id: string
  provider?: string
  cost?: { input?: number; output?: number }
}

interface PuterApi {
  ai: {
    chat: (
      messages: { role: string; content: string }[],
      testMode: boolean,
      options: Record<string, unknown>,
    ) => Promise<unknown>
    listModels: () => Promise<PuterModel[]>
  }
  auth: {
    signIn: () => Promise<unknown>
    isSignedIn?: () => boolean
  }
}

declare global {
  interface Window {
    puter?: PuterApi
  }
}

const SCRIPT_URL = 'https://js.puter.com/v2/'
let loading: Promise<PuterApi> | null = null

export function loadPuter(): Promise<PuterApi> {
  if (window.puter) return Promise.resolve(window.puter)
  if (loading) return loading

  loading = new Promise<PuterApi>((resolve, reject) => {
    const fail = (message: string) => {
      loading = null
      reject(new AiError(message))
    }
    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.onerror = () => {
      script.remove()
      fail('Puter konnte nicht geladen werden. Blockiert ein Werbe-/Tracking-Blocker js.puter.com?')
    }
    script.onload = () => {
      // Sicherheitsnetz: falls die Bibliothek einen Moment zum Initialisieren braucht.
      let tries = 0
      const check = () => {
        if (window.puter) resolve(window.puter)
        else if (++tries > 30) fail('Puter konnte nicht initialisiert werden.')
        else window.setTimeout(check, 100)
      }
      check()
    }
    document.head.appendChild(script)
  })
  return loading
}

export async function listPuterModels(): Promise<{ id: string; free: boolean }[]> {
  const api = await loadPuter()
  const models = await api.ai.listModels()
  return models
    .filter((m) => m && typeof m.id === 'string')
    .map((m) => ({ id: m.id, free: m.cost?.input === 0 && m.cost?.output === 0 }))
}

interface StreamArgs {
  model: string
  system: string
  messages: { role: 'user' | 'assistant'; content: string }[]
  signal?: AbortSignal
  onDelta: (text: string) => void
}

export async function streamPuter(args: StreamArgs): Promise<void> {
  const api = await loadPuter()
  const payload = [{ role: 'system', content: args.system }, ...args.messages]

  let response: unknown
  try {
    // Öffnet beim ersten Mal automatisch das Puter-Anmeldefenster.
    response = await api.ai.chat(payload, false, { model: args.model, stream: true })
  } catch (err) {
    throw new AiError(describePuterError(err))
  }

  const iterable = response as AsyncIterable<PuterChunk> | null
  if (iterable && typeof iterable[Symbol.asyncIterator] === 'function') {
    try {
      for await (const part of iterable) {
        if (args.signal?.aborted) throw new DOMException('Aborted', 'AbortError')
        if (part?.text) args.onDelta(part.text)
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') throw err
      throw new AiError(describePuterError(err))
    }
    return
  }

  // Kein Stream (z. B. bei bestimmten Modellen): komplette Antwort auf einmal.
  const text = extractText(response)
  if (text) args.onDelta(text)
}

function extractText(response: unknown): string {
  const content = (response as { message?: { content?: unknown } } | null)?.message?.content
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content.map((c) => (typeof c?.text === 'string' ? c.text : '')).join('')
  }
  return ''
}

function describePuterError(err: unknown): string {
  const e = err as { error?: { message?: string; code?: string } | string; message?: string; code?: string } | null
  const raw =
    (typeof e?.error === 'string' ? e.error : e?.error?.message) ?? e?.message ?? ''
  const code = (typeof e?.error === 'object' ? e?.error?.code : undefined) ?? e?.code ?? ''
  const text = `${code} ${raw}`.toLowerCase()

  if (/cancel|closed|dismiss|denied|auth/.test(text)) {
    return 'Die Anmeldung bei Puter wurde abgebrochen. Ohne Anmeldung kann der Gratis-Chat nicht laufen.'
  }
  if (/insufficient|quota|credit|limit|usage/.test(text)) {
    return 'Dein monatliches Gratis-Guthaben bei Puter ist aufgebraucht. Wähle ein günstigeres Modell oder nutze einen eigenen API-Key.'
  }
  return raw ? `Puter meldet einen Fehler: ${raw}` : 'Beim Gratis-Chat über Puter ist ein Fehler aufgetreten.'
}
