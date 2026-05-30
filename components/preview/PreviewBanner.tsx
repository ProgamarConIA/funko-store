import { isAdminPreviewMode } from '@/lib/preview'
import { setPreviewMode } from '@/app/admin/preview/actions'
import { FlaskConical } from 'lucide-react'

/**
 * Server Component — renders a sticky amber banner when preview mode is active.
 * Returns null for regular users (no DB hit since the cookie check short-circuits).
 * Safe to include in any layout.
 */
export async function PreviewBanner() {
  const isPreview = await isAdminPreviewMode()
  if (!isPreview) return null

  return (
    <div className="w-full bg-amber-400 text-amber-950 px-4 py-1.5 flex items-center justify-center gap-2 text-xs font-semibold sticky top-16 z-30">
      <FlaskConical className="w-3.5 h-3.5 flex-shrink-0" />
      <span>Modo Preview activo — solo visible para administradores</span>

      <form action={setPreviewMode.bind(null, false)} className="ml-3">
        <button
          type="submit"
          className="px-2.5 py-0.5 rounded-lg bg-amber-950/15 hover:bg-amber-950/30 font-bold transition-colors"
        >
          Desactivar
        </button>
      </form>
    </div>
  )
}
