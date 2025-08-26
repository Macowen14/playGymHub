import { Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isSignedIn } = useAuth()
  if (!isSignedIn) return <Navigate to="/sign-in" replace />
  return children
}


