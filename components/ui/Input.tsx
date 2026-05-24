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
        <label htmlFor={id} className="text-sm font-medium text-[#a09dbd]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64607a]">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={cn(
            'w-full rounded-lg bg-[#12121f] border border-[#1e1e35] text-[#f1f0ff] placeholder-[#64607a]',
            'px-4 py-2.5 text-sm transition-all',
            'focus:outline-none focus:border-[#a855f7] focus:ring-2 focus:ring-[#a855f7]/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            icon && 'pl-10',
            error && 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
