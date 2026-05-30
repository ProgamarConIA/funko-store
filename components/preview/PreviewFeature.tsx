import { isAdminPreviewMode } from '@/lib/preview'

interface Props {
  children:  React.ReactNode
  /** Rendered for non-preview users instead of nothing */
  fallback?: React.ReactNode
}

/**
 * Server Component gate — renders `children` only when the current user
 * has preview mode active, `fallback` otherwise (or nothing).
 *
 * Usage:
 *   <PreviewFeature>
 *     <NewExperimentalWidget />
 *   </PreviewFeature>
 *
 *   <PreviewFeature fallback={<StableWidget />}>
 *     <ExperimentalWidget />
 *   </PreviewFeature>
 */
export async function PreviewFeature({ children, fallback }: Props) {
  const isPreview = await isAdminPreviewMode()
  if (!isPreview) return fallback ? <>{fallback}</> : null
  return <>{children}</>
}
