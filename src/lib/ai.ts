/**
 * Schlanke, abhängigkeitsfreie Anbindung an mehrere KI-Anbieter.
 * Alle Aufrufe gehen direkt vom Browser an den jeweiligen Anbieter – es gibt
 * keinen eigenen Server dazwischen. Antworten werden per Streaming (SSE)
 * Stück für Stück geliefert.
 */

export type ProviderId =
  | 'openai'
  | 'anthropic'
  | 'gemini'
  | 'groq'
  | 'deepseek'
  | 'zai'
  | 'huggingface'
  | 'vercel'
  | 'custom'

export interface FallbackModel {
  id: string
  free: boolean
}

export interface ProviderInfo {
  id: ProviderId
  label: string
  /** Wire-Format: Anthropic und Gemini haben eigene APIs, alle anderen sind OpenAI-kompatibel. */
  kind: 'openai' | 'anthropic' | 'gemini'
  /** Standard-Basis-URL (nur für OpenAI-kompatible Anbieter relevant). */
  baseUrl: string
  /** Darf der Nutzer die Basis-URL überschreiben? */
  baseUrlEditable: boolean
  /** Bestes bekanntes Gratis-Modell (bzw. günstigstes, falls es kein Free-Tier gibt). */
  defaultModel: string
  keyPlaceholder: string
  keyHelp: string
  keyRequired: boolean
  /** Kurzer Hinweis zu Gratis-Angeboten des Anbieters. */
  freeNote: string
  /** Bekannte Modelle – werden gezeigt, solange die Live-Liste nicht geladen werden kann. */
  fallbackModels: FallbackModel[]
}

export const DEFAULT_CUSTOM_BASE_URL = 'https://openrouter.ai/api/v1'

export const PROVIDERS: ProviderInfo[] = [
  {
    id: 'openai',
    label: 'OpenAI',
    kind: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    baseUrlEditable: false,
    defaultModel: 'gpt-4o-mini',
    keyPlaceholder: 'sk-…',
    keyHelp: 'platform.openai.com → API keys',
    keyRequired: true,
    freeNote: 'OpenAI hat kein dauerhaftes Gratis-Kontingent – es wird Guthaben benötigt.',
    fallbackModels: [
      { id: 'gpt-4o-mini', free: false },
      { id: 'gpt-4.1-mini', free: false },
      { id: 'gpt-4.1', free: false },
      { id: 'gpt-4o', free: false },
    ],
  },
  {
    id: 'anthropic',
    label: 'Anthropic (Claude)',
    kind: 'anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    baseUrlEditable: false,
    defaultModel: 'claude-haiku-4-5-20251001',
    keyPlaceholder: 'sk-ant-…',
    keyHelp: 'console.anthropic.com → API keys',
    keyRequired: true,
    freeNote: 'Anthropic hat kein Gratis-Kontingent für die API – es wird Guthaben benötigt.',
    fallbackModels: [
      { id: 'claude-haiku-4-5-20251001', free: false },
      { id: 'claude-sonnet-5', free: false },
      { id: 'claude-opus-5', free: false },
    ],
  },
  {
    id: 'gemini',
    label: 'Google Gemini',
    kind: 'gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    baseUrlEditable: false,
    defaultModel: 'gemini-2.5-flash',
    keyPlaceholder: 'AIza…',
    keyHelp: 'aistudio.google.com → Get API key',
    keyRequired: true,
    freeNote: 'Google AI Studio: Flash-/Flash-Lite-Modelle sind mit Tageslimits kostenlos nutzbar.',
    fallbackModels: [
      { id: 'gemini-2.5-flash', free: true },
      { id: 'gemini-2.5-flash-lite', free: true },
      { id: 'gemini-2.5-pro', free: false },
    ],
  },
  {
    id: 'groq',
    label: 'Groq',
    kind: 'openai',
    baseUrl: 'https://api.groq.com/openai/v1',
    baseUrlEditable: false,
    defaultModel: 'llama-3.3-70b-versatile',
    keyPlaceholder: 'gsk_…',
    keyHelp: 'console.groq.com/keys',
    keyRequired: true,
    freeNote: 'Groq bietet einen dauerhaften Free-Plan mit Rate-Limits für alle Modelle.',
    fallbackModels: [
      { id: 'llama-3.3-70b-versatile', free: true },
      { id: 'openai/gpt-oss-120b', free: true },
      { id: 'llama-3.1-8b-instant', free: true },
    ],
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    kind: 'openai',
    baseUrl: 'https://api.deepseek.com',
    baseUrlEditable: false,
    defaultModel: 'deepseek-v4-flash',
    keyPlaceholder: 'sk-…',
    keyHelp: 'platform.deepseek.com → API keys',
    keyRequired: true,
    freeNote: 'DeepSeek hat kein dauerhaftes Free-Tier, ist aber sehr günstig.',
    fallbackModels: [
      { id: 'deepseek-v4-flash', free: false },
      { id: 'deepseek-v4-pro', free: false },
    ],
  },
  {
    id: 'zai',
    label: 'Z.ai (GLM)',
    kind: 'openai',
    baseUrl: 'https://api.z.ai/api/paas/v4',
    baseUrlEditable: true,
    defaultModel: 'glm-4.7-flash',
    keyPlaceholder: 'Z.ai API-Key',
    keyHelp: 'z.ai → API Keys (Basis-URL nur für Coding-Plan/China ändern)',
    keyRequired: true,
    freeNote: 'Z.ai: GLM-4.7-Flash und GLM-4.5-Flash sind dauerhaft kostenlos.',
    fallbackModels: [
      { id: 'glm-4.7-flash', free: true },
      { id: 'glm-4.5-flash', free: true },
      { id: 'glm-5.1', free: false },
      { id: 'glm-5.2', free: false },
    ],
  },
  {
    id: 'huggingface',
    label: 'Hugging Face',
    kind: 'openai',
    baseUrl: 'https://router.huggingface.co/v1',
    baseUrlEditable: false,
    defaultModel: 'openai/gpt-oss-120b',
    keyPlaceholder: 'hf_…',
    keyHelp: 'huggingface.co/settings/tokens (Recht „Make calls to Inference Providers“)',
    keyRequired: true,
    freeNote: 'Hugging Face gibt Gratis-Nutzern ein kleines monatliches Guthaben – keine einzelnen Gratis-Modelle.',
    fallbackModels: [
      { id: 'openai/gpt-oss-120b', free: false },
      { id: 'Qwen/Qwen3-32B', free: false },
      { id: 'deepseek-ai/DeepSeek-V3.2', free: false },
    ],
  },
  {
    id: 'vercel',
    label: 'Vercel AI Gateway',
    kind: 'openai',
    baseUrl: 'https://ai-gateway.vercel.sh/v1',
    baseUrlEditable: false,
    defaultModel: 'openai/gpt-4o-mini',
    keyPlaceholder: 'AI-Gateway-Key',
    keyHelp: 'vercel.com → AI Gateway → API Keys',
    keyRequired: true,
    freeNote: 'Vercel rechnet über dein Gateway-Guthaben ab; ein Startguthaben hängt vom Account ab.',
    fallbackModels: [
      { id: 'openai/gpt-4o-mini', free: false },
      { id: 'google/gemini-2.5-flash', free: false },
      { id: 'anthropic/claude-sonnet-4.5', free: false },
    ],
  },
  {
    id: 'custom',
    label: 'Eigene URL (OpenAI-kompatibel)',
    kind: 'openai',
    baseUrl: DEFAULT_CUSTOM_BASE_URL,
    baseUrlEditable: true,
    defaultModel: 'meta-llama/llama-3.3-70b-instruct:free',
    keyPlaceholder: 'Key (bei lokalen Servern oft leer)',
    keyHelp: 'z. B. OpenRouter (Standard), Mistral, Together oder lokal Ollama / LM Studio',
    keyRequired: false,
    freeNote: 'OpenRouter: Modelle mit „:free“ sind kostenlos. Lokale Server (Ollama, LM Studio) kosten nichts.',
    fallbackModels: [{ id: 'meta-llama/llama-3.3-70b-instruct:free', free: true }],
  },
]

export function getProvider(id: ProviderId): ProviderInfo {
  return PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0]
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ActiveAiConfig {
  provider: ProviderId
  apiKey: string
  model: string
  baseUrl: string
}

/** Wie viele der letzten Nachrichten an die API geschickt werden. */
const MAX_HISTORY = 24

export class AiError extends Error {}

interface StreamArgs {
  config: ActiveAiConfig
  system: string
  messages: ChatMessage[]
  signal?: AbortSignal
  onDelta: (text: string) => void
}

export async function streamChat(args: StreamArgs): Promise<void> {
  const { config } = args
  const provider = getProvider(config.provider)
  if (provider.keyRequired && !config.apiKey.trim()) {
    throw new AiError('Es ist noch kein API-Key hinterlegt.')
  }

  const messages = args.messages.slice(-MAX_HISTORY)
  const model = config.model.trim() || provider.defaultModel

  let response: Response
  try {
    response = await fetch(...buildRequest(config, model, args.system, messages, args.signal))
  } catch (err) {
    if (isAbort(err)) throw err
    throw new AiError(
      'Keine Verbindung zum Anbieter. Prüfe Internet, URL und ob der Anbieter Browser-Zugriffe (CORS) erlaubt.',
    )
  }

  if (!response.ok) throw new AiError(await describeHttpError(response))
  if (!response.body) throw new AiError('Der Anbieter hat keine Antwort geliefert.')

  await readSse(response.body, (event, data) => {
    const text = extractDelta(config.provider, event, data)
    if (text) args.onDelta(text)
  })
}

/* ------------------------------ Requests ------------------------------ */

function buildRequest(
  config: ActiveAiConfig,
  model: string,
  system: string,
  messages: ChatMessage[],
  signal?: AbortSignal,
): [string, RequestInit] {
  const key = config.apiKey.trim()

  switch (config.provider) {
    case 'anthropic':
      return [
        'https://api.anthropic.com/v1/messages',
        {
          method: 'POST',
          signal,
          headers: {
            'content-type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            // Pflicht-Header für Aufrufe direkt aus dem Browser.
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({ model, max_tokens: 1024, system, messages, stream: true }),
        },
      ]

    case 'gemini': {
      const modelPath = encodeURIComponent(model.replace(/^models\//, ''))
      return [
        `https://generativelanguage.googleapis.com/v1beta/models/${modelPath}:streamGenerateContent?alt=sse`,
        {
          method: 'POST',
          signal,
          headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: messages.map((m) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }],
            })),
          }),
        },
      ]
    }

    default: {
      const base = effectiveBaseUrl(config)
      const headers: Record<string, string> = { 'content-type': 'application/json' }
      if (key) headers.authorization = `Bearer ${key}`
      const body: Record<string, unknown> = {
        model,
        stream: true,
        messages: [{ role: 'system', content: system }, ...messages],
      }
      // Z.ai: "Denkmodus" ausschalten, sonst dauert es bis zur ersten Antwort deutlich länger.
      if (config.provider === 'zai') body.thinking = { type: 'disabled' }
      return [`${base}/chat/completions`, { method: 'POST', signal, headers, body: JSON.stringify(body) }]
    }
  }
}

export function effectiveBaseUrl(config: ActiveAiConfig): string {
  const info = getProvider(config.provider)
  return (config.baseUrl.trim() || info.baseUrl).replace(/\/+$/, '')
}

/* ------------------------------ Antworten ----------------------------- */

function extractDelta(provider: ProviderId, event: string, data: string): string {
  if (data === '[DONE]') return ''
  let json: unknown
  try {
    json = JSON.parse(data)
  } catch {
    return ''
  }
  const obj = json as Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

  if (obj.error) {
    const msg = typeof obj.error === 'string' ? obj.error : obj.error.message
    throw new AiError(msg ? `Anbieter-Fehler: ${msg}` : 'Der Anbieter hat einen Fehler gemeldet.')
  }

  switch (provider) {
    case 'anthropic':
      return event === 'content_block_delta' && obj.delta?.type === 'text_delta'
        ? String(obj.delta.text ?? '')
        : ''
    case 'gemini': {
      const parts: { text?: string }[] = obj.candidates?.[0]?.content?.parts ?? []
      return parts.map((p) => p.text ?? '').join('')
    }
    default:
      return String(obj.choices?.[0]?.delta?.content ?? '')
  }
}

/** Liest einen Server-Sent-Events-Stream und ruft pro Event `onEvent` auf. */
async function readSse(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: string, data: string) => void,
): Promise<void> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  const flush = (block: string) => {
    let event = ''
    const dataLines: string[] = []
    for (const line of block.split(/\r?\n/)) {
      if (line.startsWith('event:')) event = line.slice(6).trim()
      else if (line.startsWith('data:')) dataLines.push(line.slice(5).replace(/^ /, ''))
    }
    if (dataLines.length) onEvent(event, dataLines.join('\n'))
  }

  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const blocks = buffer.split(/\r?\n\r?\n/)
    buffer = blocks.pop() ?? ''
    blocks.forEach(flush)
  }
  buffer += decoder.decode()
  if (buffer.trim()) flush(buffer)
}

/* ------------------------------- Fehler ------------------------------- */

export async function describeHttpError(res: Response): Promise<string> {
  let detail = ''
  try {
    const text = await res.text()
    try {
      const json = JSON.parse(text)
      detail = json?.error?.message ?? json?.message ?? json?.error ?? ''
      if (typeof detail !== 'string') detail = JSON.stringify(detail)
    } catch {
      detail = text.slice(0, 200)
    }
  } catch {
    /* Body nicht lesbar – dann eben ohne Detail */
  }

  const base =
    res.status === 401 || res.status === 403
      ? 'Der API-Key wurde abgelehnt. Prüfe Key und Anbieter.'
      : res.status === 404
        ? 'Modell oder Adresse nicht gefunden. Prüfe den Modellnamen (und die URL).'
        : res.status === 429
          ? 'Zu viele Anfragen oder Kontingent aufgebraucht (429).'
          : `Der Anbieter meldet Fehler ${res.status}.`
  return detail ? `${base} (${detail})` : base
}

export function isAbort(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError'
}
