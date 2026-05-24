import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#08080f] disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-[#a855f7] hover:bg-[#9333ea] text-white shadow-[0_0_15px_rgba(168,85,247,0.35)] hover:shadow-[0_0_22px_rgba(168,85,247,0.55)] focus:ring-[#a855f7]',
    secondary:
      'bg-[#1a1a2e] hover:bg-[#1e1e35] text-[#f1f0ff] border border-[#1e1e35] hover:border-[#a855f7]/50 focus:ring-[#a855f7]',
    outline:
      'border border-[#a855f7]/60 text-[#a855f7] hover:bg-[#a855f7]/10 focus:ring-[#a855f7]',
    ghost:
      'text-[#a09dbd] hover:text-[#f1f0ff] hover:bg-[#1a1a2e] focus:ring-[#a855f7]',
    danger:
      'bg-red-600 hover:bg-red-500 text-white focus:ring-red-500',
  }

  const sizes = {
    sm:  'px-3 py-1.5 text-sm',
    md:  'px-5 py-2.5 text-sm',
    lg:  'px-7 py-3 text-base',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && <span className="w-4 h-4">{icon}</span>
      )}
      {children}
    </button>
  )
}
