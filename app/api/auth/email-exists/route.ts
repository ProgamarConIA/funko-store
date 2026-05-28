import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const body  = await req.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email) {
      return NextResponse.json({ exists: false }, { status: 400 })
    }

    const admin = getSupabaseAdmin()
    // listUsers doesn't support an email filter in the JS SDK, so we fetch the
    // first page (up to 1000) and do an exact-match on our side.
    const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })

    if (error || !data?.users) {
      return NextResponse.json({ exists: true }) // fail open on API error
    }

    const exists = data.users.some(u => u.email?.toLowerCase() === email)
    return NextResponse.json({ exists })
  } catch {
    // Missing env vars or network error → fail open
    return NextResponse.json({ exists: true })
  }
}
