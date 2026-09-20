# coachez — Dragon Ball Fanprojekt

> **Fünf Coaches. Ein Versuch.**  
> Eine Dragon-Ball-Fan-SPA, die fünf Charaktere als Coaching-Agentur inszeniert.  
> Alles monochrom — bis auf einen einzigen Farb-Akzent, den du selbst wählst.  
> Mit KI-Chat, jedem Coach auf seine Art.

⚡ **Von der Idee zum Prototyp in unter 5 Stunden.**

## Features

- **Monochrom-Style**: Die gesamte Seite lebt vom Video-Hintergrund und einem einzigen Akzent — keine Ablenkung, nur der Farb-Drop.
- **Custom Accentpicker**: Jede Farbe, die du willst. Linien, Buttons, Glow, Überschrift — alles folgt deiner Wahl.
- **6 Trainerkarten** mit Gemini-generierten Bildern, Scroll-Animation und eigenem Chat.
- **Hero-Animation**: Handgezeichnetes "if you try → win / lose / don't try → lose" als SVG-Loop mit Typing-Effekt.
- **KI-Chat**: OpenAI, Anthropic, Gemini, OpenAI-kompatibel (OpenRouter, Groq, Ollama) — Keys nur im Browser.
- **Fiktive Werbung**: Jeder Coach wirbt ab und an für sein eigenes Angebot — gekennzeichnet als "Anzeige · fiktiv".
- **Dark/Light** mit persistentem localStorage und System-Default.
- **Impressum & Datenschutz** als Fullscreen-Overlay (statisch, kein Tracking, kein Backend).

## Tech-Stack

React · Vite · TypeScript · Zod · Three.js (Hero-Animation via SVG) · CSS Custom Properties

## Setup

```bash
npm install
npm run dev       # → http://localhost:5173
npm run build     # → dist/
npm run preview
```

## Struktur

```
src/
├── components/      # UI-Komponenten (Header, BurgerMenu, TrainingCards, ...)
├── context/         # ThemeContext, AiSettingsContext
├── lib/             # ai.ts (Streaming), models.ts, persona.ts
├── schemas/         # Zod-validierte Inhalte
│   ├── animation.ts # Timing/Schritte der Hero-Animation
│   ├── content.ts   # Philosophie + CTA
│   ├── navigation.ts
│   └── trainingCards.ts  # Coaches, Personas, Greetings, Starters, Promos
└── index.css        # Design Tokens, Animationen, Legal-Overlay
```

## Besonderheiten

### Monochrom + Akzent

Die Seite nutzt drei CSS-Variablen: `--color-accent`, `--accent-glow`, `--accent-deep`.  
Alles andere (Hintergrund, Text, Panel) kommt vom Theme (Dark/Light).  
Ein einziger `<input type="color">` im Burgermenü steuert alles.

### Hero-Animation

SVG mit 11 Schritten, loopt alle 11 Sekunden via `setInterval` + `key`-Remount.  
Linien zeichnen sich, Buchstaben tippen sich — alles über CSS-Animationen mit `animationDelay`.

### KI-Chat

- Personas, Begrüßung und Schnellstart-Fragen pro Coach in `trainingCards.ts`.
- Gemeinsame Regeln für alle Coaches in `lib/persona.ts`.
- Streaming via `fetch` + `ReadableStream`, Keys im `localStorage`/`sessionStorage`.
- Gratis-Modelle werden automatisch bevorzugt (Provider-Reihenfolge in `PREFERENCE`).
- Fiktive Werbung: `every`-Intervall + `offer`-Anweisung, gezählt im Client, nicht vom Modell.

## Lizenz / Hinweis

Fanprojekt, nicht-kommerziell. Keine Verbindung zu Toei Animation, Shueisha oder Bird Studio.  
Alle Bilder KI-generiert (Google Gemini).
