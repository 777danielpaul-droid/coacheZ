import { useEffect, useState } from 'react'

function Imprint() {
  return (
    <section className="legal">
      <h2 className="legal__heading">Impressum</h2>
      <div className="legal__body">
        <p>
          <strong>Angaben gemäß § 5 TMG:</strong>
        </p>
        <p>
          Daniel Paul<br />
          Imhoffstuecken 18<br />
          21423 Winsen
        </p>
        <p>
          <strong>E-Mail:</strong>{' '}
          <a href="mailto:777danielpaul@gmail.com">777danielpaul@gmail.com</a>
        </p>

        <h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
        <p>
          Daniel Paul<br />
          Imhoffstuecken 18<br />
          21423 Winsen
        </p>

        <h3>EU-Streitschlichtung</h3>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
          <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noreferrer">
            https://ec.europa.eu/consumers/odr/
          </a>
          . Unsere E-Mail-Adresse finden Sie oben im Impressum.
        </p>

        <h3>Haftung für Inhalte</h3>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
          allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch
          nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach
          Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur
          Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben
          hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis
          einer konkreten Rechtsverletzung möglich.
        </p>

        <h3>Haftung für Links</h3>
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss
          haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die
          Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten
          verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
          Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
          erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
          Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen
          werden wir derartige Links umgehend entfernen.
        </p>

        <h3>Urheberrecht</h3>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
          deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
          Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
          jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den
          private, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom
          Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden
          Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
          Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei
          Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
        </p>
      </div>
    </section>
  )
}

function Privacy() {
  return (
    <section className="legal">
      <h2 className="legal__heading">Datenschutzerklärung</h2>
      <div className="legal__body">
        <h3>1. Datenschutz auf einen Blick</h3>
        <p>
          <strong>Allgemeine Hinweise</strong>
        </p>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen
          Daten passiert, wenn Sie dieses besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
          persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz
          entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
        </p>

        <h3>2. Datenerfassung auf dieser Website</h3>
        <p>
          <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong>
        </p>
        <p>
          Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen
          Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
        </p>

        <p>
          <strong>Wie erfassen wir Ihre Daten?</strong>
        </p>
        <p>
          Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es
          sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden
          automatisch nach der Websitebesuch durch unsere IT-Systeme erfasst. Das sind vor allem
          technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
          Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.
        </p>

        <p>
          <strong>Wofür nutzen wir Ihre Daten?</strong>
        </p>
        <p>
          Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu
          gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
        </p>

        <h3>3. Allgemeine Hinweise und Pflichtinformationen</h3>
        <p>
          <strong>Datenschutz</strong>
        </p>
        <p>
          Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir
          behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen
          Datenschutzvorschriften sowie dieser Datenschutzerklärung. Wenn Sie diese Website benutzen,
          werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit
          denen Sie persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung
          erläutert, welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu
          welchem Zweck das geschieht.
        </p>

        <h3>4. Hosting</h3>
        <p>
          Wir hosten die Inhalte unserer Website bei folgenden Anbietern:
        </p>
        <p>
          <strong>Render</strong>
        </p>
        <p>
          Anbieter ist die Render Services, Inc., 525 Brannan Street, Suite 300, San Francisco, CA
          94107, USA. Details entnehmen Sie der{' '}
          <a href="https://render.com/privacy" target="_blank" rel="noreferrer">
            Datenschutzerklärung von Render
          </a>
          .
        </p>
        <p>
          <strong>GitHub Pages</strong>
        </p>
        <p>
          Anbieter ist die GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA.
          Details entnehmen Sie der{' '}
          <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noreferrer">
            Datenschutzerklärung von GitHub
          </a>
          .
        </p>

        <h3>5. Externe Inhalte</h3>
        <p>
          Diese Website kann externe Inhalte (z. B. KI-Dienste, Bilder, Videos) einbinden. Hierfür
          kann es notwendig sein, dass die Anbieter dieser Inhalte Ihre IP-Adresse verarbeiten. Da wir
          nicht beeinflussen können, welche Daten von externen Anbietern erheben werden, empfehlen wir,
          die jeweiligen Datenschutzerklärungen zu beachten.
        </p>

        <h3>6. Ihre Rechte</h3>
        <p>
          Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck
          Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die
          Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur
          Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft
          widerrufen. Außerdem haben Sie das Recht, unter bestimmten Bedingungen die Einschränkung
          der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein
          Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
        </p>

        <h3>7. Analyse-Tools und Werbung</h3>
        <p>
          Wir nutzen auf dieser Website keine Analyse-Tools oder Werbung.
        </p>

        <h3>8. Plugins und Tools</h3>
        <p>
          Diese Website nutzt keine Plugins oder Tools, die personenbezogene Daten erheben.
        </p>
      </div>
    </section>
  )
}

export function LegalPages() {
  const [page, setPage] = useState<'imprint' | 'privacy' | null>(null)

  // Body-Scroll-Lock: Wenn das Overlay offen ist, wird der Body-Overflow
  // unterdrückt, damit die Seite dahinter nicht mitscrollt – sonst gibt
  // es zwei Scrollbars.
  useEffect(() => {
    const { style } = document.body
    const previous = style.overflow
    style.overflow = page ? 'hidden' : previous
    return () => {
      style.overflow = previous
    }
  }, [page])

  const open = (next: 'imprint' | 'privacy') => setPage(next)
  const close = () => setPage(null)

  return (
    <footer className="legal-nav">
      <button type="button" className="legal-nav__link" onClick={() => open('imprint')}>
        Impressum
      </button>
      <button type="button" className="legal-nav__link" onClick={() => open('privacy')}>
        Datenschutz
      </button>

      {page && (
        <div className="legal-overlay" role="dialog" aria-modal="true">
          <button type="button" className="legal-overlay__close" onClick={close} aria-label="Schließen">
            ×
          </button>
          {page === 'imprint' ? <Imprint /> : <Privacy />}
        </div>
      )}
    </footer>
  )
}
