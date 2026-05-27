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

  // ── Rate limit de emails (demasiados registros / reenvíos) ───
  if (
    m.includes('over_email_send_rate_limit') ||
    m.includes('email rate limit') ||
    (m.includes('rate limit') && m.includes('email'))
  ) {
    return 'Demasiados intentos con este email. Esperá unos minutos e intentá de nuevo.'
  }

  // ── Rate limit general (demasiadas requests) ─────────────────
  if (
    m.includes('over_request_rate_limit') ||
    m.includes('request rate limit') ||
    m.includes('too many requests')
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

  // ── Fallback: devolver el mensaje original sin exponer técnico ──
  return 'Ocurrió un error. Intentá de nuevo en unos momentos.'
}

// ─── Helpers para detectar tipos de error ────────────────────────────────────

/**
 * Devuelve true si el mensaje es un rate-limit de cualquier tipo.
 * Se usa para sobrescribir el mensaje genérico en contextos específicos
 * (ej: registro) donde el rate-limit suele indicar un email inválido.
 */
export function isRateLimitError(message: string): boolean {
  const m = message.toLowerCase()
  return (
    m.includes('over_email_send_rate_limit') ||
    m.includes('over_request_rate_limit') ||
    m.includes('email rate limit') ||
    m.includes('request rate limit') ||
    m.includes('too many requests') ||
    m.includes('rate limit') ||
    m.includes('throttl')   // throttled / throttling
  )
}

/**
 * Versión especializada de translateAuthError para el flujo de REGISTRO.
 *
 * Diferencias respecto a translateAuthError:
 *   - Rate limits → mensaje orienta al usuario a usar un email real,
 *     porque en registro suelen ocurrir cuando se intenta varias veces
 *     con un email falso o inexistente (Supabase envía el email de
 *     confirmación y luego limita los envíos).
 *   - El resto de errores se delega a translateAuthError.
 */
export function translateSignUpError(message: string): string {
  if (isRateLimitError(message)) {
    return (
      'No pudimos completar el registro con este email. ' +
      'Asegurate de usar un correo real al que tengas acceso.'
    )
  }
  return translateAuthError(message)
}
