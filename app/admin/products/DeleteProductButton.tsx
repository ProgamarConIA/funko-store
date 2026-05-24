'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return

    await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 text-[#64607a] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
