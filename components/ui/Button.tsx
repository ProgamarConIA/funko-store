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
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-[#1D1D1F] hover:bg-[#3D3D3F] text-white focus:ring-[#1D1D1F]',
    secondary:
      'bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1D1D1F] border border-[#E5E5EA] focus:ring-[#1D1D1F]',
    outline:
      'border border-[#1D1D1F] text-[#1D1D1F] hover:bg-[#1D1D1F] hover:text-white focus:ring-[#1D1D1F]',
    ghost:
      'text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] focus:ring-[#1D1D1F]',
    danger:
      'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
  }

  const sizes = {
    sm:  'px-3.5 py-1.5 text-sm',
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
