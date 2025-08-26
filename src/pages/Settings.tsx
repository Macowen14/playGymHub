import { useUser } from '@clerk/clerk-react'

export default function Settings() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) return <div className="py-10 text-center text-sm text-muted-foreground">Loading…</div>
  if (!user) return <div className="py-10 text-center text-sm text-muted-foreground">No user loaded.</div>

  return (
    <div className="max-w-xl mx-auto grid gap-6">
      <h2 className="text-xl font-semibold">Settings</h2>
      <div className="rounded-lg border p-4 grid gap-2">
        <div className="text-sm text-muted-foreground">User ID</div>
        <div className="font-mono text-sm break-all">{user.id}</div>
      </div>
      <div className="rounded-lg border p-4 grid gap-2">
        <div className="text-sm text-muted-foreground">Full name</div>
        <div>{user.fullName || '—'}</div>
      </div>
      <div className="rounded-lg border p-4 grid gap-2">
        <div className="text-sm text-muted-foreground">Primary email</div>
        <div>{user.primaryEmailAddress?.emailAddress || '—'}</div>
      </div>
      <div className="rounded-lg border p-4 grid gap-2">
        <div className="text-sm text-muted-foreground">Phone</div>
        <div>{user.primaryPhoneNumber?.phoneNumber || '—'}</div>
      </div>
    </div>
  )
}


