import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email) {
      return NextResponse.json({ exists: false }, { status: 400 })
    }

    const { data } = await supabaseAdmin.auth.admin.getUserByEmail(email)

    return NextResponse.json({ exists: !!data.user })
  } catch {
    // If the admin client errors (missing env vars, network), fail open:
    // allow the recovery attempt rather than blocking the user.
    return NextResponse.json({ exists: true })
  }
}
