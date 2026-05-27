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

## 2. Configuración SMTP — Estado actual y soluciones

### ⚠️ Por qué el SMTP de Resend sin dominio verificado no funciona

El SMTP relay de Resend tiene una limitación crítica:

**Sin un dominio verificado, solo puede entregar emails al dueño de la cuenta de Resend.**
Cualquier otro destinatario es rechazado → Supabase devuelve `"Error sending confirmation email"` → el frontend muestra error.

Direcciones de remitente que NO funcionan para SMTP relay arbitrario:
- `noreply@resend.dev` → rechazada (no es tuya)
- `onboarding@resend.dev` → solo válida para la API HTTP de Resend, **no para SMTP relay**

---

### Solución inmediata — Deshabilitar SMTP de Resend

**Supabase Dashboard → Project Settings → Auth → SMTP Settings → desactivar "Enable Custom SMTP"**

Eso es todo. El registro funciona para cualquier Gmail de inmediato.

- Límite: ~3 emails/hora por proyecto (free tier)
- Los emails pueden llegar a Spam/Promociones en Gmail
- Suficiente para desarrollo y testing

---

### Solución para producción — Verificar dominio en Resend

Cuando tengas un dominio propio (ej: `tufunkostore.com`):

1. **Resend Dashboard → Domains → Add Domain** → ingresar el dominio
2. Resend te muestra registros DNS (DKIM, SPF, DMARC) — agregarlos en tu proveedor de dominio
3. Esperar verificación (5-15 minutos)
4. **Supabase Dashboard → Project Settings → Auth → SMTP Settings:**
```
Enable Custom SMTP: ✅
Host:               smtp.resend.com
Port:               465
Username:           resend
Password:           re_xxxxx  ← tu API key de Resend
Sender email:       noreply@tu-dominio.com
Sender name:        FunkoStore
```

Dominios baratos: Cloudflare Registrar (~$8/año), Namecheap (~$10/año).

---

### Alternativa sin dominio — Brevo (ex-Sendinblue)

Brevo no requiere dominio verificado. 300 emails/día gratis:

```
Enable Custom SMTP: ✅
Host:               smtp-relay.brevo.com
Port:               587
Username:           tu-cuenta@gmail.com  (email de registro en Brevo)
Password:           API key de Brevo (Brevo Dashboard → SMTP & API → API Keys)
Sender email:       noreply@tu-dominio.com  (o cualquier email verificado en Brevo)
Sender name:        FunkoStore
```

1. Crear cuenta en brevo.com
2. Dashboard → SMTP & API → SMTP → obtener credenciales
3. Configurar en Supabase como arriba

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
