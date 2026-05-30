'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { PREVIEW_COOKIE } from '@/lib/preview'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''

export async function setPreviewMode(enabled: boolean): Promise<void> {
  // Server-side admin verification — never trust the client alone
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) return

  const cookieStore = await cookies()
  if (enabled) {
    cookieStore.set(PREVIEW_COOKIE, '1', {
      httpOnly: true,
      sameSite: 'strict',
      path:     '/',
      maxAge:   60 * 60 * 8, // 8 hours
    })
  } else {
    cookieStore.delete(PREVIEW_COOKIE)
  }

  // Invalidate the entire layout so preview-gated components re-render
  revalidatePath('/', 'layout')
}
