import { Header } from './components/Header'
import { VideoBackground } from './components/VideoBackground'
import { HeroAnimation } from './components/HeroAnimation'
import { TrainingCards } from './components/TrainingCards'
import { PhilosophySection, CtaSection } from './components/Sections'
import { LegalPages } from './components/LegalPages'

export default function App() {
  return (
    <>
      <VideoBackground />

      <Header />

      <main>
        <section id="start" className="hero">
          <div className="hero__content">
            <HeroAnimation />
          </div>
        </section>

        <section className="reveal-section">
          <TrainingCards />
        </section>

        <PhilosophySection />
        <CtaSection />
      </main>

      <LegalPages />
    </>
  )
}
