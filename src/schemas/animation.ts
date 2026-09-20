import { z } from 'zod'

/**
 * Ein gezeichneter Linienabschnitt (die Gabelungen des Diagramms).
 */
const pathStepSchema = z.object({
  kind: z.literal('path'),
  id: z.string().min(1),
  d: z.string().min(1),
  delayMs: z.number().nonnegative(),
})

/**
 * Ein Text, der Zeichen für Zeichen "getippt" erscheint.
 */
const textStepSchema = z.object({
  kind: z.literal('text'),
  id: z.string().min(1),
  x: z.number(),
  y: z.number(),
  text: z.string().min(1),
  delayMs: z.number().nonnegative(),
  msPerChar: z.number().positive(),
  /** Optionaler Farb-Ton für dieses Wort – z. B. "win" wärmer einfärben. */
  tone: z.enum(['default', 'positive', 'negative']).default('default'),
})

export const animationStepSchema = z.discriminatedUnion('kind', [
  pathStepSchema,
  textStepSchema,
])

export const animationSchema = z.array(animationStepSchema).min(1)

export type AnimationStep = z.infer<typeof animationStepSchema>

/**
 * Inhalt und Timing der Eyecatcher-Animation im Hero-Bereich.
 * Entspricht der ursprünglichen Handzeichnung: if you → try → win / lose,
 * bzw. don't try → lose.
 */
const rawAnimationSteps: AnimationStep[] = [
  { kind: 'text', id: 'if-you', x: 250, y: 465, text: 'if you', delayMs: 300, msPerChar: 60, tone: 'default' },

  { kind: 'path', id: 'fork-main', d: 'M 440 450 L 500 450 M 500 320 L 500 580', delayMs: 800 },

  { kind: 'path', id: 'branch-try', d: 'M 500 320 L 560 320', delayMs: 1500 },
  { kind: 'text', id: 'try', x: 580, y: 335, text: 'try', delayMs: 1600, msPerChar: 70, tone: 'default' },

  {
    kind: 'path',
    id: 'fork-outcome',
    d: 'M 660 320 L 730 320 M 730 260 L 730 380 M 730 260 L 760 260 M 730 380 L 760 380',
    delayMs: 2300,
  },
  { kind: 'text', id: 'win', x: 785, y: 275, text: 'win', delayMs: 2800, msPerChar: 70, tone: 'positive' },
  { kind: 'text', id: 'lose-1', x: 785, y: 395, text: 'lose', delayMs: 3200, msPerChar: 70, tone: 'negative' },

  { kind: 'path', id: 'branch-dont-try', d: 'M 500 580 L 560 580', delayMs: 4500 },
  { kind: 'text', id: 'dont-try', x: 580, y: 595, text: "don't try", delayMs: 4800, msPerChar: 50, tone: 'default' },

  { kind: 'path', id: 'end-dont-try', d: 'M 740 580 L 770 580', delayMs: 6000 },
  { kind: 'text', id: 'lose-2', x: 790, y: 595, text: 'lose', delayMs: 6300, msPerChar: 70, tone: 'negative' },
]

export const animationSteps = animationSchema.parse(rawAnimationSteps)

/** Nach dieser Zeit wird die Animation zurückgesetzt und läuft erneut. */
export const ANIMATION_LOOP_MS = 11000
