import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'purple' | 'cyan' | 'green' | 'yellow' | 'red' | 'gray'
  className?: string
}

export default function Badge({ children, variant = 'purple', className }: BadgeProps) {
  const variants = {
    purple: 'bg-[#a855f7]/15 text-[#c084fc] border-[#a855f7]/30',
    cyan:   'bg-[#22d3ee]/15 text-[#22d3ee] border-[#22d3ee]/30',
    green:  'bg-[#4ade80]/15 text-[#4ade80] border-[#4ade80]/30',
    yellow: 'bg-[#facc15]/15 text-[#facc15] border-[#facc15]/30',
    red:    'bg-red-500/15 text-red-400 border-red-500/30',
    gray:   'bg-[#64607a]/15 text-[#a09dbd] border-[#64607a]/30',
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
