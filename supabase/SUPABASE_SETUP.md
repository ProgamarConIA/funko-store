# Supabase — Checklist de configuración para producción

> **Síntoma más común:** emails de recuperación / confirmación no llegan.
> **Causa raíz más común:** SMTP compartido de Supabase free tier tiene deliverability
> pésima en Gmail. Esta guía resuelve todos los casos conocidos.

---

## 1. URL Configuration (OBLIGATORIO)

**Dashboard → Authentication → URL Configuration**

### Site URL
Debe apuntar a la URL de producción, **nunca a localhost**:

```
https://tu-dominio.vercel.app
```

> ⚠️ Si queda en `http://localhost:3000`, todos los links de recovery email
> redirigen a localhost — el usuario no puede completar el reset.

### Redirect URLs (Allowed URLs)
Agregar todas estas URLs (con tu dominio real):

```
https://tu-dominio.vercel.app/auth/callback
https://tu-dominio.vercel.app/auth/callback?next=*
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback?next=*
```

> El patrón `?next=*` cubre el query param que usamos para redirigir después
> del callback (ej: `?next=/auth/reset-password`).

---

## 2. SMTP Personalizado (MUY RECOMENDADO para Gmail)

El SMTP compartido de Supabase tiene deliverability pésima:
- Gmail filtra a spam o promotions sistemáticamente
- Rate limit: ~2 emails/hora por proyecto (en free tier)
- No tiene dominio propio → baja reputación

### Opción recomendada: Resend.com (gratuito hasta 3.000 emails/mes)

1. Crear cuenta en [resend.com](https://resend.com)
2. Crear un API Key en Resend
3. En Supabase Dashboard → **Project Settings → Auth → SMTP Settings**:

```
Enable Custom SMTP: ✅
Host:               smtp.resend.com
Port:               465
Username:           resend
Password:           re_xxxxx  ← tu API key de Resend
Sender email:       VER TABLA ABAJO  ← ⚠️ crítico
Sender name:        FunkoStore
```

#### ⚠️ CRÍTICO — Dirección de envío (Sender email) en Resend

Resend NO permite usar cualquier dirección `@resend.dev` como remitente.
Solo funcionan estas dos opciones:

| Situación | Sender email | Notas |
|-----------|-------------|-------|
| **Testing / desarrollo** | `onboarding@resend.dev` | Pre-autorizado por Resend. Envía a cualquier email. |
| **Producción** | `noreply@tu-dominio.com` | Requiere verificar tu dominio en Resend primero. |

> ❌ **`noreply@resend.dev` NO funciona** — Resend rechaza el envío y
> Supabase devuelve `"Error sending confirmation email"`, lo cual bloquea
> el registro de nuevos usuarios.

**Para producción:** Agregar y verificar tu dominio en Resend Dashboard → Domains,
luego cambiar el `Sender email` a `noreply@tu-dominio.com`.

### Otras opciones válidas

| Servicio | Free tier | Configuración |
|----------|-----------|---------------|
| Resend.com | 3.000/mes | `smtp.resend.com:465` |
| SendGrid | 100/día | `smtp.sendgrid.net:587` |
| Mailgun | 1.000/mes (trial) | `smtp.mailgun.org:587` |
| Brevo (ex-Sendinblue) | 300/día | `smtp-relay.brevo.com:587` |

> **Sin SMTP propio:** los emails de recovery NO llegan a Gmail de forma confiable.

---

## 3. Email Templates (OBLIGATORIO para emails en español)

**Dashboard → Authentication → Email Templates**

Aplicar los templates de `/supabase/email-templates/`:

| Template en Supabase | Archivo local | Estado |
|----------------------|---------------|--------|
| **Confirm signup** | `confirm-signup.html` | ✅ Aplicado |
| **Reset Password** | `reset-password.html` | ⚠️ Pendiente aplicar |
| Magic Link | (no usado) | — |
| Change Email Address | (no usado) | — |

### Cómo aplicar cada template:
1. Abrir el template en Supabase Dashboard
2. Reemplazar TODO el contenido del campo HTML con el contenido del archivo
3. Cambiar el **Subject** al recomendado en el comentario del archivo
4. Guardar

#### Asuntos recomendados:
- **Confirm signup:** `Verificá tu cuenta — FunkoStore`
- **Reset Password:** `Restablecé tu contraseña — FunkoStore`

---

## 4. Variables de entorno (`.env.local`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://qqpkswgmywaghftklkvw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# URL de la app (actualizar en producción)
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app   # ← cambiar de localhost
```

> En Vercel, agregar estas variables en:
> **Project → Settings → Environment Variables**
> Marcar `NEXT_PUBLIC_SITE_URL` con el dominio de producción.

---

## 5. Checklist de diagnóstico rápido

Si los emails no llegan:

- [ ] Supabase Dashboard → Authentication → URL Configuration → **Site URL** apunta a producción
- [ ] El dominio de la URL de producción está en **Redirect URLs** (con y sin `?next=*`)
- [ ] Configuraste un **SMTP personalizado** (Resend / SendGrid / Mailgun)
- [ ] El template de **Reset Password** fue reemplazado con el HTML local
- [ ] Buscaste en **Spam** y en la pestaña **Promociones** de Gmail
- [ ] Revisaste los **Auth logs** en Supabase Dashboard → Authentication → Logs
  - Un `SIGNED_IN` o error de "Email rate limit" confirma que Supabase recibió el request
  - Ausencia de log = el request no llegó a Supabase (problema del frontend)
- [ ] La cuenta de email existe y está confirmada en Supabase

---

## 6. Auth Logs — cómo verificar qué está pasando

**Dashboard → Authentication → Logs**

Buscar el email afectado. Eventos relevantes:

| Evento | Significado |
|--------|-------------|
| `PASSWORD_RECOVERY` | ✅ Supabase procesó el request; el email se intentó enviar |
| (sin evento) | ❌ El request no llegó a Supabase (bug en el frontend o CORS) |
| `over_email_send_rate_limit` | ⏱ Límite de emails alcanzado; esperar |

Si `PASSWORD_RECOVERY` aparece en logs pero el email no llega:
→ El problema es de deliverability (SMTP) o el link redirige a localhost (SITE_URL mal configurado).

---

## 7. Variables de Supabase para los templates de email

| Variable | Valor |
|----------|-------|
| `{{ .Token }}` | Código OTP de 6/8 dígitos (solo en signup) |
| `{{ .ConfirmationURL }}` | URL completa con el code de PKCE |
| `{{ .SiteURL }}` | Valor configurado en Site URL |
| `{{ .Email }}` | Email del usuario |
