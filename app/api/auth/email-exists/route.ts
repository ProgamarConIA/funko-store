import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const body  = await req.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email) {
      return NextResponse.json({ exists: false }, { status: 400 })
    }

    // Diagnostic: confirm env vars are present in this execution context.
    // Logs key/url lengths only — never the actual values.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    console.log('[email-exists] env — url len:', url?.length ?? 0, '| key len:', key?.length ?? 0)

    const admin = getSupabaseAdmin()
    // The JS SDK admin.listUsers doesn't support an email filter, so we fetch the
    // first 1000 users and do an exact-match on our side.
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })

    if (error || !data?.users) {
      console.log('[email-exists] listUsers failed:', error?.message ?? 'no data')
      return NextResponse.json({ exists: true }) // fail open on API error
    }

    const exists = data.users.some(u => u.email?.toLowerCase() === email)
    console.log('[email-exists] users fetched:', data.users.length, '| exists:', exists)
    return NextResponse.json({ exists })

  } catch (err) {
    console.log('[email-exists] caught:', err instanceof Error ? err.message : String(err))
    return NextResponse.json({ exists: true })
  }
}
