import { supabaseAdmin } from '@/lib/supabase/admin'
import { formatPrice } from '@/lib/utils'
import { Package, Users, ShoppingBag, TrendingUp, AlertTriangle } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import RecentOrdersWidget from './RecentOrdersWidget'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin — Dashboard' }

export default async function AdminDashboard() {

  // ── Fase 1: queries independientes en paralelo ────────────────────────────
  const [
    { count: totalProducts },
    { count: totalOrders },
    { count: totalUsers },
    { data: rawOrders, error: ordersErr },
    { data: revenue },
    { data: lowStock },
  ] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    // Sin join a profiles — evita fallo silencioso por FK a auth.users
    supabaseAdmin
      .from('orders')
      .select('id, status, total, currency, display_total, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(10),
    supabaseAdmin.from('orders').select('total').in('status', ['paid', 'delivered']),
    supabaseAdmin.from('products').select('id, name, stock, franchise').lte('stock', 5).order('stock'),
  ])

  if (ordersErr) console.error('[admin/dashboard] orders query error:', ordersErr)

  // ── Fase 2: enriquecimiento dependiente de los IDs obtenidos ──────────────
  const orderIds  = (rawOrders ?? []).map((o) => o.id)
  const userIds   = [...new Set((rawOrders ?? []).map((o) => o.user_id).filter(Boolean))]

  const [profilesRes, itemsRes] = await Promise.all([
    userIds.length > 0
      ? supabaseAdmin.from('profiles').select('id, full_name, email').in('id', userIds)
      : Promise.resolve({ data: [] as { id: string; full_name: string | null; email: string }[], error: null }),
    orderIds.length > 0
      ? supabaseAdmin
          .from('order_items')
          .select('order_id, quantity, unit_price, product:products(id, name, image_url)')
          .in('order_id', orderIds)
      : Promise.resolve({ data: [] as unknown[], error: null }),
  ])

  const profiles = profilesRes.data
  const rawItems = itemsRes.data

  // ── Merge ─────────────────────────────────────────────────────────────────
  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]))

  type RawItem = { order_id: string; quantity: number; unit_price: number; product: { id: string; name: string; image_url: string | null } | null }
  const itemsMap: Record<string, RawItem[]> = {}
  ;(rawItems ?? []).forEach((item) => {
    const i = item as unknown as RawItem
    if (!itemsMap[i.order_id]) itemsMap[i.order_id] = []
    itemsMap[i.order_id].push(i)
  })

  const normalizedOrders = (rawOrders ?? []).map((o) => ({
    id:            o.id,
    status:        o.status,
    total:         o.total,
    currency:      (o as unknown as { currency: string | null }).currency    ?? null,
    display_total: (o as unknown as { display_total: number | null }).display_total ?? null,
    created_at:    o.created_at,
    profiles:      profileMap[o.user_id] ?? null,
    order_items:   (itemsMap[o.id] ?? []).map((i) => ({
      quantity:   i.quantity,
      unit_price: i.unit_price,
      product:    i.product,
    })),
  }))

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalRevenue = (revenue ?? []).reduce((acc, o) => acc + (o.total ?? 0), 0)

  const stats = [
    { label: 'Productos',  value: totalProducts ?? 0,       icon: <Package    className="w-5 h-5" />, color: 'text-[#5856D6]',  bg: 'bg-[#EEEDFF]' },
    { label: 'Pedidos',    value: totalOrders ?? 0,          icon: <ShoppingBag className="w-5 h-5"/>, color: 'text-blue-600',    bg: 'bg-blue-50' },
    { label: 'Usuarios',   value: totalUsers ?? 0,           icon: <Users      className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Ingresos',   value: formatPrice(totalRevenue), icon: <TrendingUp className="w-5 h-5" />, color: 'text-amber-600',   bg: 'bg-amber-50' },
  ]

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F0F14]">Dashboard</h1>
        <p className="text-[#6B6B7B] text-sm mt-1">Panel de administración de FunkoStore</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon, color, bg }) => (
          <div key={label} className="bg-white border border-[#E4E4EC] rounded-2xl p-5 shadow-card">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${bg} ${color} mb-4`}>
              {icon}
            </div>
            <p className="text-2xl font-bold text-[#0F0F14]">{value}</p>
            <p className="text-sm text-[#6B6B7B] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Pedidos recientes — ancho completo */}
      <RecentOrdersWidget initialOrders={normalizedOrders} />

      {/* Stock bajo */}
      {lowStock && lowStock.length > 0 && (
        <div className="bg-white border border-amber-200 rounded-2xl overflow-hidden shadow-card">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-amber-100 bg-amber-50">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="font-semibold text-amber-700 text-sm">
              Stock bajo — {lowStock.length} producto{lowStock.length !== 1 ? 's' : ''} en alerta
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E4E4EC]">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-[#0F0F14]">{p.name}</p>
                  <p className="text-xs text-[#6B6B7B]">{p.franchise}</p>
                </div>
                <span className={`text-sm font-bold ${p.stock === 0 ? 'text-red-500' : 'text-amber-500'}`}>
                  {p.stock === 0 ? 'Sin stock' : `${p.stock} uds.`}
                </span>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-[#E4E4EC]">
            <Link href="/admin/products" className="text-xs text-[#5856D6] hover:text-[#4644b8] font-medium">
              Gestionar productos →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
