'use client'

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import styles from '../../styles/menu.module.css'

/** The phone's magnifier: opens the search as a full-screen panel over the page. */
export const SearchToggle = ({ label, close, children }: { label: string; close: string; children: ReactNode }) => {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const shut = () => {
    setOpen(false)
    toggle.current?.focus()
  }
  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && open) shut()
  }
  return (
    <div className={styles.searchToggle} onKeyDown={onKey}>
      <button ref={toggle} type="button" className={styles.toggle} aria-expanded={open} aria-controls="site-search" onClick={() => setOpen(true)}>
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4.5 4.5" />
        </svg>
        <span className={styles.label}>{label}</span>
      </button>
      {open ? (
        <div id="site-search" className={styles.searchPanel} role="dialog" aria-label={label}>
          <div className={styles.searchRow}>
            <div className={styles.searchField}>{children}</div>
            <button type="button" className={styles.close} onClick={shut}>
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
              <span className={styles.label}>{close}</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
