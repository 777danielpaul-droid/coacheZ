# 🐉 coachez — Dragon Ball Coaching Agency

**Sechs Coaches. Ein Versuch.**  
Eine Dragon-Ball-Fan-SPA, die sechs Charaktere als Coaching-Agentur inszeniert.  
Alles monochrom — bis auf einen einzigen Farb-Akzent, den du selbst wählst.  
Mit KI-Chat, jedem Coach auf seine Art.

⚡ **Von der Idee zum Prototyp in unter 5 Stunden.**

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black&style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Zod](https://img.shields.io/badge/Zod-3.23-3E67B1?logo=zod&logoColor=white&style=for-the-badge)

---

## ✨ Key Features

### 🎨 **Monochrom + Custom Accent**
Die gesamte Seite lebt vom Video-Hintergrund und einem einzigen Akzent.  
Ein `<input type="color">` steuert Linien, Buttons, Glow und Überschrift — alles folgt deiner Wahl.

### 🐲 **6 Trainerkarten**
Goku, Vegeta, Roshi, Piccolo, C18 und Gohan — jeder mit eigener Rolle, Persona und Chat.  
Scroll-Animation mit gestaffeltem Delay, Bilder via Gemini generiert.

### 🎬 **Hero-Animation**
Handgezeichnetes "if you try → win / lose / don't try → lose" als SVG-Loop.  
Linien zeichnen sich, Buchstaben tippen sich — alles via CSS-Animationen mit `animationDelay`.

### 💬 **KI-Chat**
OpenAI, Anthropic, Gemini, OpenAI-kompatibel (OpenRouter, Groq, Ollama).  
Keys nur im Browser, Streaming via `fetch` + `ReadableStream`.

### 📺 **Video-Hintergrund**
Festes Feuerwerk-Video (1080p, 9s Loop) — auf der gesamten Seite, nicht nur im Hero.  
Im Light-Mode per CSS-Filter invertiert.

### 📜 **Legal Pages**
Impressum & Datenschutz als Fullscreen-Overlay. Statisch, kein Tracking, kein Backend.

---

## 🏗️ Architecture & Workflow

Built with **React 18 + Vite 5 + TypeScript**, Zod for runtime validation, and CSS Custom Properties for theming.

- **`src/schemas/`** — Zod-validated content (animation steps, navigation, training cards, site copy)
- **`src/components/`** — UI components (Header, BurgerMenu, TrainingCards, HeroAnimation, LegalPages)
- **`src/context/`** — ThemeContext (Dark/Light + Accent), AiSettingsContext (provider, keys, models)
- **`src/lib/`** — AI streaming, model detection, persona rules
- **`src/index.css`** — Design tokens, scroll animations, legal overlay

The app follows a **component-driven pattern** with strict separation between content (schemas), state (contexts), and presentation (components).

---

## 📊 Technical Specifications

- **Bundle Size**: ~250 KB JS (gzipped ~77 KB)
- **Video**: 1080p, 9s Loop, ~1.2 MB
- **Animations**: CSS GPU-composited (`transform` / `opacity`)
- **Accessibility**: `prefers-reduced-motion` honored
- **Deployment**: GitHub Pages (per GitHub Action) oder Render (Static Site)
- **No Backend**: Static SPA, all state in localStorage

---

## 📅 Development

```bash
npm install
npm run dev      # local dev server (http://localhost:5173)
npm run build    # production build
npm run preview  # preview the build
```

### 🚀 Deployment

Gebaut wird immer aus dem Quellcode – Build-Ausgaben (`dist/`) gehören **nicht** ins Repository.

- **GitHub Pages:** Settings → Pages → *Source: **GitHub Actions***. Der Workflow `.github/workflows/deploy.yml` baut bei jedem Push auf `main` und veröffentlicht `dist/`. (Nicht „Deploy from a branch“ wählen – dann wird der Quellcode statt der gebauten Seite ausgeliefert.)
- **Render / Netlify / Vercel:** Build Command `npm install && npm run build`, Publish Directory `dist`.
- Bilder und Video liegen in `public/` und werden mit relativen Pfaden geladen (`base: './'` in `vite.config.ts`), funktionieren also auch in Unterverzeichnissen.

---

## 📄 License

Personal Project — Non-commercial use only.

---

## 💝 Credits

Created by Daniel Paul (777danielpaul-droid)
