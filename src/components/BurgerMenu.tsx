import { useEffect, useState } from 'react'
import { navigation } from '../schemas/navigation'
import { AccentPicker } from './AccentPicker'
import { useAiSettings } from '../context/AiSettingsContext'

export function BurgerMenu() {
  const [open, setOpen] = useState(false)
  const { openSettings, isConfigured, providerLabel } = useAiSettings()

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
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
        className={`nav-overlay ${open ? 'nav-overlay--open' : ''}`}
        aria-hidden={!open}
      >
        <div className="nav-overlay__inner">
          <ul className="nav-overlay__list">
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
    </>
  )
}
