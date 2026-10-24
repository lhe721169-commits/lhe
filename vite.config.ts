import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relative asset paths are robust on GitHub Pages project URLs.
  base: './',
  server: {
    port: 5173,
    host: '0.0.0.0'
  }
})
