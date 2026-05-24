import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'dark' | 'green' | 'yellow' | 'red' | 'purple' | 'cyan' | 'gray'
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-[#F5F5F7] text-[#6E6E73] border-[#E5E5EA]',
    dark:    'bg-[#1D1D1F] text-white border-transparent',
    green:   'bg-green-50 text-green-700 border-green-200',
    yellow:  'bg-amber-50 text-amber-700 border-amber-200',
    red:     'bg-red-50 text-red-600 border-red-200',
    purple:  'bg-[#F5F5F7] text-[#6E6E73] border-[#E5E5EA]',
    cyan:    'bg-[#F5F5F7] text-[#6E6E73] border-[#E5E5EA]',
    gray:    'bg-[#F5F5F7] text-[#6E6E73] border-[#E5E5EA]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
