import { cn } from '@/lib/utils'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
}

export default function Input({ label, error, icon, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#1D1D1F]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AEAEB2]">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={cn(
            'w-full rounded-xl bg-white border border-[#E5E5EA] text-[#1D1D1F] placeholder-[#AEAEB2]',
            'px-4 py-2.5 text-sm transition-all',
            'focus:outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/10',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            icon && 'pl-10',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
