import { BurgerMenu } from './BurgerMenu'
import { ThemeToggle } from './ThemeToggle'
import { siteContent } from '../schemas/content'

export function Header() {
  const { title } = siteContent.hero

  return (
    <header className="header">
      <div className="header__brand">
        <ThemeToggle />
        <a className="dbz-title dbz-title--small" href="#start" data-text={title} aria-label={title}>
          <span className="dbz-title__text">{title}</span>
        </a>
      </div>
      <BurgerMenu />
    </header>
  )
}
