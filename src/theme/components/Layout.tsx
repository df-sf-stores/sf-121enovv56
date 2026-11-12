import type { ReactNode } from 'react'
import { ConsentBanner, ConsentSettingsButton, Link, navigate, PoweredBy, PreviewBanner, SearchField, StoreLogo, ThemeImage, useCart, useCollections, useMenu, useStorefront, useWishlist, type MenuItem } from '@dripfunnel/storefront-core/theme'
import { Menu } from './interactive/Menu'
import { NavItem } from './interactive/NavItem'
import { SearchToggle } from './interactive/SearchToggle'
import { SocialIcon } from './SocialIcon'
import styles from '../styles/layout.module.css'
import drawer from '../styles/menu.module.css'

// The theme rules allow no URL encoding, so the characters that would break the query are dropped instead.
const searchFor = (words: string) => navigate(`/search/?q=${words.replace(/[&+%#]/g, ' ').trim()}`)

const Search = () => {
  const { t } = useStorefront()
  return <SearchField label={t('common.tools.search')} placeholder={t('common.tools.searchPrompt')} button={t('common.tools.search')} value="" onSearch={searchFor} suggest={4} className={styles.search} />
}

/** The drawer's menu: each item with children opens in place, as an accordion. */
const DrawerItem = ({ item }: { item: MenuItem }) =>
  item.children.length ? (
    <details className={drawer.group}>
      <summary className={drawer.summary}>
        <span>{item.label}</span>
        <svg className={drawer.chevron} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <div className={drawer.children}>
        <Link href={item.href} className={drawer.childLink}>
          {item.label}
        </Link>
        {item.children.map((child) => (
          <Link key={child.id} href={child.href} className={drawer.childLink}>
            {child.label}
          </Link>
        ))}
      </div>
    </details>
  ) : (
    <Link href={item.href} className={drawer.link}>
      {item.label}
    </Link>
  )

/** Each network's brand tint for its square footer icon. */
const toneOf = (network: string) => {
  switch (network) {
    case 'facebook':
      return styles.facebook
    case 'instagram':
      return styles.instagram
    case 'youtube':
      return styles.youtube
    case 'linkedin':
      return styles.linkedin
    default:
      return styles.plain
  }
}

export const Layout = ({ children }: { children: ReactNode }) => {
  const { store, t, mode, poweredBy } = useStorefront()
  const menu = useMenu()
  // `first: 20` matches the home page's request, so both share one answer.
  const { collections: fetched, status } = useCollections({ first: 20 })
  const collections = status === 'ready' ? fetched : []
  // Without a menu set up in the admin, the store's collections stand in for it.
  const items: MenuItem[] = menu.items.length ? menu.items : collections.map((c) => ({ id: c.id, label: c.name, href: c.href, children: [] }))
  const { count } = useCart()
  const { count: saved } = useWishlist()
  const whatsapp = store.social.find((s) => s.network === 'whatsapp')
  // Square brand icons for the profiles; a Google Business Profile is a text link of its own beneath them.
  const icons = store.social.filter((s) => s.network !== 'whatsapp' && s.network !== 'google')
  const google = store.social.find((s) => s.network === 'google')
  const place = [store.address?.street, store.address?.city, store.address?.region, store.address?.postal, store.address?.country].filter(Boolean).join(', ')
  return (
    <div className={styles.shell}>
      {mode === 'live' ? null : <PreviewBanner t={t} className={styles.preview} />}
      <div className={styles.topBar}>
        <div className={`${styles.container} ${styles.topInner}`}>
          <p className={styles.topItem}>
            <svg className={styles.topIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />
            </svg>
            {t('common.topBar.secure')}
          </p>
          <p className={`${styles.topItem} ${styles.topWide}`}>
            <svg className={styles.topIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
            </svg>
            {t('common.topBar.curated')}
          </p>
          {store.contactPhone ? (
            <p className={styles.topCall}>
              <svg className={styles.topIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2" />
              </svg>
              {t('common.topBar.call')} <span className={styles.topPhone}>{store.contactPhone}</span>
            </p>
          ) : null}
        </div>
      </div>
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.bar}`}>
          <Menu label={t('common.nav.menu')} close={t('common.nav.closeMenu')}>
            <div className={drawer.search}>
              <Search />
            </div>
            <nav aria-label={t('common.nav.label')} className={drawer.nav}>
              <Link href="/collections/all/" className={drawer.shop}>
                {t('common.nav.shop')}
              </Link>
              {items.map((item) => (
                <DrawerItem key={item.id} item={item} />
              ))}
            </nav>
            <div className={drawer.extra}>
              <Link href="/account/" className={drawer.link}>
                {t('common.tools.account')}
              </Link>
              <Link href="/account/orders/" className={drawer.link}>
                {t('common.footer.orders')}
              </Link>
              <Link href="/contact/" className={drawer.link}>
                {t('common.footer.contactUs')}
              </Link>
            </div>
          </Menu>
          <Link href="/" className={styles.brand}>
            <StoreLogo className={styles.logo} />
          </Link>
          <div className={styles.desktopSearch}>
            <Search />
          </div>
          <div className={styles.tools}>
            <SearchToggle label={t('common.tools.search')} close={t('common.nav.closeMenu')}>
              <Search />
            </SearchToggle>
            <Link href="/account/wishlist/" className={styles.tool}>
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 20.3l-1.3-1.2C6 14.9 3 12.2 3 8.8 3 6.1 5.1 4 7.8 4c1.5 0 3 .7 4.2 1.9C13.2 4.7 14.7 4 16.2 4 18.9 4 21 6.1 21 8.8c0 3.4-3 6.1-7.7 10.3L12 20.3z" />
              </svg>
              <span className={styles.hidden}>{saved > 0 ? t('common.tools.wishlistCount', { count: saved }) : t('common.tools.wishlist')}</span>
              {saved > 0 ? (
                <span className={styles.count} aria-hidden="true">
                  {saved}
                </span>
              ) : null}
            </Link>
            <Link href="/cart/" className={styles.tool}>
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M3 4h2l2.4 11.2a1.5 1.5 0 001.5 1.2h8.6a1.5 1.5 0 001.5-1.1L21 8H6.2" />
                <circle cx="9.5" cy="20" r="1.2" />
                <circle cx="17" cy="20" r="1.2" />
              </svg>
              <span className={styles.hidden}>{count > 0 ? t('common.tools.cartCount', { count }) : t('common.tools.cart')}</span>
              {count > 0 ? (
                <span className={styles.count} aria-hidden="true">
                  {count}
                </span>
              ) : null}
            </Link>
            <Link href="/account/" className={styles.signIn}>
              <svg className={`${styles.icon} ${styles.signInIcon}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <circle cx="12" cy="8.5" r="3.8" />
                <path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" />
              </svg>
              <span className={styles.toolLabel}>{t('common.tools.signIn')}</span>
            </Link>
          </div>
        </div>
      </header>
      <div className={styles.navBar}>
        <div className={`${styles.container} ${styles.navInner}`}>
          <Link href="/collections/all/" className={styles.shopPill}>
            <svg className={styles.shopIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
            </svg>
            {t('common.nav.shop')}
          </Link>
          <nav className={styles.nav} aria-label={t('common.nav.categories')}>
            {items.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </nav>
        </div>
      </div>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.columns}`}>
          <div className={styles.about}>
            <Link href="/" className={styles.footerBrand}>
              <StoreLogo className={styles.footerLogo} />
            </Link>
            <p className={styles.note}>{store.tagline || store.description || t('common.footer.note')}</p>
            {icons.length ? (
              <ul className={styles.social} aria-label={t('common.footer.social')}>
                {icons.map((s) => (
                  <li key={s.network}>
                    <Link href={s.url} className={`${styles.socialLink} ${toneOf(s.network)}`}>
                      <SocialIcon network={s.network} className={styles.socialIcon} />
                      <span className={styles.hidden}>{s.network}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
            {google ? (
              <Link href={google.url} className={styles.profileLink}>
                <SocialIcon network={google.network} className={styles.profileIcon} />
                {t('common.footer.google')}
                <svg className={styles.externalIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" />
                </svg>
              </Link>
            ) : null}
          </div>
          {collections.length ? (
            <div className={styles.column}>
              <h2 className={styles.heading}>{t('common.footer.categories')}</h2>
              <ul className={styles.links}>
                {collections.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <Link href={c.href} className={styles.footerLink}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className={styles.column}>
            <h2 className={styles.heading}>{t('common.footer.customer')}</h2>
            <ul className={styles.links}>
              <li>
                <Link href="/collections/all/" className={styles.footerLink}>
                  {t('common.footer.shop')}
                </Link>
              </li>
              <li>
                <Link href="/account/orders/" className={styles.footerLink}>
                  {t('common.footer.orders')}
                </Link>
              </li>
              <li>
                <Link href="/account/" className={styles.footerLink}>
                  {t('common.tools.account')}
                </Link>
              </li>
              <li>
                <Link href="/contact/" className={styles.footerLink}>
                  {t('common.footer.contactUs')}
                </Link>
              </li>
            </ul>
          </div>
          {place || store.contactPhone || store.contactEmail || whatsapp ? (
            <div className={styles.column}>
              <h2 className={styles.heading}>{t('common.footer.contactHeading')}</h2>
              <ul className={styles.contacts}>
                {place ? (
                  <li className={styles.contact}>
                    <svg className={styles.contactIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{place}</span>
                  </li>
                ) : null}
                {store.contactPhone ? (
                  <li className={styles.contact}>
                    <svg className={styles.contactIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />
                    </svg>
                    <span>{store.contactPhone}</span>
                  </li>
                ) : null}
                {whatsapp ? (
                  <li className={styles.contact}>
                    <svg className={styles.contactIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M3 21l1.7-3.9a9 9 0 113.3 3z" />
                      <path d="M9 10a.5.5 0 001 0V9a.5.5 0 00-1 0v1a5 5 0 005 5h1a.5.5 0 000-1h-1a.5.5 0 000 1" />
                    </svg>
                    <Link href={whatsapp.url} className={styles.contactLink}>
                      {store.contactPhone || t('common.footer.whatsapp')}
                    </Link>
                  </li>
                ) : null}
                {store.contactEmail ? (
                  <li className={styles.contact}>
                    <svg className={styles.contactIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 7l-9 5.7a2 2 0 01-2 0L2 7" />
                    </svg>
                    <span>{store.contactEmail}</span>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>
        <div className={styles.base}>
          <div className={`${styles.container} ${styles.baseInner}`}>
            <p className={styles.copyright}>{t('common.footer.rights', { store: store.name })}</p>
            <ConsentSettingsButton t={t} className={styles.cookies} />
            <div className={styles.platform}>
              {poweredBy ? <PoweredBy brand={poweredBy} t={t} className={styles.powered} /> : <span>{t('common.footer.poweredBy')}</span>}
              <Link href={t('common.footer.poweredUrl')} className={styles.brandLink}>
                <ThemeImage src="dripfunnel-white-logo.png" alt={t('common.footer.poweredLogo')} ratio={2077 / 369} sizes="110px" className={styles.brandLogo} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
      {whatsapp ? (
        <Link href={whatsapp.url} className={styles.whatsapp}>
          <span className={styles.whatsappLabel} aria-hidden="true">
            {t('common.footer.chat')}
          </span>
          <svg className={styles.whatsappIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path className={styles.whatsappBubble} d="M12 3.2a8.8 8.8 0 00-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1012 3.2z" />
            <path className={styles.whatsappPhone} d="M16.4 15.4c-.2.5-1.1 1-1.6 1-.4.1-.9.1-1.5-.1a13 13 0 01-1.4-.5 10.6 10.6 0 01-4-3.6 4.6 4.6 0 01-1-2.4c0-1.2.6-1.7.8-2 .2-.2.5-.3.6-.3h.5c.1 0 .4 0 .6.4l.8 1.9c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.7-.1 1.3z" />
          </svg>
          <span className={styles.hidden}>{t('common.footer.whatsapp')}</span>
        </Link>
      ) : null}
      <ConsentBanner t={t} className={styles.consent} />
    </div>
  )
}
