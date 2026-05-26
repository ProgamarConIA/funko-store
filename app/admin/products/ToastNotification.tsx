'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
  duration?: number
}

export default function ToastNotification({
  message,
  type,
  onClose,
  duration = 3000,
}: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Pequeño delay para que el CSS transition funcione al montar
    const showTimer = setTimeout(() => setVisible(true), 10)

    const hideTimer = setTimeout(() => {
      setVisible(false)
      // Esperar a que termine la animación de salida antes de desmontar
      setTimeout(onClose, 300)
    }, duration)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  const isSuccess = type === 'success'

  return (
    <div
      role="alert"
      aria-live="polite"
      className={[
        'fixed top-5 right-5 z-[9999] flex items-start gap-3',
        'px-4 py-3 rounded-2xl shadow-lg border max-w-sm w-auto',
        'transition-all duration-300 ease-out',
        isSuccess
          ? 'bg-white border-green-200 text-green-700'
          : 'bg-white border-red-200 text-red-600',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
      ].join(' ')}
    >
      {isSuccess ? (
        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      )}

      <p className="text-sm font-medium leading-snug flex-1">{message}</p>

      <button
        onClick={handleClose}
        className="text-[#B0B0BE] hover:text-[#6B6B7B] transition-colors flex-shrink-0 mt-0.5"
        aria-label="Cerrar notificación"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
