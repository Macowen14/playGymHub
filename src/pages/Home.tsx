import { Link } from 'react-router-dom'
import { CreditCard, Dumbbell, Gamepad2, ShieldCheck, Smartphone, Clock } from 'lucide-react'

export default function Home() {
  const features = [
    { icon: Gamepad2, title: 'Premium PS Stations', desc: 'Latest consoles, comfy chairs, and high-speed displays.' },
    { icon: Dumbbell, title: 'Modern Gym', desc: 'Strength, cardio, and functional zones for all fitness levels.' },
    { icon: CreditCard, title: 'M-Pesa Ready', desc: 'Fast, secure checkout with instant confirmation.' },
    { icon: ShieldCheck, title: 'Secure Accounts', desc: 'Clerk-powered auth keeps your data safe.' },
    { icon: Smartphone, title: 'Mobile First', desc: 'Book, pay, and manage on any device.' },
    { icon: Clock, title: 'Flexible Plans', desc: 'Hourly gaming, day passes, and gym memberships.' },
  ]

  const testimonials = [
    { name: 'Aisha', quote: 'Loved the PS5 setup. Clean, fast, and super chill vibes.' },
    { name: 'Brian', quote: 'Great gym equipment and flexible plans that fit my schedule.' },
    { name: 'Wanjiku', quote: 'M-Pesa checkout was instant. I was playing in minutes.' },
  ]

  return (
    <div className="grid gap-10">
      <section className="rounded-xl p-8 md:p-12 bg-gradient-hero text-white shadow-glow">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">Game harder. Train smarter.</h1>
          <p className="mt-3 text-sm md:text-base opacity-95">Premium PlayStation sessions and modern fitness memberships with instant M-Pesa payments.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link to="/subscriptions" className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm w-full sm:w-auto text-center">Explore Plans</Link>
            <Link to="/payment" className="px-4 py-2 rounded-md border border-white/30 text-sm w-full sm:w-auto text-center">Quick Pay</Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <img src="/gaming.jpg" alt="Gaming area" className="rounded-md border object-cover aspect-video" />
        <img src="/gymn.jpeg" alt="Gym floor" className="rounded-md border object-cover aspect-video" />
      </section>

      <section>
        <h2 className="text-xl font-semibold">Why PlayGym Hub</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="rounded-lg border p-4 bg-card">
              <div className="flex items-center gap-3">
                <f.icon className="h-5 w-5 text-primary" />
                <div className="font-medium">{f.title}</div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Active Gamers" value="2.5k+" />
        <Stat label="Gym Members" value="1.8k+" />
        <Stat label="Avg. Rating" value="4.8/5" />
        <Stat label="M-Pesa Checkouts" value="10k+" />
      </section>

      <section>
        <h2 className="text-xl font-semibold">What people say</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-lg border p-4 bg-card shadow-card">
              <div className="text-sm text-muted-foreground">“{t.quote}”</div>
              <div className="mt-3 text-sm font-medium">— {t.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border p-6 md:p-8 bg-muted/30">
        <div className="grid gap-4 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="text-lg font-semibold">Ready to start?</h3>
            <p className="mt-2 text-sm text-muted-foreground">Pick a plan and checkout with M-Pesa. You can manage your subscriptions anytime.</p>
            <div className="mt-4 flex gap-3">
              <Link to="/subscriptions" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm">View Subscriptions</Link>
              <Link to="/dashboard" className="px-4 py-2 rounded-md border text-sm">Go to Dashboard</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="/gaming.jpg" alt="Gaming" className="rounded-md border object-cover aspect-video" />
            <img src="/gymn.jpeg" alt="Gym" className="rounded-md border object-cover aspect-video" />
          </div>
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-4 bg-card text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  )
}

