import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    // Remove the old proxy configuration and use proper middleware
    proxy: {
      // Remove the old proxy setup
    },
  },
  // configureServer is not a valid option in Vite - use the configureServer function inside the plugin
})

// For custom middleware, you need to use a different approach
// Create a separate file for your mock API or use a proper backend