-- ============================================================
--  Wishlist / Favoritos — ejecutar en Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS wishlist (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid        REFERENCES auth.users(id)  ON DELETE CASCADE NOT NULL,
  product_id uuid        REFERENCES products(id)    ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()              NOT NULL,
  UNIQUE (user_id, product_id)          -- sin duplicados por usuario
);

-- Índice para queries rápidas por usuario
CREATE INDEX IF NOT EXISTS wishlist_user_id_idx ON wishlist (user_id);

-- Row Level Security
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Cada usuario solo puede ver y gestionar su propia wishlist
CREATE POLICY "wishlist_own_rows" ON wishlist
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
