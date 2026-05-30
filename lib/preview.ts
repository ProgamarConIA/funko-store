import { cache } from 'react'
import { cookies } from 'next/headers'

export const PREVIEW_COOKIE = 'funko_preview'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

/**
 * Returns true only when:
 *   1. The funko_preview cookie is set to '1'
 *   2. The requesting user is the ADMIN_EMAIL
 *
 * Wrapped in React.cache so it executes at most once per request,
 * even if called from many Server Components in the same render tree.
 * Regular users never have the cookie → returns false immediately (no DB hit).
 */
export const isAdminPreviewMode = cache(async (): Promise<boolean> => {
  const cookieStore = await cookies()
  if (cookieStore.get(PREVIEW_COOKIE)?.value !== '1') return false

  // Lazy import to avoid pulling server-only code at module level
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return !!(user && ADMIN_EMAIL && user.email === ADMIN_EMAIL)
})

// ─────────────────────────────────────────────────────────────────────────────
// Experimental feature registry
//
// Add an entry here for every feature you're developing behind the flag.
// Wrap the component with <PreviewFeature> in the JSX.
// Remove the entry (and the wrapper) when the feature graduates to stable.
// ─────────────────────────────────────────────────────────────────────────────

export interface ExperimentalFeature {
  key:         string
  name:        string
  description: string
  /** 'wip' = still being built, 'ready' = finished but not yet released */
  status:      'wip' | 'ready'
}

export const EXPERIMENTAL_FEATURES: ExperimentalFeature[] = [
  // Example — replace with real features as you build them:
  // {
  //   key:         'new_product_card',
  //   name:        'Nuevo diseño de tarjeta de producto',
  //   description: 'Rediseño con efectos hover mejorados y badges dinámicos.',
  //   status:      'ready',
  // },
]
