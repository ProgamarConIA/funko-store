-- ═══════════════════════════════════════════════════════════════
--  FunkoStore — Migración: moneda en órdenes
--  Ejecutar en: Supabase Dashboard → SQL Editor
--  ANTES de desplegar el código que usa currency/display_total
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. Agregar columna de moneda ──────────────────────────────
--  currency: código ISO 4217 (ARS, USD, EUR, MXN, etc.)
--  DEFAULT 'EUR' para compatibilidad con órdenes existentes
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'EUR';

-- ─── 2. Agregar columna de monto en la moneda del usuario ──────
--  display_total: total convertido a la moneda elegida al momento
--  de confirmar la compra (para mostrar al usuario)
--  total (EUR) se mantiene como base contable para el admin
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS display_total NUMERIC(14, 2);

-- ─── 3. Backfill: órdenes existentes → display_total = total ───
--  Las órdenes antiguas están en EUR, así que display_total = total
UPDATE public.orders
SET display_total = total
WHERE display_total IS NULL;

-- ─── 4. Verificación ───────────────────────────────────────────
SELECT id, total, currency, display_total
FROM public.orders
ORDER BY created_at DESC
LIMIT 5;
