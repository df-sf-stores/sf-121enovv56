'use client'

import { contentAddresses, routeAddresses, useLocation } from '@dripfunnel/storefront-core'
import { createElement, lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import routes from '../../../routes.json'

// next dev only (pageExtensions in next.config.ts): every address other than `/` gets the theme page routes.json names
// for it, matched as a live site matches it (core's routeAddresses and contentAddresses), so each page opens on its own.

type Address = { page: string } | { prefix: string }

const slash = (path: string) => (path.endsWith('/') ? path : `${path}/`)

const core = routes.routes as Record<string, string | undefined>
const addresses = { ...routeAddresses, ...contentAddresses } as Record<string, Address>

const pageFor = (path: string): string | undefined => {
  const custom = Object.entries(routes.custom ?? {}).find(([at]) => slash(at) === path)
  if (custom) return custom[1]
  const known = Object.entries(addresses).filter(([route]) => core[route])
  const page = known.find(([, a]) => 'page' in a && a.page === path)
  if (page) return core[page[0]]
  // The longest prefix wins, and a prefix needs something after it (`/blog/` is the blog, `/blog/x/` a post).
  const prefixed = known
    .flatMap(([route, a]) => ('prefix' in a && path.startsWith(a.prefix) && path.length > a.prefix.length ? [[route, a.prefix] as const] : []))
    .sort((a, b) => b[1].length - a[1].length)[0]
  if (prefixed) return core[prefixed[0]]
  // A content page lives at the one segment its slug names.
  if (/^\/[^/]+\/$/.test(path) && core['contentPage']) return core['contentPage']
  return core['notFound']
}

const loaded = new Map<string, LazyExoticComponent<ComponentType>>()

const themePage = (name: string) => {
  let page = loaded.get(name)
  if (!page) {
    const exported = name.slice(name.lastIndexOf('/') + 1)
    page = lazy(() => import(`../../theme/pages/${name}.tsx`).then((m: Record<string, ComponentType>) => ({ default: m[exported]! })))
    loaded.set(name, page)
  }
  return page
}

export default function DevPage() {
  const { path } = useLocation()
  const name = pageFor(slash(path))
  if (!name) return null
  return createElement(Suspense, { fallback: null }, createElement(themePage(name)))
}
