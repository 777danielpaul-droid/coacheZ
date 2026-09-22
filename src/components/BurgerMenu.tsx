import { useEffect, useRef, useState } from 'react'
import { navigation } from '../schemas/navigation'
import { AccentPicker } from './AccentPicker'
import { useAiSettings } from '../context/AiSettingsContext'

export function BurgerMenu() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const { openSettings, isConfigured, providerLabel } = useAiSettings()

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div className="burger-wrap" ref={wrapRef}>
      <button
        type="button"
        className="burger"
        aria-expanded={open}
        aria-controls="primary-navigation"
        aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`burger__bar ${open ? 'burger__bar--open' : ''}`} />
        <span className={`burger__bar ${open ? 'burger__bar--open' : ''}`} />
        <span className={`burger__bar ${open ? 'burger__bar--open' : ''}`} />
      </button>

      <nav
        id="primary-navigation"
        className={`nav-dropdown ${open ? 'nav-dropdown--open' : ''}`}
        aria-hidden={!open}
      >
        <div className="nav-dropdown__inner">
          <ul className="nav-dropdown__list">
            {navigation.map((item) => (
              <li key={item.id}>
                <a href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <AccentPicker />

          <div className="ai-entry">
            <button
              type="button"
              className="ai-entry__button"
              onClick={() => {
                setOpen(false)
                openSettings()
              }}
            >
              KI-Einstellungen
            </button>
            <span className="ai-entry__status">
              {isConfigured ? `Verbunden: ${providerLabel}` : 'Noch kein API-Key hinterlegt'}
            </span>
          </div>
        </div>
      </nav>
    </div>
  )
}
