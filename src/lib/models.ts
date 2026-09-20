import { listPuterModels } from './puter'
import {
  AiError,
  describeHttpError,
  effectiveBaseUrl,
  getProvider,
  isAbort,
  type ActiveAiConfig,
  type ProviderId,
} from './ai'

export interface ModelInfo {
  id: string
  /** Kostenlos nutzbar (Free-Tier, ggf. mit Limits). */
  free: boolean
}

export interface ModelList {
  models: ModelInfo[]
  /** live = vom Anbieter geladen, fallback = fest hinterlegte bekannte Modelle */
  source: 'live' | 'fallback'
  /** Erklärung, warum nur die bekannten Modelle gezeigt werden. */
  reason?: string
}

/** Modelle, die keine Chat-Modelle sind (Embeddings, Audio, Bild, Moderation …). */
const NON_CHAT =
  /embed|whisper|tts|speech|transcribe|dall-e|imagen|image|video|veo|sora|moderation|guard|rerank|orpheus|playai|realtime|audio|davinci|babbage|turbo-instruct|compound|aqa|robotics|computer-use|search-preview|live/i

/**
 * Reihenfolge, in der das "beste" Modell gewählt wird (erster Treffer gewinnt).
 * Bevorzugt werden schnelle Chat-Modelle ohne langes "Nachdenken" – für
 * Coach-Gespräche ist niedrige Latenz wichtiger als maximale Rechenleistung.
 */
const PREFERENCE: Record<ProviderId, RegExp[]> = {
  puter: [/^gpt-5-nano$/, /nano/, /flash-lite/, /mini/],
  openai: [/^gpt-4o-mini$/, /gpt-5[\w.-]*mini/, /mini/],
  anthropic: [/haiku-4-5/, /haiku/, /sonnet/],
  gemini: [/gemini-3[\w.]*-flash(?!-lite)/, /gemini-2\.5-flash$/, /gemini-2\.5-flash(?!-lite)/, /flash-lite/, /gemma/],
  groq: [/llama-3\.3-70b/, /gpt-oss-120b/, /kimi-k2/, /qwen3?-?32b/, /llama-4/, /llama-3\.1-8b/],
  deepseek: [/flash/, /chat/],
  zai: [/glm-4\.7-flash$/, /glm-4\.5-flash$/, /flash/],
  huggingface: [/gpt-oss-120b/, /llama-3\.3-70b/, /qwen3-32b/i, /deepseek-v3/i],
  vercel: [/gpt-4o-mini/, /gemini-2\.5-flash/, /flash|mini|haiku/],
  custom: [/llama-3\.3-70b/, /gpt-oss-120b/, /deepseek.*(chat|v3)/, /qwen3.*(235|32|30)/, /gemma-3-27b/, /mistral/],
}

const listCache = new Map<string, ModelList>()

export function fallbackList(providerId: ProviderId, reason?: string): ModelList {
  return {
    models: getProvider(providerId).fallbackModels.map((m) => ({ ...m })),
    source: 'fallback',
    reason,
  }
}

/** Wählt das beste Modell: bevorzugt aus den Gratis-Modellen, sonst aus allen. */
export function pickBestModel(providerId: ProviderId, models: ModelInfo[]): ModelInfo | null {
  if (models.length === 0) return null
  const freeOnes = models.filter((m) => m.free)
  const pool = freeOnes.length > 0 ? freeOnes : models
  for (const re of PREFERENCE[providerId]) {
    const hit = pool.find((m) => re.test(m.id))
    if (hit) return hit
  }
  const def = pool.find((m) => m.id === getProvider(providerId).defaultModel)
  return def ?? pool[0]
}

export async function loadModels(config: ActiveAiConfig, signal?: AbortSignal): Promise<ModelList> {
  const info = getProvider(config.provider)
  const key = config.apiKey.trim()

  if (info.kind === 'puter') {
    try {
      const models = (await listPuterModels()).filter((m) => !NON_CHAT.test(m.id))
      if (models.length === 0) return fallbackList(config.provider, 'Puter hat keine Modelle geliefert.')
      return { models, source: 'live' }
    } catch (err) {
      if (isAbort(err)) throw err
      return fallbackList(
        config.provider,
        err instanceof AiError ? err.message : 'Die Modellliste konnte nicht von Puter geladen werden.',
      )
    }
  }

  if (info.keyRequired && !key) {
    return fallbackList(config.provider, 'Trage einen API-Key ein, um alle verfügbaren Modelle zu laden.')
  }

  const cacheKey = `${config.provider}|${effectiveBaseUrl(config)}|${key}`
  const cached = listCache.get(cacheKey)
  if (cached) return cached

  try {
    const list = await fetchLive(config, key, signal)
    if (list.models.length === 0) {
      return fallbackList(config.provider, 'Der Anbieter hat keine Chat-Modelle geliefert.')
    }
    listCache.set(cacheKey, list)
    return list
  } catch (err) {
    if (isAbort(err)) throw err
    const reason =
      err instanceof AiError
        ? err.message
        : 'Die Modellliste konnte nicht geladen werden (evtl. blockiert der Anbieter Browser-Zugriffe).'
    return fallbackList(config.provider, reason)
  }
}

/* ------------------------------ Live-Abfrage ------------------------------ */

async function fetchLive(config: ActiveAiConfig, key: string, signal?: AbortSignal): Promise<ModelList> {
  const info = getProvider(config.provider)
  let url: string
  const headers: Record<string, string> = {}

  if (info.kind === 'anthropic') {
    url = 'https://api.anthropic.com/v1/models?limit=100'
    headers['x-api-key'] = key
    headers['anthropic-version'] = '2023-06-01'
    headers['anthropic-dangerous-direct-browser-access'] = 'true'
  } else if (info.kind === 'gemini') {
    url = 'https://generativelanguage.googleapis.com/v1beta/models?pageSize=200'
    headers['x-goog-api-key'] = key
  } else {
    url = `${effectiveBaseUrl(config)}/models`
    if (key) headers.authorization = `Bearer ${key}`
  }

  let res: Response
  try {
    res = await fetch(url, { headers, signal })
  } catch (err) {
    if (isAbort(err)) throw err
    throw new AiError('Keine Verbindung zum Anbieter – zeige bekannte Modelle.')
  }
  if (!res.ok) throw new AiError(await describeHttpError(res))

  const json = (await res.json()) as Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  const local = isLocalUrl(effectiveBaseUrl(config))
  const seen = new Set<string>()
  const models: ModelInfo[] = []

  const add = (id: string, free: boolean) => {
    if (!id || seen.has(id) || NON_CHAT.test(id)) return
    seen.add(id)
    models.push({ id, free })
  }

  if (info.kind === 'gemini') {
    for (const m of json.models ?? []) {
      const id = String(m.name ?? '').replace(/^models\//, '')
      const methods: string[] = m.supportedGenerationMethods ?? []
      if (methods.includes('generateContent')) add(id, /flash|gemma/i.test(id))
    }
  } else if (info.kind === 'anthropic') {
    for (const m of json.data ?? []) add(String(m.id ?? ''), false)
  } else {
    for (const m of json.data ?? json.models ?? []) {
      const id = String(m.id ?? '')
      if (config.provider === 'openai' && !/^(gpt|o\d|chatgpt)/.test(id)) continue
      add(id, isFreeOpenAiCompat(config.provider, id, m, local))
    }
    models.sort((a, b) => a.id.localeCompare(b.id))
  }

  // Gratis-Modelle zuerst; innerhalb der Gruppen bleibt die Reihenfolge erhalten.
  models.sort((a, b) => Number(b.free) - Number(a.free))
  return { models, source: 'live' }
}

function isFreeOpenAiCompat(
  provider: ProviderId,
  id: string,
  raw: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  local: boolean,
): boolean {
  if (provider === 'groq') return true
  if (provider === 'zai') return /flash(?!x)/i.test(id)
  if (provider === 'custom' && local) return true
  if (id.endsWith(':free')) return true
  return hasZeroPricing(raw.pricing)
}

/** true, wenn ein Preisobjekt vorhanden ist und alle Preise exakt 0 sind (z. B. OpenRouter). */
function hasZeroPricing(pricing: unknown): boolean {
  if (!pricing || typeof pricing !== 'object') return false
  const values = Object.values(pricing as Record<string, unknown>)
    .map((v) => (typeof v === 'string' || typeof v === 'number' ? Number(v) : NaN))
    .filter((n) => !Number.isNaN(n))
  return values.length > 0 && values.every((n) => n === 0)
}

function isLocalUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname
    return host === 'localhost' || host === '127.0.0.1' || host === '[::1]' || host.startsWith('192.168.')
  } catch {
    return false
  }
}
