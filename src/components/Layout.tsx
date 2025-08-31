import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import DarkModeToggle from './DarkModeToggle'

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="font-bold">PlayGym Hub</Link>
        <nav className="flex items-center gap-3">
          <Link to="/subscriptions" className="text-sm">Subscriptions</Link>
          <SignedIn>
            <Link to="/dashboard" className="text-sm">Dashboard</Link>
            <Link to="/settings" className="text-sm">Settings</Link>
          </SignedIn>
          <DarkModeToggle />
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link to="/sign-in" className="text-sm">Sign in</Link>
          </SignedOut>
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t mt-10">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="font-bold">PlayGym Hub</div>
            <p className="mt-2 text-sm text-muted-foreground">Game harder. Train smarter. Flexible plans with instant M-Pesa payments.</p>
          </div>
          <div>
            <div className="text-sm font-semibold">Links</div>
            <ul className="mt-2 space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:underline">Home</Link></li>
              <li><Link to="/subscriptions" className="text-muted-foreground hover:underline">Subscriptions</Link></li>
              <li><Link to="/dashboard" className="text-muted-foreground hover:underline">Dashboard</Link></li>
              <li><Link to="/settings" className="text-muted-foreground hover:underline">Settings</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold">Contact</div>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li>Email: hello@playgymhub.example</li>
              <li>Phone: +254 795 188 610</li>
              <li>Location: Meru, Kenya</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold">Follow</div>
            <div className="mt-2 flex gap-3 text-sm text-muted-foreground">
              <a href="#" aria-label="Twitter" className="hover:underline">Twitter</a>
              <a href="#" aria-label="Instagram" className="hover:underline">Instagram</a>
              <a href="#" aria-label="Facebook" className="hover:underline">Facebook</a>
            </div>
          </div>
        </div>
        <div className="mt-10 text-xs text-muted-foreground">© {new Date().getFullYear()} PlayGym Hub. All rights reserved.</div>
      </div>
    </footer>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="container mx-auto flex-1 px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  )
}


