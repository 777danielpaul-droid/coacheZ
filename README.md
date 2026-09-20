# Try vs. Don't Try

Motivations-SPA: „Nur wer es versucht, kann gewinnen.“ Vollflächiges Video
(Feuerwerk) im Hero-Bereich, darüber die hand-gezeichnete try/don't-try-
Animation als Eyecatcher. Minimaler Header mit Dark/Light-Toggle und
Burgermenü.

## Setup

```bash
npm install
npm run dev       # Entwicklungsserver, meist http://localhost:5173
npm run build     # Produktions-Build nach dist/
npm run preview   # gebauten Build lokal ansehen
```

## Struktur

- `src/schemas/` – **Zod**-Schemas + validierte Inhalte:
  - `navigation.ts` – Einträge im Burgermenü
  - `animation.ts` – Timing/Inhalt der SVG-Eyecatcher-Animation
  - `content.ts` – Texte der Philosophie- und CTA-Sektion
- `src/components/`
  - `Header.tsx`, `BurgerMenu.tsx`, `ThemeToggle.tsx`
  - `VideoBackground.tsx` – Video-Loop, wird im Light-Mode per CSS-Filter invertiert
  - `HeroAnimation.tsx` – rendert die Schritte aus `animation.ts` und
    loopt sie alle 11 s (remount via `key`)
  - `Sections.tsx` – Philosophie- & CTA-Abschnitt
- `src/context/ThemeContext.tsx` – Dark/Light-Zustand, in `localStorage`
  gemerkt, respektiert `prefers-color-scheme` beim ersten Laden
- `public/fireworx.mp4` – dein Hintergrundvideo

## Dark/Light & Video

Der Light-Mode setzt `--video-filter: invert(1)` auf das `<video>`-Element,
wodurch der Feuerwerks-Loop invertiert dargestellt wird. Die Akzentfarben
der Animation (Cyan im Dark-Mode, Ocker/Rot im Light-Mode) sind bewusst so
gewählt, dass sie zur jeweiligen invertierten Videostimmung passen.

## Inhalte anpassen

Alle Texte (Menüpunkte, Animationsschritte, Philosophie/CTA) liegen als
typisierte, mit Zod validierte Objekte in `src/schemas/`. Ein Tippfehler in
der Struktur (z. B. eine href ohne `#`) wirft beim Start einen Laufzeitfehler
statt eines stillen Bugs.

## Hinweis zur Videogröße

`fireworx.mp4` ist aktuell 4K (≈ 70 MB). Für den produktiven Einsatz lohnt
sich eine komprimierte 1080p-Version (z. B. via `ffmpeg -i fireworx.mp4
-vf scale=1920:-2 -crf 28 fireworx-web.mp4`), damit der Hero-Bereich schnell
lädt.

## KI-Chat mit den Coaches

- Burgermenü → **KI-Einstellungen**: Anbieter wählen (OpenAI, Anthropic, Google Gemini oder OpenAI-kompatibel mit eigener URL, z. B. OpenRouter/Groq/Ollama), API-Key und optional Modell eintragen.
- Ein Klick auf „… buchen“ öffnet den Chat mit dem jeweiligen Coach.
- Personas, Begrüßung und Schnellstart-Fragen pro Coach stehen in `src/schemas/trainingCards.ts` (`persona`, `greeting`, `starters`). Gemeinsame Regeln für alle Coaches in `src/lib/persona.ts`.
- Anbieter-Anbindung (Streaming): `src/lib/ai.ts`. Keys liegen nur im Browser (localStorage bzw. sessionStorage) und gehen direkt an den Anbieter.
- Modellliste: Sobald ein Key eingetragen ist, lädt der Dialog alle verfügbaren Modelle vom Anbieter (`src/lib/models.ts`), markiert Gratis-Modelle und trägt automatisch das beste Gratis-Modell ein (Reihenfolge je Anbieter in `PREFERENCE`). Schlägt der Abruf fehl (z. B. CORS), werden bekannte Modelle aus `src/lib/ai.ts` gezeigt; eigene Modellnamen kann man immer eintippen.
- Fiktive Werbung: `promo` pro Coach in `src/schemas/trainingCards.ts` (`every` = jede n-te Nutzernachricht, `offer` = Anweisung). Gezählt wird in `src/lib/persona.ts`, nicht vom Modell. Betroffene Antworten tragen im Chat das Label „Anzeige · fiktiv“.
