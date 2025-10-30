import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Correct Vite config for Vercel deployment
export default defineConfig({
  plugins: [react()],
  base: './', // <-- VERY IMPORTANT for production (fixes blank screen)
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
