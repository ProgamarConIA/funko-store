'use client'

/**
 * OTPInput — Input de código de verificación estilo moderno (Discord/Stripe).
 *
 * Características:
 *   - N cajas individuales (default: 6, coincide con Supabase OTP)
 *   - Auto-avance al siguiente campo al tipear
 *   - Backspace limpia el campo actual; si ya está vacío, retrocede al anterior
 *   - Pegar el código completo rellena todos los campos y dispara onComplete
 *   - autocomplete="one-time-code" para autocompletar en iOS/Android
 *   - inputMode="numeric" para teclado numérico en mobile
 *   - Accesible: role="group" + aria-label por campo
 */

import { useEffect, useRef, useState } from 'react'

interface OTPInputProps {
  /** Cantidad de dígitos del código (default: 6 — coincide con Supabase) */
  length?: number
  /** Se llama cuando todos los campos están llenos */
  onComplete: (otp: string) => void
  /** Deshabilita los inputs mientras se verifica */
  loading?: boolean
  /** Muestra estado de error (borde rojo) */
  hasError?: boolean
}

export default function OTPInput({
  length    = 6,
  onComplete,
  loading   = false,
  hasError  = false,
}: OTPInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(''))
  const refs = useRef<(HTMLInputElement | null)[]>([])

  // Foco automático al primer campo al montar
  useEffect(() => {
    refs.current[0]?.focus()
  }, [])

  /** Dispara onComplete si todos los campos tienen un dígito */
  const notify = (vals: string[]) => {
    if (vals.every(v => v !== '')) {
      onComplete(vals.join(''))
    }
  }

  const handleChange = (i: number, raw: string) => {
    // Permitir solo dígitos; si viene "37" (overtype), tomar el último
    const digit = raw.replace(/\D/g, '').slice(-1)
    if (!digit) return

    const next = [...values]
    next[i] = digit
    setValues(next)

    // Avanzar al siguiente campo
    if (i < length - 1) {
      refs.current[i + 1]?.focus()
    }

    notify(next)
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Backspace':
        e.preventDefault()
        if (values[i]) {
          // Limpiar campo actual
          const next = [...values]
          next[i] = ''
          setValues(next)
        } else if (i > 0) {
          // Retroceder y limpiar campo anterior
          const next = [...values]
          next[i - 1] = ''
          setValues(next)
          refs.current[i - 1]?.focus()
        }
        break
      case 'ArrowLeft':
        if (i > 0) refs.current[i - 1]?.focus()
        break
      case 'ArrowRight':
        if (i < length - 1) refs.current[i + 1]?.focus()
        break
      case 'Enter':
        notify(values)
        break
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return

    const next = Array(length).fill('')
    pasted.split('').forEach((d, j) => { next[j] = d })
    setValues(next)

    // Foco al último campo completado (o al último si está lleno)
    refs.current[Math.min(pasted.length, length - 1)]?.focus()
    notify(next)
  }

  return (
    <div
      className="flex gap-2 sm:gap-2.5 justify-center"
      role="group"
      aria-label="Código de verificación"
    >
      {values.map((val, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={2}          /* permite overtype; handleChange toma el último */
          value={val}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={e => e.target.select()}
          disabled={loading}
          aria-label={`Dígito ${i + 1} de ${length}`}
          className={[
            // Tamaño
            'w-10 h-13 sm:w-11 sm:h-14',
            // Tipografía y layout
            'text-center text-xl sm:text-2xl font-bold',
            // Forma
            'rounded-xl border-2 outline-none',
            // Cursor y transición
            'caret-transparent transition-all duration-150 select-all',
            // Disabled
            'disabled:opacity-40 disabled:cursor-not-allowed',
            // Estado — error
            hasError
              ? 'border-red-400 bg-red-50 text-red-600'
              : val
                // Estado — lleno
                ? 'border-[#5856D6] bg-[#F5F4FF] text-[#5856D6]'
                // Estado — vacío
                : 'border-[#E4E4EC] bg-white text-[#0F0F14]',
            // Focus (solo cuando no hay error)
            !hasError && 'focus:border-[#5856D6] focus:bg-[#F5F4FF] focus:ring-4 focus:ring-[#5856D6]/10',
          ].join(' ')}
        />
      ))}
    </div>
  )
}
