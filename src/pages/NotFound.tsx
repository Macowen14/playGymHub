import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold">404 - Not Found</h1>
      <p className="mt-2 text-muted-foreground">The page you requested does not exist.</p>
      <Link to="/" className="mt-4 inline-block px-3 py-2 rounded-md border">Go Home</Link>
    </div>
  )
}


