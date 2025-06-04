import { StatCard } from './StatCard'
import { Users, Edit3, DollarSign, CheckCircle, CalendarCheck } from 'lucide-react'

interface MetricsPanelProps {
  totalBookings: number
  pendingBookings: number
  editingJobs: number
  unpaidBookings: number
  completedThisWeek: number
  revenueThisWeek: string
  onFilterChange?: (filters: { status?: string, paymentStatus?: string, editingStatus?: string }) => void
}

export function MetricsPanel({
  totalBookings,
  pendingBookings,
  editingJobs,
  unpaidBookings,
  completedThisWeek,
  revenueThisWeek,
  onFilterChange
}: MetricsPanelProps) {
  const metrics = [
    {
      label: 'Bookings',
      value: totalBookings,
      icon: <Users className="w-full h-full text-blue-600" />,
      color: 'bg-blue-100',
      onClick: () => onFilterChange?.({ status: 'all', paymentStatus: 'all', editingStatus: 'all' })
    },
    {
      label: 'Pending',
      value: pendingBookings,
      icon: <Users className="w-full h-full text-yellow-600" />,
      color: 'bg-yellow-100',
      onClick: () => onFilterChange?.({ status: 'pending' })
    },
    {
      label: 'Jobs in Editing',
      value: editingJobs,
      icon: <Edit3 className="w-full h-full text-purple-600" />,
      color: 'bg-purple-100',
      onClick: () => onFilterChange?.({ editingStatus: 'in_editing' })
    },
    {
      label: 'Unpaid',
      value: unpaidBookings,
      icon: <DollarSign className="w-full h-full text-red-600" />,
      color: 'bg-red-100',
      onClick: () => onFilterChange?.({ paymentStatus: 'not_paid' })
    },
    {
      label: 'Completed This Week',
      value: completedThisWeek,
      icon: <CheckCircle className="w-full h-full text-green-600" />,
      color: 'bg-green-100',
      onClick: () => onFilterChange?.({ status: 'completed' })
    },
    {
      label: 'Revenue This Week',
      value: revenueThisWeek,
      icon: <CalendarCheck className="w-full h-full text-emerald-600" />,
      color: 'bg-emerald-100',
      onClick: () => onFilterChange?.({ status: 'completed', paymentStatus: 'paid' })
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 w-full">
      {metrics.map((metric, i) => (
        <StatCard key={i} {...metric} />
      ))}
    </div>
  )
} 