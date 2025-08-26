import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchPlans, type Plan } from '../utils/api'
import SubscriptionCard from '../components/SubscriptionCard'

export default function Subscriptions() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['plans'], queryFn: fetchPlans })

  if (isLoading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4 animate-pulse">
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="mt-2 h-3 w-1/2 bg-muted rounded" />
          <div className="mt-6 h-5 w-20 bg-muted rounded" />
          <div className="mt-4 h-8 w-24 bg-muted rounded" />
        </div>
      ))}
    </div>
  )

  if (isError || !data) return <div className="text-sm text-destructive">Failed to load plans.</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((p: Plan, idx: number) => (
        <SubscriptionCard key={`${p.category}-${p.plan}-${idx}`} plan={p} />
      ))}
    </div>
  )
}


