'use client'

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '../cx'
import styles from '../../styles/menu.module.css'

/** The phone's menu: a hamburger that slides a sheet in from the left, with a scrim that closes it. */
export const Menu = ({ label, close, children }: { label: string; close: string; children: ReactNode }) => {
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
    <div className={styles.menu} onKeyDown={onKey}>
      <button ref={toggle} type="button" className={styles.toggle} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}>
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        <span className={styles.label}>{label}</span>
      </button>
      <div className={cx(styles.scrim, open && styles.scrimOpen)} aria-hidden="true" onClick={shut} />
      <div id="site-menu" className={cx(styles.sheet, open && styles.sheetOpen)} role="dialog" aria-label={label} hidden={!open}>
        <div className={styles.sheetHead}>
          <button type="button" className={styles.close} onClick={shut}>
            <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
            <span className={styles.label}>{close}</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
