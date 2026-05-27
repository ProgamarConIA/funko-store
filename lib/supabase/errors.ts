/**
 * Traduce los mensajes de error de Supabase Auth a español claro.
 * Supabase devuelve mensajes en inglés con códigos específicos —
 * este helper los convierte en mensajes amigables para el usuario.
 */
export function translateAuthError(message: string): string {
  const m = message.toLowerCase()

  // ── Credenciales incorrectas ─────────────────────────────────
  if (
    m.includes('invalid login credentials') ||
    m.includes('invalid_credentials') ||
    m.includes('invalid email or password')
  ) {
    return 'Email o contraseña incorrectos.'
  }

  // ── Email sin confirmar ──────────────────────────────────────
  if (m.includes('email not confirmed') || m.includes('email_not_confirmed')) {
    return 'Debés confirmar tu email antes de iniciar sesión. Revisá tu bandeja de entrada (y la carpeta de spam).'
  }

  // ── Rate limit de emails ─────────────────────────────────────
  // Cubre todos los formatos que Supabase puede devolver:
  //   "Email rate limit exceeded"
  //   "over_email_send_rate_limit"
  //   "For security purposes, you can only request this once every X seconds"
  if (
    m.includes('over_email_send_rate_limit') ||
    m.includes('email rate limit') ||
    m.includes('security purposes') ||
    m.includes('only request this') ||
    (m.includes('rate limit') && m.includes('email'))
  ) {
    return 'Demasiados intentos con este email. Esperá unos minutos e intentá de nuevo.'
  }

  // ── Rate limit general (demasiadas requests) ─────────────────
  if (
    m.includes('over_request_rate_limit') ||
    m.includes('request rate limit') ||
    m.includes('too many requests') ||
    m.includes('throttl')
  ) {
    return 'Demasiadas solicitudes. Esperá unos segundos e intentá de nuevo.'
  }

  // ── Usuario ya registrado ────────────────────────────────────
  if (
    m.includes('user already registered') ||
    m.includes('already registered') ||
    m.includes('user_already_exists') ||
    m.includes('already been registered')
  ) {
    return 'Ya existe una cuenta con este email. Intentá iniciar sesión.'
  }

  // ── Contraseña débil ─────────────────────────────────────────
  if (
    m.includes('weak_password') ||
    m.includes('password should be') ||
    m.includes('password is too short')
  ) {
    return 'La contraseña es demasiado débil. Usá al menos 6 caracteres.'
  }

  // ── Registro deshabilitado ───────────────────────────────────
  if (m.includes('signup_disabled') || m.includes('signups not allowed')) {
    return 'El registro está temporalmente deshabilitado.'
  }

  // ── Token / sesión expirada ──────────────────────────────────
  if (
    m.includes('token has expired') ||
    m.includes('token expired') ||
    m.includes('refresh_token_not_found')
  ) {
    return 'Tu sesión expiró. Por favor iniciá sesión de nuevo.'
  }

  // ── Email inválido ───────────────────────────────────────────
  if (m.includes('unable to validate email') || m.includes('invalid email')) {
    return 'El formato del email no es válido.'
  }

  // ── Fallback: mensaje genérico sin exponer detalles técnicos ──
  return 'Ocurrió un error. Intentá de nuevo en unos momentos.'
}

// ─── Helpers para detectar tipos de error ────────────────────────────────────

/**
 * Devuelve true si el mensaje es un rate-limit de cualquier tipo.
 */
export function isRateLimitError(message: string): boolean {
  const m = message.toLowerCase()
  return (
    m.includes('over_email_send_rate_limit') ||
    m.includes('over_request_rate_limit') ||
    m.includes('email rate limit') ||
    m.includes('request rate limit') ||
    m.includes('too many requests') ||
    m.includes('security purposes') ||
    m.includes('only request this') ||
    m.includes('rate limit') ||
    m.includes('throttl')
  )
}

/**
 * Versión de translateAuthError para el flujo de REGISTRO.
 *
 * ⚠️  IMPORTANTE — por qué NO sobrescribimos rate-limits aquí:
 *
 *   La validación de email (blocklist + MX) se ejecuta ANTES de llamar
 *   a signUp(). Si un email llegó a Supabase, ya pasó esos filtros y
 *   fue considerado válido. Un rate-limit en ese punto es un rate-limit
 *   legítimo (el usuario intentó varias veces, el plan tiene cuota baja,
 *   etc.) — NO es evidencia de que el email sea falso.
 *
 *   Mapear rate-limits a "usá un email real" causaba falsos positivos:
 *   Gmails reales veían ese mensaje si intentaban registrarse más de
 *   una vez. Esto fue el bug reportado.
 *
 *   La detección de emails falsos se hace en emailValidation.ts,
 *   no aquí.
 */
export function translateSignUpError(message: string): string {
  return translateAuthError(message)
}
