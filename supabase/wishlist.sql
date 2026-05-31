-- ============================================================
--  WISHLIST — Script completo de creación
--  Proyecto: funko-store
--  Ejecutar: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================
--
--  ORDEN DE EJECUCIÓN:
--   1. CREATE TABLE
--   2. CREATE INDEX
--   3. ALTER TABLE ENABLE ROW LEVEL SECURITY
--   4. CREATE POLICY (×3)
--   5. Bloque de verificación (al final, opcional)
--
--  TIEMPO ESTIMADO: < 5 segundos
-- ============================================================


-- ── 1. TABLA ──────────────────────────────────────────────────────────��──────
--
--  Columnas:
--   id          → PK uuid autogenerado
--   user_id     → FK a auth.users(id), CASCADE DELETE
--                 (si el usuario se elimina, se borran sus favoritos)
--   product_id  → FK a public.products(id), CASCADE DELETE
--                 (si el producto se elimina, desaparece de todas las wishlists)
--   created_at  → timestamp con timezone, default now()
--
--  Restricciones:
--   UNIQUE(user_id, product_id) → un usuario no puede tener el mismo
--                                  producto dos veces en su wishlist

CREATE TABLE IF NOT EXISTS public.wishlist (
    id         uuid        NOT NULL DEFAULT gen_random_uuid(),
    user_id    uuid        NOT NULL,
    product_id uuid        NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT wishlist_pkey
        PRIMARY KEY (id),

    CONSTRAINT wishlist_user_fk
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE,

    CONSTRAINT wishlist_product_fk
        FOREIGN KEY (product_id)
        REFERENCES public.products(id)
        ON DELETE CASCADE,

    CONSTRAINT wishlist_no_duplicates
        UNIQUE (user_id, product_id)
);


-- ── 2. ÍNDICES ────────────────────────────────────────────────────────────────
--
--  idx_wishlist_user_id → acelera todas las consultas por usuario
--                         (la query más frecuente: traer la wishlist de un usuario)
--
--  idx_wishlist_product_id → acelera búsquedas cuando se borra un producto
--                            y Postgres necesita encontrar todas las filas afectadas

CREATE INDEX IF NOT EXISTS idx_wishlist_user_id
    ON public.wishlist (user_id);

CREATE INDEX IF NOT EXISTS idx_wishlist_product_id
    ON public.wishlist (product_id);


-- ── 3. ROW LEVEL SECURITY ────────────────────────────────────────────────────
--
--  Sin RLS activo, cualquier usuario autenticado podría leer/modificar
--  la wishlist de otro usuario. RLS restringe cada operación al dueño.

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;


-- ── 4. POLÍTICAS RLS ─────────────────────────────────────────────────────────
--
--  Política para SELECT: el usuario solo ve sus propios favoritos
CREATE POLICY "wishlist_select_own"
    ON public.wishlist
    FOR SELECT
    USING ( auth.uid() = user_id );

--  Política para INSERT: el usuario solo puede insertar filas con su propio user_id
CREATE POLICY "wishlist_insert_own"
    ON public.wishlist
    FOR INSERT
    WITH CHECK ( auth.uid() = user_id );

--  Política para DELETE: el usuario solo puede eliminar sus propios favoritos
CREATE POLICY "wishlist_delete_own"
    ON public.wishlist
    FOR DELETE
    USING ( auth.uid() = user_id );


-- ============================================================
--  BLOQUE DE VERIFICACIÓN — ejecutar después del script anterior
--  para confirmar que todo quedó creado correctamente.
-- ============================================================

-- ── V1. Verificar que la tabla existe en el schema public ────────────────────
SELECT
    table_schema,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name   = 'wishlist';
-- Resultado esperado: 1 fila con table_type = 'BASE TABLE'

-- ── V2. Verificar columnas y tipos ──────────────────────────────────────────
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'wishlist'
ORDER BY ordinal_position;
-- Resultado esperado: 4 filas (id, user_id, product_id, created_at)

-- ── V3. Verificar índices ────────────────────────────────────────────────────
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename  = 'wishlist';
-- Resultado esperado: 3 índices
--   wishlist_pkey
--   idx_wishlist_user_id
--   idx_wishlist_product_id
--   (+ el índice del unique constraint: wishlist_no_duplicates)

-- ── V4. Verificar foreign keys ───────────────────────────────────────────────
SELECT
    tc.constraint_name,
    kcu.column_name,
    ccu.table_schema AS foreign_schema,
    ccu.table_name   AS foreign_table,
    ccu.column_name  AS foreign_column,
    rc.delete_rule
FROM information_schema.table_constraints   AS tc
JOIN information_schema.key_column_usage    AS kcu
    ON tc.constraint_name = kcu.constraint_name
   AND tc.table_schema    = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
    ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema    = 'public'
  AND tc.table_name      = 'wishlist';
-- Resultado esperado: 2 filas
--   wishlist_user_fk    → auth.users(id)    DELETE CASCADE
--   wishlist_product_fk → public.products(id) DELETE CASCADE

-- ── V5. Verificar políticas RLS ──────────────────────────────────────────────
SELECT
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename  = 'wishlist';
-- Resultado esperado: 3 filas (SELECT, INSERT, DELETE)

-- ── V6. Test rápido de insert + select + delete (requiere sesión activa) ─────
-- Descomentar solo para prueba manual desde el SQL Editor con un user_id real:
--
-- INSERT INTO public.wishlist (user_id, product_id)
-- VALUES (
--   '<tu-user-id-uuid>',
--   (SELECT id FROM public.products LIMIT 1)
-- );
--
-- SELECT * FROM public.wishlist WHERE user_id = '<tu-user-id-uuid>';
--
-- DELETE FROM public.wishlist WHERE user_id = '<tu-user-id-uuid>';
