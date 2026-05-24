import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'accent'
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
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-[#0F0F14] hover:bg-[#2A2A35] text-white focus:ring-[#0F0F14] shadow-sm focus:ring-offset-white',
    secondary:
      'bg-[#F5F4FF] hover:bg-[#EEEDFF] text-[#0F0F14] border border-[#E4E4EC] focus:ring-[#5856D6] focus:ring-offset-white',
    accent:
      'bg-[#5856D6] hover:bg-[#4644b8] text-white focus:ring-[#5856D6] shadow-sm focus:ring-offset-white',
    outline:
      'border border-[#0F0F14] text-[#0F0F14] hover:bg-[#0F0F14] hover:text-white focus:ring-[#0F0F14] focus:ring-offset-white',
    ghost:
      'text-[#6B6B7B] hover:text-[#0F0F14] hover:bg-[#F5F4FF] focus:ring-[#5856D6] focus:ring-offset-white',
    danger:
      'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 focus:ring-offset-white',
  }

  const sizes = {
    sm:  'px-3.5 py-1.5 text-sm',
    md:  'px-5 py-2.5 text-sm',
    lg:  'px-7 py-3.5 text-base',
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
