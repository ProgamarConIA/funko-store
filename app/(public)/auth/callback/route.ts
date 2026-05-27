import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Ruta de callback de autenticación — Supabase redirige aquí después de:
 *  - Confirmar email (registro)
 *  - Restablecer contraseña
 *  - Login con proveedor OAuth (Google, GitHub, etc.)
 *
 * Flujo:
 *  1. Supabase envía el email con un link que incluye ?code=...
 *  2. El usuario hace click → aterriza aquí
 *  3. Intercambiamos el `code` por una sesión real
 *  4. Redirigimos al usuario a la página destino
 *
 * Sin esta ruta, los links de confirmación de email no funcionan.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // `next` permite redirigir a una página específica después del login
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Sesión creada exitosamente → redirigir al destino
      const redirectUrl = new URL(next, origin)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Fallo: redirigir al login con mensaje de error
  const errorUrl = new URL('/auth/login', origin)
  errorUrl.searchParams.set('error', 'El link de confirmación expiró o ya fue usado. Intentá registrarte de nuevo.')
  return NextResponse.redirect(errorUrl)
}
