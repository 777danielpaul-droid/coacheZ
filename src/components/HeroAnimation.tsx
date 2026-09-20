import { useEffect, useState } from 'react'
import { animationSteps, ANIMATION_LOOP_MS, type AnimationStep } from '../schemas/animation'

function AnimatedPath({ step }: { step: Extract<AnimationStep, { kind: 'path' }> }) {
  return (
    <path
      className="hero-svg__path"
      d={step.d}
      style={{ animationDelay: `${step.delayMs}ms` }}
    />
  )
}

function AnimatedText({ step }: { step: Extract<AnimationStep, { kind: 'text' }> }) {
  return (
    <text
      className={`hero-svg__text hero-svg__text--${step.tone}`}
      x={step.x}
      y={step.y}
    >
      {step.text.split('').map((char, index) => (
        <tspan
          key={index}
          className="hero-svg__char"
          style={{ animationDelay: `${step.delayMs + index * step.msPerChar}ms` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </tspan>
      ))}
    </text>
  )
}

/**
 * Zeichnet das "if you try / win / lose – don't try / lose"-Diagramm.
 * Der `loopKey` wird periodisch hochgezählt und remountet das <svg>,
 * wodurch alle CSS-Animationen sauber von vorne beginnen (kein Restart-Bug
 * durch bereits abgelaufene Keyframes).
 */
export function HeroAnimation() {
  const [loopKey, setLoopKey] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setLoopKey((k) => k + 1)
    }, ANIMATION_LOOP_MS)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="hero-svg" role="img" aria-label="Diagramm: Nur wer es versucht, kann gewinnen">
      <svg key={loopKey} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet">
        {animationSteps.map((step) =>
          step.kind === 'path' ? (
            <AnimatedPath key={step.id} step={step} />
          ) : (
            <AnimatedText key={step.id} step={step} />
          ),
        )}
      </svg>
    </div>
  )
}
