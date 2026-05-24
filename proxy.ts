import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Email del único administrador autorizado
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // ── CAPA 1: Admin → debe estar logueado Y ser el admin autorizado
  if (path.startsWith('/admin')) {
    if (!user) {
      // No logueado → redirigir al login (sin revelar que /admin existe)
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    if (!ADMIN_EMAIL || user.email !== ADMIN_EMAIL) {
      // Logueado pero NO es admin → redirigir silenciosamente al inicio
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // ── APIs de admin → misma protección
  if (path.startsWith('/api/admin')) {
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
  }

  // ── Perfil y checkout → requieren autenticación
  if (path.startsWith('/profile') && !user) {
    return NextResponse.redirect(new URL(`/auth/login?redirect=${path}`, request.url))
  }
  if (path.startsWith('/checkout') && !user) {
    return NextResponse.redirect(new URL('/auth/login?redirect=/checkout', request.url))
  }

  // ── Si ya está logueado no necesita ver login/register
  if ((path === '/auth/login' || path === '/auth/register') && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/profile/:path*',
    '/checkout/:path*',
    '/auth/login',
    '/auth/register',
  ],
}
