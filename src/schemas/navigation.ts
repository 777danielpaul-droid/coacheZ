import { z } from 'zod'

/**
 * Ein einzelner Eintrag im Burgermenü. Zod validiert die Struktur zur
 * Laufzeit beim Start der App – ein Tippfehler in der href oder ein
 * fehlendes Label fällt sofort auf, statt erst im Browser sichtbar zu werden.
 */
export const navItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  href: z.string().startsWith('#'),
})

export const navigationSchema = z.array(navItemSchema).min(1)

export type NavItem = z.infer<typeof navItemSchema>

const rawNavigation: NavItem[] = [
  { id: 'start', label: 'Start', href: '#start' },
  { id: 'philosophie', label: 'Philosophie', href: '#philosophie' },
  { id: 'los', label: "Los geht's", href: '#los' },
]

export const navigation = navigationSchema.parse(rawNavigation)
