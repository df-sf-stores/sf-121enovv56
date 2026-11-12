import type { ReactNode } from 'react'
import { Image, Link, useCollections, useListing, useProducts, useStorefront, type CollectionCard, type ProductCard as Card } from '@dripfunnel/storefront-core/theme'
import { HeroCarousel } from '../components/interactive/HeroCarousel'
import { CarouselItem, ProductCarousel } from '../components/interactive/ProductCarousel'
import { Layout } from '../components/Layout'
import { ProductCard } from '../components/ProductCard'
import { cx } from '../components/cx'
import { slugOf } from '../components/slugOf'
import art from '../styles/art.module.css'
import shop from '../styles/shop.module.css'
import styles from '../styles/home.module.css'

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className ?? styles.arrowIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

/** Eyebrow, display heading and lead on the left; a "view all" link on the right. */
const SectionHead = ({ eyebrow, title, body, action }: { eyebrow: string; title: ReactNode; body?: string; action?: ReactNode }) => (
  <div className={styles.head}>
    <div className={styles.headText}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.heading}>{title}</h2>
      {body ? <p className={styles.lead}>{body}</p> : null}
    </div>
    {action}
  </div>
)

/** "View all" to a collection, or to every product when none is given. */
const ViewAll = ({ href, label }: { href?: string; label: string }) => (
  <Link href={href ?? '/collections/all/'} className={styles.viewAll}>
    {label}
    <ArrowIcon />
  </Link>
)

const Badge = ({ title, body, children }: { title: string; body: string; children: ReactNode }) => (
  <li className={styles.badge}>
    <span className={styles.badgeIcon} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        {children}
      </svg>
    </span>
    <span>
      <h3 className={styles.badgeTitle}>{title}</h3>
      <p className={styles.badgeBody}>{body}</p>
    </span>
    <span className={styles.badgeCircle} aria-hidden="true" />
  </li>
)

const Pledge = ({ index, title, body }: { index: number; title: string; body: string }) => (
  <li className={styles.promise}>
    <span className={styles.promiseNumber}>{String(index + 1).padStart(2, '0')}</span>
    <h3 className={styles.promiseTitle}>{title}</h3>
    <p className={styles.promiseBody}>{body}</p>
  </li>
)

/** A rail's grey cards while its products load, so nothing moves when they arrive. */
const RailPlaceholder = ({ label }: { label: string }) => (
  <ul className={styles.railHold} aria-busy="true" aria-label={label}>
    {[0, 1, 2, 3].map((i) => (
      <li key={i} className={styles.railHoldItem}>
        <div className={shop.skeletonPicture} />
        <div className={shop.skeletonLine} />
      </li>
    ))}
  </ul>
)

/** One featured row of products: heading, "view all" and a carousel. Hidden once it is known to be empty. */
const ProductRail = ({ eyebrow, title, href, pending, products, empty }: { eyebrow: string; title: string; href?: string; pending: boolean; products: Card[]; empty?: string }) => {
  const { t } = useStorefront()
  if (!pending && !products.length && !empty) return null
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHead eyebrow={eyebrow} title={title} action={products.length ? <ViewAll href={href} label={t('home.rails.viewAll')} /> : null} />
        {pending ? (
          <RailPlaceholder label={t('shop.listing.loading')} />
        ) : products.length ? (
          <ProductCarousel label={title} previous={t('home.rails.previous')} next={t('home.rails.next')}>
            {products.map((product) => (
              <CarouselItem key={product.id}>
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </ProductCarousel>
        ) : (
          <p className={styles.empty}>{empty}</p>
        )}
      </div>
    </section>
  )
}

const CollectionRail = ({ collection, eyebrow }: { collection: CollectionCard; eyebrow: string }) => {
  const { items, status } = useListing({ collection: slugOf(collection) })
  return <ProductRail eyebrow={eyebrow} title={collection.name} href={collection.href} pending={status === 'loading' || status === 'idle'} products={items.slice(0, 12)} />
}

/** "Shop by vehicle": the values of the catalogue's filter named in home.vehicles.facet, each a filtered listing. */
const Vehicles = () => {
  const { t } = useStorefront()
  const { facets } = useListing({ collection: 'all' })
  const wanted = t('home.vehicles.facet').toLowerCase()
  const facet = facets.find((f) => f.name.toLowerCase() === wanted)
  const values = facet ? facet.values.filter((v) => v.count > 0) : []
  if (!values.length) return null
  return (
    <section className={cx(styles.section, styles.tinted)}>
      <div className={styles.container}>
        <SectionHead eyebrow={t('home.vehicles.eyebrow')} title={t('home.vehicles.title')} body={t('home.vehicles.body')} action={<ViewAll label={t('home.vehicles.viewAll')} />} />
        <ul className={styles.brands}>
          {values.map((value) => (
            <li key={value.id}>
              <Link href={`/collections/all/?filter=${value.id}`} className={styles.brand}>
                <span className={styles.brandMark} aria-hidden="true">
                  {value.name.slice(0, 1)}
                </span>
                <span className={styles.brandName}>{value.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export const HomePage = () => {
  const { t } = useStorefront()
  const { collections: categories, status } = useCollections({ first: 20 })
  const newest = useProducts({ sort: 'newest', first: 12 })
  const pick = categories[1] ?? categories[0]
  return (
    <Layout>
      <h1 className={styles.hidden}>{t('home.title')}</h1>
      <HeroCarousel
        slides={[
          { key: 'multimedia', art: art.bannerMultimedia, href: '/collections/automotive-multimedia-systems/', eyebrow: t('home.hero.multimedia.eyebrow'), title: t('home.hero.multimedia.title'), subtitle: t('home.hero.multimedia.subtitle'), cta: t('home.hero.multimedia.cta') },
          { key: 'audi', art: art.bannerAudi, href: '/collections/audi/', eyebrow: t('home.hero.audi.eyebrow'), title: t('home.hero.audi.title'), subtitle: t('home.hero.audi.subtitle'), cta: t('home.hero.audi.cta') },
          { key: 'bmw', art: art.bannerBmw, href: '/collections/bmw/', eyebrow: t('home.hero.bmw.eyebrow'), title: t('home.hero.bmw.title'), subtitle: t('home.hero.bmw.subtitle'), cta: t('home.hero.bmw.cta') },
          { key: 'mercedes', art: art.bannerMercedes, href: '/collections/mercedes-benz/', eyebrow: t('home.hero.mercedes.eyebrow'), title: t('home.hero.mercedes.title'), subtitle: t('home.hero.mercedes.subtitle'), cta: t('home.hero.mercedes.cta') },
          { key: 'porsche', art: art.bannerPorsche, href: '/collections/porsche/', eyebrow: t('home.hero.porsche.eyebrow'), title: t('home.hero.porsche.title'), subtitle: t('home.hero.porsche.subtitle'), cta: t('home.hero.porsche.cta') },
        ]}
        labels={{ region: t('home.hero.region'), role: t('home.hero.role'), previous: t('home.hero.previous'), next: t('home.hero.next'), pause: t('home.hero.pause'), play: t('home.hero.play'), goTo: (n) => t('home.hero.goTo', { n }) }}
      />

      <section className={styles.trust}>
        <div className={styles.container}>
          <h2 className={styles.hidden}>{t('home.trust.title')}</h2>
          <ul className={styles.badges}>
            <Badge title={t('home.trust.genuine.title')} body={t('home.trust.genuine.body')}>
              <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4" />
            </Badge>
            <Badge title={t('home.trust.dispatch.title')} body={t('home.trust.dispatch.body')}>
              <path d="M3 6h11v10H3zM14 9h4l3 3v4h-7M7.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </Badge>
            <Badge title={t('home.trust.secure.title')} body={t('home.trust.secure.body')}>
              <path d="M6 10.5h12v10H6zM8.5 10.5V8a3.5 3.5 0 017 0v2.5M12 14.5v2" />
            </Badge>
            <Badge title={t('home.trust.support.title')} body={t('home.trust.support.body')}>
              <path d="M4 14v-2a8 8 0 0116 0v2M4 14a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zM20 14a2 2 0 01-2 2h-1v-5h1a2 2 0 012 2zM17 16v1a3 3 0 01-3 3h-2" />
            </Badge>
          </ul>
        </div>
      </section>

      {status === 'loading' || categories.length ? (
        <section className={styles.section}>
          <div className={styles.container}>
            <SectionHead eyebrow={t('home.categories.eyebrow')} title={t('home.categories.title')} body={t('home.categories.body')} action={<ViewAll label={t('home.categories.viewAll')} />} />
            <ul className={styles.tiles} aria-busy={status === 'loading'}>
              {status === 'loading'
                ? [0, 1, 2, 3].map((i) => (
                    <li key={i}>
                      <span className={cx(styles.tile, styles.tileHold)} />
                    </li>
                  ))
                : categories.slice(0, 8).map((c) => (
                    <li key={c.id}>
                      <Link href={c.href} className={styles.tile}>
                        <span className={styles.tilePicture}>{c.image ? <Image image={c.image} alt="" ratio={1} sizes="(min-width: 1024px) 25vw, 50vw" className={styles.tileImage} /> : null}</span>
                        <span className={styles.tileName}>
                          {c.name}
                          <ArrowIcon className={styles.tileArrow} />
                        </span>
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>
        </section>
      ) : null}

      <Vehicles />

      <ProductRail eyebrow={t('home.rails.newestEyebrow')} title={t('home.rails.newest')} pending={newest.status === 'loading' || newest.status === 'idle'} products={newest.products} empty={t('home.rails.empty')} />
      {categories[0] ? <CollectionRail collection={categories[0]} eyebrow={t('home.rails.featuredEyebrow')} /> : null}
      {categories[1] ? <CollectionRail collection={categories[1]} eyebrow={t('home.rails.trendingEyebrow')} /> : null}

      <section className={styles.why}>
        <span className={styles.orb} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.whyHead}>
            <p className={styles.eyebrow}>{t('home.why.eyebrow')}</p>
            <h2 className={styles.whyTitle}>
              {t('home.why.title')} <span className={styles.whyAccent}>{t('home.why.accent')}</span>
            </h2>
            <p className={styles.whyLead}>{t('home.why.body')}</p>
          </div>
          <ol className={styles.promises}>
            {[
              { title: t('home.why.quality.title'), body: t('home.why.quality.body') },
              { title: t('home.why.prices.title'), body: t('home.why.prices.body') },
              { title: t('home.why.payments.title'), body: t('home.why.payments.body') },
              { title: t('home.why.delivery.title'), body: t('home.why.delivery.body') },
            ].map((p, index) => (
              <Pledge key={p.title} index={index} title={p.title} body={p.body} />
            ))}
          </ol>
        </div>
      </section>

      {pick ? (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.pick}>
              <div className={cx(styles.pickPicture, art.art, art.slate)}>{pick.image ? <Image image={pick.image} alt="" ratio={4 / 3} sizes="(min-width: 768px) 50vw, 100vw" className={styles.cover} /> : null}</div>
              <div className={styles.pickText}>
                <p className={styles.eyebrow}>{t('home.pick.eyebrow')}</p>
                <h2 className={styles.pickTitle}>{pick.name}</h2>
                <p className={styles.pickBody}>{pick.description || t('home.pick.body')}</p>
                <Link href={pick.href} className={styles.button}>
                  {t('home.pick.cta')}
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.cta}>
            <span className={styles.ctaRing} aria-hidden="true" />
            <div className={styles.ctaText}>
              <h2 className={styles.ctaTitle}>{t('home.join.title')}</h2>
              <p className={styles.ctaBody}>{t('home.join.body')}</p>
            </div>
            <Link href="/register/" className={styles.ctaButton}>
              {t('home.join.cta')}
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
