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
      <div className="container mx-auto py-6 px-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} PlayGym Hub
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


