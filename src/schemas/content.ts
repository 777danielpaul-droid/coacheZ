import { z } from 'zod'

export const siteContentSchema = z.object({
  hero: z.object({
    title: z.string().min(1),
  }),
  philosophy: z.object({
    heading: z.string().min(1),
    paragraphs: z.array(z.string().min(1)).min(1),
  }),
  cta: z.object({
    heading: z.string().min(1),
    body: z.string().min(1),
    buttonLabel: z.string().min(1),
  }),
})

export type SiteContent = z.infer<typeof siteContentSchema>

const rawContent: SiteContent = {
  hero: {
    title: 'coachez',
  },
  philosophy: {
    heading: 'Focus on improving, not proving.',
    paragraphs: [
      'Du willst verkaufen, führen, anziehen, investieren oder einfach dein Leben in die Hand nehmen? Diese fünf machen es möglich – jeder auf seine Art.',
      'Egal ob Immobilie, Finanz, Fitness, Anziehungskraft oder der ganzheitliche Coach: Wer bei coachez vorbeikommt, geht nicht als derselbe Mensch hinaus.',
    ],
  },
  cta: {
    heading: 'Finde deinen Coach.',
    body: 'Fünf Experten. Ein Versuch. Welcher dazu gehört, erkennst du erst, wenn du dran bist.',
    buttonLabel: 'Ich versuche es',
  },
}

export const siteContent = siteContentSchema.parse(rawContent)
