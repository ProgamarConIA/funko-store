-- ═══════════════════════════════════════════════════════════════
--  FunkoStore — Schema de Supabase
--  Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ─── Extensiones ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. PROFILES ──────────────────────────────────────────────
-- Extiende la tabla auth.users de Supabase con datos extra
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT        NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger: crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── 2. PRODUCTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT        NOT NULL,
  slug        TEXT        UNIQUE NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image_url   TEXT,
  franchise   TEXT        NOT NULL,  -- Marvel, DC, Disney, Anime, etc.
  character   TEXT        NOT NULL,  -- Spider-Man, Batman, Goku, etc.
  category    TEXT        NOT NULL DEFAULT 'Standard'
                          CHECK (category IN ('Standard','Deluxe','Chase','Exclusive','Super Sized')),
  stock       INTEGER     NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_featured BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para búsqueda eficiente
CREATE INDEX IF NOT EXISTS idx_products_franchise  ON products(franchise);
CREATE INDEX IF NOT EXISTS idx_products_character  ON products(character);
CREATE INDEX IF NOT EXISTS idx_products_category   ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price      ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_featured   ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_name_gin
  ON products USING gin(to_tsvector('spanish', name));

-- ─── 3. ORDERS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status           TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  total            NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  shipping_address JSONB       NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status  ON orders(status);

-- ─── 4. ORDER_ITEMS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID        NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  UUID        NOT NULL REFERENCES public.products(id) ON DELETE SET NULL,
  quantity    INTEGER     NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id   ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- ─── 5. CART ──────────────────────────────────────────────────
-- Carrito persistente en BD (el carrito local usa Zustand)
CREATE TABLE IF NOT EXISTS public.cart_items (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  UUID        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity    INTEGER     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);

-- ─── 6. FUNCIÓN: decrementar stock ────────────────────────────
CREATE OR REPLACE FUNCTION public.decrement_stock(product_id UUID, qty INTEGER)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.products
  SET stock = GREATEST(0, stock - qty),
      updated_at = NOW()
  WHERE id = product_id;
END;
$$;

-- ─── 7. TRIGGERS: updated_at automático ───────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_products_updated_at ON products;
CREATE TRIGGER set_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_orders_updated_at ON orders;
CREATE TRIGGER set_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ═══════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════

-- ── profiles ──────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede ver su propio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "El admin puede ver todos los perfiles"
  ON public.profiles FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "El usuario puede actualizar su perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── products ──────────────────────────────────────────────────
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Cualquier visitante puede ver productos
CREATE POLICY "Lectura pública de productos"
  ON public.products FOR SELECT
  USING (true);

-- Solo admins pueden crear/editar/eliminar (vía service_role en API)
-- La API usa supabaseAdmin que bypasea RLS

-- ── orders ────────────────────────────────────────────────────
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "El usuario ve sus propios pedidos"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "El usuario puede crear pedidos"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ── order_items ───────────────────────────────────────────────
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "El usuario ve sus order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_items.order_id AND user_id = auth.uid()
    )
  );

-- ── cart_items ─────────────────────────────────────────────────
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "El usuario gestiona su carrito"
  ON public.cart_items FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
