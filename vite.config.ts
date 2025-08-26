import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/mpesa': {
        target: 'http://localhost:5173',
        configure: (proxy, _options) => {
          // No external proxying; use middleware below
        }
      }
    },
    middlewareMode: false,
  },
  configureServer(server) {
    server.middlewares.use('/api/mpesa', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ success: false, error: 'Method not allowed' }))
        return
      }
      let body = ''
      for await (const chunk of req) body += chunk
      try {
        const payload = JSON.parse(body || '{}')
        const { phoneNumber, amount } = payload
        if (!phoneNumber || !amount) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: 'Missing phoneNumber or amount' }))
          return
        }
        await new Promise(r => setTimeout(r, 700))
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ success: true, checkoutRequestID: 'mock-' + Date.now() }))
      } catch (e) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }))
      }
    })
    server.middlewares.use('/api/plans', async (_req, res) => {
      const plans = [
        { id: 'ps1', title: 'PlayStation 1 Hour', price: 150 },
        { id: 'ps3', title: 'PlayStation 3 Hours', price: 400 },
        { id: 'psday', title: 'PlayStation Day Pass', price: 900 },
        { id: 'gymweek', title: 'Gym Weekly', price: 1200 },
        { id: 'gymmonth', title: 'Gym Monthly', price: 3500 },
      ]
      await new Promise(r => setTimeout(r, 400))
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ success: true, plans }))
    })
  }
})
