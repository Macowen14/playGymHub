import { Link } from 'react-router-dom'
import type { Plan } from '../utils/api'
import { Dumbbell, Gamepad2, Film, Trophy } from 'lucide-react'

function CategoryIcon({ category }: { category: string }) {
  const base = 'h-4 w-4'
  if (category === 'gaming') return <Gamepad2 className={base} />
  if (category === 'gym') return <Dumbbell className={base} />
  if (category === 'movies') return <Film className={base} />
  if (category === 'sports') return <Trophy className={base} />
  return <span className="text-xs">🏷️</span>
}

function categoryBadgeClass(category: string) {
  switch (category) {
    case 'gaming':
      return 'bg-gaming-playstation/15 text-gaming-playstation border-gaming-playstation/30'
    case 'gym':
      return 'bg-fitness-energy/15 text-fitness-energy border-fitness-energy/30'
    default:
      return 'bg-muted text-muted-foreground border-muted'
  }
}

export default function SubscriptionCard({ plan }: { plan: Plan }) {
  const duration = plan.durationHours
    ? `${plan.durationHours} hour${plan.durationHours > 1 ? 's' : ''}`
    : plan.durationDays
    ? `${plan.durationDays} day${plan.durationDays > 1 ? 's' : ''}`
    : 'Flexible'

  return (
    <div className="rounded-xl border bg-card p-4 shadow-card hover:shadow-glow transition-shadow">
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-2 text-xs uppercase tracking-wide px-2 py-1 rounded-md border ${categoryBadgeClass(plan.category)}`}>
          <CategoryIcon category={plan.category} />
          {plan.category}
        </span>
        <span className="text-xs text-muted-foreground">{duration}</span>
      </div>
      <div className="mt-3">
        <div className="text-lg font-semibold">{plan.plan}</div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-xs text-muted-foreground">From</div>
          <div className="text-2xl font-bold">KES {plan.amount.toLocaleString()}</div>
        </div>
        <Link
          to={`/payment?plan=${encodeURIComponent(plan.plan)}&category=${encodeURIComponent(plan.category)}&amount=${plan.amount}`}
          className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm"
        >
          Choose
        </Link>
      </div>
    </div>
  )
}


