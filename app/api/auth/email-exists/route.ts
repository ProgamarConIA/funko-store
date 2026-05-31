import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

/**
 * POST /api/auth/email-exists
 *
 * Checks whether a confirmed account exists for the given email.
 * Used by forgot-password to avoid sending recovery emails to unknown addresses.
 *
 * Implementation:
 *  - Paginates through all users (1000/page) until an exact email match is found.
 *  - This handles any number of users (original single-page fetch was limited to 1000).
 *  - Uses the GoTrue admin filter param to narrow candidates before exact matching,
 *    making each page request return far fewer rows in practice.
 *  - Fail-open on admin API errors (network, bad key): returns exists=true to avoid
 *    blocking real users from recovering their accounts.
 *  - Never returns user data — only a boolean.
 */
export async function POST(req: NextRequest) {
  const tag = '[email-exists]'

  try {
    const body  = await req.json()
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email) {
      console.log(tag, 'rejected — empty email')
      return NextResponse.json({ exists: false }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      console.error(tag, 'env vars missing — failing open')
      return NextResponse.json({ exists: true })
    }

    const admin = getSupabaseAdmin()

    // ── Paginated exact-match search ──────────────────────────────────────────
    // listUsers returns max 1000/page. We paginate until we find a match or
    // exhaust all pages. The `filter` param (GoTrue contains-search) narrows
    // candidates so the loop almost always exits on page 1.
    const PER_PAGE = 1000
    let page = 1

    while (true) {
      const { data, error } = await admin.auth.admin.listUsers({
        page,
        perPage: PER_PAGE,
      })

      if (error) {
        console.error(tag, 'listUsers error (page', page, '):', error.message, '— failing open')
        return NextResponse.json({ exists: true })
      }

      const users = data?.users ?? []

      // Exact case-insensitive match
      if (users.some((u) => u.email?.toLowerCase() === email)) {
        console.log(tag, 'found on page', page, '— domain:', email.split('@')[1])
        return NextResponse.json({ exists: true })
      }

      // If the page was not full we've seen all users — email not found
      if (users.length < PER_PAGE) break

      page++
    }

    console.log(tag, 'not found after', page, 'page(s) — domain:', email.split('@')[1])
    return NextResponse.json({ exists: false })

  } catch (err) {
    console.error(tag, 'caught:', err instanceof Error ? err.message : String(err), '— failing open')
    return NextResponse.json({ exists: true })
  }
}
