# 🎮 FunkoStore

Tienda e-commerce de Funko Pops con Next.js 16, TailwindCSS, Supabase y Vercel.

---

## 🚀 Características

- 🛍️ **Catálogo** con búsqueda y filtros (franquicia, categoría, precio)
- 📦 **Página de detalle** de producto con productos relacionados
- 🛒 **Carrito** con drawer lateral (Zustand + persistencia local)
- 💳 **Checkout simulado** con dirección de envío
- 🔐 **Auth completo** — registro, login, sesión con Supabase
- 👤 **Perfil** con historial de pedidos
- 👑 **Admin Panel** — gestión de productos, pedidos y usuarios
- 📱 **Mobile-first** — diseño responsive
- 🌑 **Tema oscuro neón** — estilo geek moderno

---

## ⚙️ Instalación local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
copy .env.local.example .env.local
```

Editar `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Correr en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a **SQL Editor** y ejecutar `supabase/schema.sql`
3. Ejecutar `supabase/seed.sql` para cargar 35 Funko Pops de ejemplo
4. En `Authentication → URL Configuration` agregar tu dominio

### Crear admin

Después de registrarte:

```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'tu@email.com';
```

---

## 📤 Deploy en Vercel

1. Subir a GitHub: `git push origin main`
2. Importar en [vercel.com](https://vercel.com)
3. Agregar las 3 variables de entorno de Supabase
4. Click Deploy 🚀

---

## 🗺️ Rutas

| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/` | Catálogo | Público |
| `/product/[id]` | Detalle | Público |
| `/cart` | Carrito | Público |
| `/checkout` | Pago | Login |
| `/auth/login` | Login | Público |
| `/auth/register` | Registro | Público |
| `/profile` | Mi perfil | Login |
| `/profile/orders` | Mis pedidos | Login |
| `/admin` | Dashboard | Admin |
| `/admin/products` | Productos | Admin |
| `/admin/orders` | Pedidos | Admin |

---

## 🛠️ Comandos

```bash
npm run dev      # Desarrollo
npm run build    # Build
npm run start    # Producción
```

---

Hecho con 💜 para coleccionistas de Funko Pops

---

## Getting Started (original)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
