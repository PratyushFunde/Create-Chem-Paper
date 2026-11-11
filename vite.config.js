import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // relative paths so the build works on any host / sub-folder
  plugins: [react()],
  build: { chunkSizeWarningLimit: 900 },
})
