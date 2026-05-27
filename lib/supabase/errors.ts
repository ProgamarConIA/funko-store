/**
 * Traduce los mensajes de error de Supabase Auth a español claro.
 * Supabase devuelve mensajes en inglés con códigos específicos —
 * este helper los convierte en mensajes amigables para el usuario.
 *
 * Orden de chequeo: de más específico a más genérico.
 * Los patrones SMTP (custom provider) van antes del fallback genérico.
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

  // ── Contraseña igual a la anterior ───────────────────────────
  // Supabase devuelve esto cuando updateUser({ password }) recibe la misma contraseña.
  if (
    m.includes('different from the old password') ||
    m.includes('same as the old password') ||
    m.includes('new password should be different')
  ) {
    return 'La nueva contraseña debe ser diferente a la actual.'
  }

  // ── Contraseña débil ─────────────────────────────────────────
  if (
    m.includes('weak_password') ||
    m.includes('password should be') ||
    m.includes('password is too short') ||
    m.includes('password should contain')
  ) {
    return 'La contraseña es demasiado débil. Usá al menos 6 caracteres con letras y números.'
  }

  // ── Errores de entrega de email (SMTP / proveedor externo) ────
  // Se detectan cuando Supabase/GoTrue propaga errores del SMTP personalizado.
  //
  // ⚠️ IMPORTANTE — "error sending" es el mensaje INTERNO de GoTrue cuando
  // la entrega falla por cualquier motivo (config incorrecta, API key inválida,
  // dominio no verificado en Resend, etc.). NO indica un problema con el email
  // del usuario — el problema es siempre del lado del servidor.
  //
  // El mensaje NO debe culpar al usuario ("verificá tu dirección"):
  // la causa más común es configuración SMTP incorrecta (ej: usar
  // noreply@resend.dev en lugar de onboarding@resend.dev o dominio propio).
  if (
    m.includes('error sending') ||
    m.includes('failed to send') ||
    m.includes('unable to send') ||
    m.includes('email delivery') ||
    (m.includes('smtp') && (
      m.includes('auth') ||
      m.includes('connect') ||
      m.includes('refused') ||
      m.includes('timeout') ||
      m.includes('unauthorized') ||
      m.includes('forbidden')
    ))
  ) {
    return 'No se pudo enviar el email de verificación. Por favor intentá de nuevo en unos minutos.'
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
 *
 * Cubre los formatos conocidos de Supabase/GoTrue.
 * NOTA: "too many requests" sin calificador también se incluye porque
 * Supabase usa ese texto para su propio rate-limiting de requests.
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
