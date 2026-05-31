import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/wishlist/status
 *
 * Diagnostic endpoint — checks if the wishlist table exists and is accessible.
 * Visit this URL in the browser after deploying to confirm setup is complete.
 *
 * Returns:
 *   { ok: true,  message: "Wishlist table is ready" }          — table exists and works
 *   { ok: false, message: "...", hint: "Run supabase/wishlist.sql" }  — table missing
 *   { ok: false, message: "...", hint: "..." }                 — other error
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('wishlist')
      .select('id')
      .limit(1)

    if (error) {
      const isTableMissing =
        error.message.includes('relation') ||
        error.message.includes('does not exist') ||
        error.code === '42P01'

      if (isTableMissing) {
        console.error('[wishlist:status] TABLE MISSING — run supabase/wishlist.sql in Supabase SQL Editor')
        return NextResponse.json({
          ok:      false,
          message: 'La tabla wishlist no existe en la base de datos.',
          hint:    'Ejecutá el contenido de supabase/wishlist.sql en el SQL Editor de Supabase.',
          error:   error.message,
        }, { status: 503 })
      }

      console.error('[wishlist:status] unexpected error:', error.message)
      return NextResponse.json({
        ok:      false,
        message: 'Error al consultar la tabla wishlist.',
        hint:    'Revisá las variables de entorno de Supabase y las políticas RLS.',
        error:   error.message,
      }, { status: 500 })
    }

    return NextResponse.json({ ok: true, message: 'Wishlist table is ready ✓' })

  } catch (err) {
    return NextResponse.json({
      ok:      false,
      message: 'Error inesperado al verificar la tabla.',
      error:   err instanceof Error ? err.message : String(err),
    }, { status: 500 })
  }
}
