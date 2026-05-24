import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
  prefix?: string
  suffix?: string
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-primary-600',
  iconBg = 'bg-primary-50',
  prefix,
  suffix
}: StatsCardProps) {
  const isPositive = change !== undefined && change >= 0

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-gray-900"
            >
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </motion.p>
            {change !== undefined && (
              <div className={cn(
                'flex items-center gap-1 mt-2 text-xs font-medium',
                isPositive ? 'text-green-600' : 'text-red-500'
              )}>
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{Math.abs(change)}% vs last month</span>
              </div>
            )}
          </div>
          <div className={cn('rounded-xl p-3', iconBg)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
