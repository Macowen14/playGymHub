export type Plan = {
  category: 'gaming' | 'gym' | string
  plan: string
  amount: number
  durationHours: number | null
  durationDays: number | null
  description: string
}

export async function fetchPlans(): Promise<Plan[]> {
  const res = await fetch('http://localhost:5000/api/subscriptions/plans', {
    headers: { 'Accept': 'application/json' },
    cache: 'no-store'
  })
  if (!res.ok) {
    throw new Error('Failed to load plans')
  }
  const data = await res.json()
  // If the API returns a wrapper, try common shapes; otherwise assume array
  const plans: Plan[] = Array.isArray(data) ? data : (data.plans ?? data.data ?? [])
  return plans
}


