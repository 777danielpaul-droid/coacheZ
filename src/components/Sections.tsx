import { siteContent } from '../schemas/content'

export function PhilosophySection() {
  const { heading, paragraphs } = siteContent.philosophy
  return (
    <section id="philosophie" className="philosophy">
      <h2 className="philosophy__heading">{heading}</h2>
      <div className="philosophy__body">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  )
}

export function CtaSection() {
  const { heading, body, buttonLabel } = siteContent.cta
  return (
    <section id="los" className="cta">
      <h2 className="cta__heading">{heading}</h2>
      <p className="cta__body">{body}</p>
      <a className="cta__button" href="#start">
        {buttonLabel}
      </a>
    </section>
  )
}
