import { useCallback, useEffect, useRef, useState } from 'react'
import { trainingCards, type TrainingCard } from '../schemas/trainingCards'
import { CoachChat } from './CoachChat'

/**
 * Jede Zeile besteht aus zwei getrennten Elementen: freiem Text (keine Box,
 * kein Rahmen) und einer Bildkarte (Rahmen, Platzhalter-Initiale statt
 * echtem Charakterbild – urheberrechtlich geschützt). Beide Elemente kommen
 * beim Scrollen von entgegengesetzten Seiten rein, und die Seite wechselt
 * von Zeile zu Zeile: mal Text links / Karte rechts, mal umgekehrt.
 */
export function TrainingCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeCard, setActiveCard] = useState<TrainingCard | null>(null)
  const closeChat = useCallback(() => setActiveCard(null), [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = Array.from(
      container.querySelectorAll<HTMLElement>('.training-row__text, .training-row__visual'),
    )

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.45, rootMargin: '0px 0px 0px 0px' },
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <>
    <div className="training-rows" ref={containerRef}>
      {trainingCards.map((card, index) => {
        const textFromLeft = index % 2 === 0
        const delay = `${index * 80}ms`

        return (
          <div key={card.id} className={`training-row ${textFromLeft ? '' : 'training-row--reverse'}`}>
            <div
              className={`training-row__text ${textFromLeft ? 'slide-from-left' : 'slide-from-right'}`}
              style={{ transitionDelay: delay }}
            >
              <p className="training-row__role">{card.role}</p>
              <h3 className="training-row__name">{card.name}</h3>
              <p className="training-row__description">{card.description}</p>
              <ul className="training-row__focus">
                {card.focus.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button type="button" className="training-row__cta" onClick={() => setActiveCard(card)}>
                {card.ctaLabel}
              </button>
            </div>

            <div
              className={`training-row__visual ${textFromLeft ? 'slide-from-right' : 'slide-from-left'}`}
              style={{ transitionDelay: `calc(${delay} + 120ms)` }}
              aria-hidden="true"
            >
              {card.image ? (
                <img src={card.image} alt="" className="training-row__image" />
              ) : (
                <span>{card.name.charAt(0)}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
    {activeCard && <CoachChat key={activeCard.id} card={activeCard} onClose={closeChat} />}
    </>
  )
}
