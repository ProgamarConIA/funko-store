import { isAdminPreviewMode, EXPERIMENTAL_FEATURES } from '@/lib/preview'
import { setPreviewMode } from './actions'
import { FlaskConical, CheckCircle2, Circle, Rocket, BookOpen, Code2 } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin — Preview Mode' }

export default async function PreviewPage() {
  const isPreview = await isAdminPreviewMode()

  return (
    <div className="space-y-8 max-w-3xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F0F14] flex items-center gap-2.5">
          <FlaskConical className="w-6 h-6 text-amber-500" />
          Preview Mode
        </h1>
        <p className="text-[#6B6B7B] text-sm mt-1">
          Activá el modo preview para ver funciones experimentales antes de publicarlas.
          Los usuarios normales nunca ven estas features.
        </p>
      </div>

      {/* Estado + toggle */}
      <div className={`rounded-2xl border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 ${
        isPreview
          ? 'bg-amber-50 border-amber-200'
          : 'bg-white border-[#E4E4EC]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            isPreview ? 'bg-amber-100' : 'bg-[#F5F5F7]'
          }`}>
            <FlaskConical className={`w-5 h-5 ${isPreview ? 'text-amber-600' : 'text-[#B0B0BE]'}`} />
          </div>
          <div>
            <p className="font-bold text-[#0F0F14]">
              {isPreview ? 'Preview Mode activo' : 'Preview Mode inactivo'}
            </p>
            <p className="text-sm text-[#6B6B7B]">
              {isPreview
                ? 'Estás viendo funciones experimentales. Los usuarios no ven esto.'
                : 'Solo verás la versión pública estable.'}
            </p>
          </div>
        </div>

        {/* Toggle via form + Server Action */}
        <form action={setPreviewMode.bind(null, !isPreview)}>
          <button
            type="submit"
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              isPreview
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                : 'bg-[#0F0F14] hover:bg-[#2a2a35] text-white shadow-sm'
            }`}
          >
            {isPreview ? 'Desactivar preview' : 'Activar preview'}
          </button>
        </form>
      </div>

      {/* Features registradas */}
      <div>
        <h2 className="font-bold text-[#0F0F14] text-base mb-4 flex items-center gap-2">
          <Rocket className="w-4 h-4 text-[#5856D6]" />
          Features experimentales registradas
          <span className="text-xs font-normal text-[#B0B0BE] ml-1">({EXPERIMENTAL_FEATURES.length})</span>
        </h2>

        {EXPERIMENTAL_FEATURES.length === 0 ? (
          <div className="bg-white border border-[#E4E4EC] rounded-2xl p-8 text-center">
            <Code2 className="w-8 h-8 text-[#D0D0D8] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#0F0F14] mb-1">Sin features registradas</p>
            <p className="text-xs text-[#B0B0BE] max-w-sm mx-auto">
              Cuando desarrolles una nueva función experimental, registrala en{' '}
              <code className="bg-[#F5F5F7] px-1 py-0.5 rounded text-[#5856D6] font-mono text-[11px]">lib/preview.ts</code>{' '}
              y envolvé el componente con{' '}
              <code className="bg-[#F5F5F7] px-1 py-0.5 rounded text-[#5856D6] font-mono text-[11px]">&lt;PreviewFeature&gt;</code>.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#E4E4EC] rounded-2xl overflow-hidden">
            <div className="divide-y divide-[#F0F0F6]">
              {EXPERIMENTAL_FEATURES.map((f) => (
                <div key={f.key} className="flex items-start gap-3 px-5 py-4">
                  {f.status === 'ready'
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    : <Circle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-[#0F0F14]">{f.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        f.status === 'ready'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {f.status === 'ready' ? 'Lista para lanzar' : 'En desarrollo'}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B6B7B] mt-0.5">{f.description}</p>
                    <code className="text-[11px] font-mono text-[#5856D6] bg-[#F5F4FF] px-1.5 py-0.5 rounded mt-1 inline-block">
                      {f.key}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Guía de uso */}
      <div className="bg-[#F9F8FF] border border-[#E4E4EC] rounded-2xl p-6 space-y-4">
        <h2 className="font-bold text-[#0F0F14] text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#5856D6]" /> Cómo usar
        </h2>

        <div className="space-y-4 text-xs text-[#6B6B7B]">
          <div>
            <p className="font-semibold text-[#0F0F14] mb-1">1 — Registrar la feature</p>
            <p>Agregá una entrada al array <code className="font-mono text-[#5856D6]">EXPERIMENTAL_FEATURES</code> en <code className="font-mono text-[#5856D6]">lib/preview.ts</code>.</p>
          </div>
          <div>
            <p className="font-semibold text-[#0F0F14] mb-1">2 — Envolver el componente</p>
            <pre className="bg-[#0F0F14] text-[#a8d9a8] rounded-xl p-3 font-mono text-[11px] overflow-x-auto whitespace-pre leading-relaxed">
{`import { PreviewFeature } from '@/components/preview/PreviewFeature'

// En cualquier Server Component:
<PreviewFeature>
  <MiNuevoComponente />
</PreviewFeature>

// Con fallback (muestra algo si no hay preview):
<PreviewFeature fallback={<VersionEstable />}>
  <VersionExperimental />
</PreviewFeature>`}
            </pre>
          </div>
          <div>
            <p className="font-semibold text-[#0F0F14] mb-1">3 — Probar y decidir</p>
            <p>Activá Preview Mode, navegá la tienda, verificá que funciona. Cuando esté listo, eliminá el wrapper y el registro de <code className="font-mono text-[#5856D6]">EXPERIMENTAL_FEATURES</code>.</p>
          </div>
        </div>
      </div>

    </div>
  )
}
