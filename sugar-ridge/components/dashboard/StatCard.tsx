import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  subtext?: string
  icon: LucideIcon
  variant?: 'default' | 'highlight'
}

export default function StatCard({ label, value, subtext, icon: Icon, variant = 'default' }: StatCardProps) {
  return (
    <div className={cn(
      'rounded-xl p-5 border',
      variant === 'highlight'
        ? 'bg-[#3d0000] text-white border-[#3d0000]'
        : 'bg-white text-[#19130b] border-[#e8dfd0]',
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center',
          variant === 'highlight' ? 'bg-white/10' : 'bg-[#3d0000]/8',
        )}>
          <Icon size={18} className={variant === 'highlight' ? 'text-[#7BC9BF]' : 'text-[#3d0000]'} />
        </div>
      </div>
      <p className={cn('text-sm mb-1', variant === 'highlight' ? 'text-white/70' : 'text-gray-500')}>
        {label}
      </p>
      <p className={cn(
        'font-serif text-2xl font-bold',
        variant === 'highlight' ? 'text-white' : 'text-[#19130b]',
      )}>
        {value}
      </p>
      {subtext && (
        <p className={cn('text-xs mt-1', variant === 'highlight' ? 'text-white/50' : 'text-gray-400')}>
          {subtext}
        </p>
      )}
    </div>
  )
}
