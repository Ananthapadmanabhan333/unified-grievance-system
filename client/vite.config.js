import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/ai': 'http://localhost:5000',
      '/grievances': 'http://localhost:5000',
      '/analytics': 'http://localhost:5000',
      '/notifications': 'http://localhost:5000'
    }
  }
})
