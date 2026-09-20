import { useTheme } from '../context/ThemeContext'

export function AccentPicker() {
  const { accent, setAccent } = useTheme()

  return (
    <div className="accent-picker">
      <label className="accent-picker__label" htmlFor="accent-color">
        Akzentfarbe
      </label>
      <input
        id="accent-color"
        className="accent-picker__input"
        type="color"
        value={accent}
        onChange={(e) => setAccent(e.target.value)}
      />
      <p className="accent-picker__hint">
        Wähle eine Farbe – sie erscheint als einziger Farb-Akzent auf der gesamten Seite.
      </p>
    </div>
  )
}
