/**
 * instrumentation.ts
 *
 * Hook oficial de Next.js para inicialización del servidor.
 * Se ejecuta UNA VEZ en cada cold-start, antes de que el servidor
 * acepte cualquier request.
 *
 * Documentación: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 *
 * Responsabilidades actuales:
 *   - Aplicar migraciones de base de datos pendientes (lib/migrations.ts)
 */
export async function register() {
  // Solo correr en el runtime de Node.js.
  // En Edge Runtime no hay acceso a variables de entorno del servidor
  // ni a la base de datos, así que lo saltamos.
  if (process.env.NEXT_RUNTIME === 'edge') return

  try {
    // Import dinámico para evitar que el bundler incluya este código
    // en el bundle del cliente o del edge runtime.
    const { runMigrations } = await import('@/lib/migrations')
    await runMigrations()
  } catch (err) {
    // Logueamos el error pero NO lo relanzamos:
    // la app debe arrancar aunque la migración falle, para no
    // bloquear el deploy por un error de base de datos.
    console.error('[instrumentation] ❌ Error en migraciones:', err)
  }
}
