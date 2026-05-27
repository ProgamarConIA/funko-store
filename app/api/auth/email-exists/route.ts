import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body  = await req.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email) {
      return NextResponse.json({ exists: false }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ exists: true }) // fail open
    }

    // GoTrue admin REST API — `filter` searches across email and other user fields.
    // We fetch up to 10 results and then verify exact email match on our side
    // to avoid false positives from substring matches.
    const res = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?filter=${encodeURIComponent(email)}&per_page=10`,
      {
        headers: {
          apikey:        serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    )

    if (!res.ok) {
      return NextResponse.json({ exists: true }) // fail open
    }

    const result = await res.json()
    const users: { email?: string }[] = result.users ?? []
    const exists = users.some(u => u.email?.toLowerCase() === email)

    return NextResponse.json({ exists })
  } catch {
    // Network error or missing env vars → fail open (don't block legitimate users)
    return NextResponse.json({ exists: true })
  }
}
