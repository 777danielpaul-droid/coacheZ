import { useState } from 'react'

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

        <h3>Hinweis</h3>
        <p>
          Diese Webseite ist ein privates, nicht-kommerzielles
          Fanprojekt und dient ausschließlich Übungszwecken. Sie steht in keiner Verbindung
          zu Toei Animation, Shueisha, Bird Studio oder anderen Rechteinhabern der
          <em> Dragon Ball</em>-Franchise.
        </p>

        <h3>Generierte Inhalte</h3>
        <p>
          Alle auf dieser Seite verwendeten Bilder wurden künstlich generiert (KI-Generation
          mittels Google Gemini). Es handelt sich um keine offiziellen Abbildungen,
          Screenshots oder urheberrechtlich geschützte Werke der Originalserie. Die
          Darstellung der Charaktere ist fiktiv und dient der künstlerischen Auseinandersetzung
          mit der Franchise.
        </p>

        <h3>Fiktive Werbung</h3>
        <p>
          Einige KI-Coaches machen im Chat Werbung für erfundene Produkte und Angebote (z. B.
          eine App, ein Immobilienportal, eine Spaß-Kryptowährung, Kristalle, Parfum oder Uhren).
          Diese Angebote sind reine Gags dieses Fan-Projekts: Sie existieren nicht, können nicht
          gekauft werden und sind weder Anlage-, Gesundheits- noch sonstige Empfehlungen. Die
          entsprechenden Chat-Nachrichten sind mit „Anzeige · fiktiv“ gekennzeichnet.
        </p>

        <h3>Keine kommerzielle Nutzung</h3>
        <p>
          Dieses Projekt wird nicht verkauft, beworben oder monetarisiert. Es werden keine
          Werbeeinnahmen generiert und keine Produkte oder Dienstleistungen angeboten.
          Sollten Rechteinhaber mit der Nutzung nicht einverstanden sein, kontaktieren Sie
          bitte den Betreiber – die Inhalte werden dann umgehend entfernt.
        </p>

        <h3>Kontakt</h3>
        <p>
          Für Fragen, Anmerkungen oder Löschwünsche:{' '}
          <a href="mailto:777danielpaul@gmail.com">777danielpaul@gmail.com</a>
        </p>
      </div>
    </section>
  )
}

function Privacy() {
  return (
    <section className="legal">
      <h2 className="legal__heading">Datenschutz</h2>
      <div className="legal__body">
        <p>
          Diese Webseite ist eine statische, clientseitige Anwendung. Es werden{' '}
          <strong>keine personenbezogenen Daten</strong> erhoben, gespeichert oder
          an Dritte weitergegeben.
        </p>

        <h3>Keine Cookies & Tracker</h3>
        <p>
          Es werden keine Cookies gesetzt, keine Analyse-Tools (z. B. Google Analytics)
          eingebunden und keine Social-Media-Plugins verwendet. Es findet kein Tracking
          Ihres Besuchs statt.
        </p>

        <h3>Lokale Einstellungen</h3>
        <p>
          Ihre gewählte Akzentfarbe, das Theme (Hell/Dunkel) und – falls Sie die KI-Funktion
          nutzen – Ihre KI-Einstellungen inklusive API-Key werden ausschließlich im lokalen
          Speicher Ihres Browsers (<code>localStorage</code>, bzw. <code>sessionStorage</code>,
          wenn „Merken“ deaktiviert ist) gespeichert. Der Key wird nicht an uns übertragen.
        </p>

        <h3>Optional: KI-Chat mit den Coaches</h3>
        <p>
          Ohne Ihr Zutun werden nach dem Laden der Seite keine weiteren Netzwerk-Anfragen
          gestartet; es gibt kein Backend und keine Datenbank. Nur wenn Sie selbst einen
          API-Key hinterlegen und mit einem Coach chatten, sendet Ihr Browser Ihre Nachrichten
          <strong> direkt an den von Ihnen gewählten KI-Anbieter</strong> (z. B. OpenAI,
          Anthropic, Google oder eine von Ihnen angegebene Adresse). Beim Öffnen der KI-Einstellungen wird außerdem die Liste
          der verfügbaren Modelle beim Anbieter abgefragt. Für diese Verarbeitung
          gelten die Datenschutzbestimmungen des jeweiligen Anbieters. Standardmäßig nutzt der Chat den Gratis-Dienst
          <strong> Puter</strong> (puter.com, „User-Pays“-Modell): Dafür wird beim Öffnen eines
          Chats ein Skript von js.puter.com geladen, Sie melden sich mit einem eigenen (kostenlosen)
          Puter-Konto an, und Ihre Nachrichten werden über Puter an das jeweilige KI-Modell
          weitergeleitet. Es gelten die Datenschutzbestimmungen von Puter; der Betreiber dieser
          Seite erhält weder Ihre Nachrichten noch Ihre Zugangsdaten. Bitte geben Sie im Chat
          keine sensiblen personenbezogenen Daten ein. Die Antworten stammen von einer KI und
          ersetzen keine Fach-, Finanz-, Rechts- oder medizinische Beratung.
        </p>

        <h3>Ihre Rechte</h3>
        <p>
          Da keine personenbezogenen Daten verarbeitet werden, sind Betroffenenrechte
          (Auskunft, Löschung, Widerspruch) nicht betroffen. Bei Fragen erreichen Sie uns
          unter:{' '}
          <a href="mailto:777danielpaul@gmail.com">777danielpaul@gmail.com</a>
        </p>
      </div>
    </section>
  )
}

export function LegalPages() {
  const [page, setPage] = useState<'imprint' | 'privacy' | null>(null)

  if (page === 'imprint') {
    return (
      <div className="legal-overlay">
        <button className="legal-overlay__close" onClick={() => setPage(null)}>
          ×
        </button>
        <Imprint />
      </div>
    )
  }

  if (page === 'privacy') {
    return (
      <div className="legal-overlay">
        <button className="legal-overlay__close" onClick={() => setPage(null)}>
          ×
        </button>
        <Privacy />
      </div>
    )
  }

  return (
    <div className="legal-nav">
      <button className="legal-nav__link" onClick={() => setPage('imprint')}>
        Impressum
      </button>
      <button className="legal-nav__link" onClick={() => setPage('privacy')}>
        Datenschutz
      </button>
    </div>
  )
}
