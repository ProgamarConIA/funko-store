CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT        NOT NULL,
  full_name   TEXT,
  avatar_url  TEXT,
  role        TEXT        NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  slug        TEXT        UNIQUE NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image_url   TEXT,
  franchise   TEXT        NOT NULL,
  character   TEXT        NOT NULL,
  category    TEXT        NOT NULL DEFAULT 'Standard' CHECK (category IN ('Standard','Deluxe','Chase','Exclusive','Super Sized')),
  stock       INTEGER     NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_featured BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status           TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','shipped','delivered','cancelled')),
  total            NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  shipping_address JSONB       NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID        NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  UUID        REFERENCES public.products(id) ON DELETE SET NULL,
  quantity    INTEGER     NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  UUID        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity    INTEGER     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ver propio perfil"      ON public.profiles    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Actualizar perfil"      ON public.profiles    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Insertar perfil"        ON public.profiles    FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Lectura publica"        ON public.products    FOR SELECT USING (true);
CREATE POLICY "Ver propios pedidos"    ON public.orders      FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Crear pedidos"          ON public.orders      FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Ver order items"        ON public.order_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid()));
CREATE POLICY "Gestionar carrito"      ON public.cart_items  FOR ALL    USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);