import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware de Supabase — OBLIGATORIO para App Router.
 *
 * Responsabilidades:
 *  1. Leer la sesión del usuario desde las cookies de la request
 *  2. Refrescar el token si está por vencer (llama a getUser internamente)
 *  3. Escribir las cookies actualizadas en la response
 *
 * Sin este middleware el servidor siempre ve al usuario como
 * "no autenticado" aunque el cliente tenga una sesión activa.
 */
export async function middleware(request: NextRequest) {
  // Partimos de una response "pass-through" que propaga la request original
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // 1. Actualizar las cookies en la request (para el resto del pipeline)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // 2. Crear una nueva response con las cookies actualizadas
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: No poner lógica entre createServerClient y getUser().
  // getUser() valida el token con Supabase y refresca si es necesario.
  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas EXCEPTO:
     * - _next/static  (archivos estáticos de Next.js)
     * - _next/image   (optimización de imágenes)
     * - favicon.ico
     * - Archivos de imagen (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
