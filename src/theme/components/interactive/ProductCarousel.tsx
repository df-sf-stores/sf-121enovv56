'use client'

import { useRef, type ReactNode } from 'react'
import { useReducedMotion } from '@dripfunnel/storefront-core/theme'
import styles from '../../styles/carousel.module.css'

/**
 * A row of cards that snaps one card at a time: swiped on touch, scrolled a page at a time by its arrows.
 * Two cards show on phones, three on laptops, four on wide screens.
 */
export const ProductCarousel = ({ label, previous, next, children }: { label: string; previous: string; next: string; children: ReactNode }) => {
  const track = useRef<HTMLUListElement>(null)
  const reduced = useReducedMotion()
  const page = (direction: number) => {
    const el = track.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth, behavior: reduced ? 'auto' : 'smooth' })
  }
  return (
    <div className={styles.carousel}>
      <ul ref={track} className={styles.track} aria-label={label} tabIndex={0}>
        {children}
      </ul>
      <div className={styles.controls}>
        <button type="button" className={styles.arrow} aria-label={previous} onClick={() => page(-1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button type="button" className={styles.arrow} aria-label={next} onClick={() => page(1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export const CarouselItem = ({ children }: { children: ReactNode }) => <li className={styles.item}>{children}</li>
