import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SignIn, SignUp } from '@clerk/clerk-react'
import { Suspense, lazy } from 'react'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

const Home = lazy(() => import('./pages/Home'))
const Subscriptions = lazy(() => import('./pages/Subscriptions'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Payment = lazy(() => import('./pages/Payment'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Settings = lazy(() => import('./pages/Settings'))

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<div className="py-10 text-center text-sm text-muted-foreground">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/payment" element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/sign-in" element={<div className="max-w-md mx-auto"><SignIn routing="path" path="/sign-in" /></div>} />
            <Route path="/sign-up" element={<div className="max-w-md mx-auto"><SignUp routing="path" path="/sign-up" /></div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}
