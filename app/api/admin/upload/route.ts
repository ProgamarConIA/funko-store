import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const BUCKET = 'product-images'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAIL || user.email !== ADMIN_EMAIL) return null
  return user
}

/** Devuelve el path relativo dentro del bucket si la URL es de Supabase Storage */
function extractStoragePath(url: string | null): string | null {
  if (!url) return null
  // URL format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
  const marker = `/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.slice(idx + marker.length)
}

async function ensureBucket() {
  const { data: buckets } = await supabaseAdmin.storage.listBuckets()
  const exists = buckets?.some((b) => b.name === BUCKET)
  if (!exists) {
    const { error } = await supabaseAdmin.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5 MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    })
    if (error && error.message !== 'Bucket already exists') {
      throw new Error(`No se pudo crear el bucket: ${error.message}`)
    }
  }
}

export async function POST(request: Request) {
  const admin = await checkAdmin()
  if (!admin) return NextResponse.json({ error: 'Sin autorización' }, { status: 403 })

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'FormData inválido' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  const oldUrl = formData.get('oldUrl') as string | null

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 })
  }

  // Validar tipo y tamaño
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Tipo de archivo no permitido. Usa JPG, PNG, WebP o GIF.' }, { status: 400 })
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'El archivo supera los 5 MB' }, { status: 400 })
  }

  // Extensión y nombre único
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `product-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  try {
    await ensureBucket()
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error de Storage'
    return NextResponse.json({ error: msg }, { status: 500 })
  }

  // Subir archivo
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json({ error: `Error al subir imagen: ${uploadError.message}` }, { status: 500 })
  }

  // URL pública
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(filename)

  // Eliminar imagen anterior si era de Supabase Storage
  const oldPath = extractStoragePath(oldUrl)
  if (oldPath) {
    await supabaseAdmin.storage.from(BUCKET).remove([oldPath])
  }

  return NextResponse.json({ url: publicUrl })
}
