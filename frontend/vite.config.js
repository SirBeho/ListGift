import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'ununique-convertibly-rachel.ngrok-free.dev' // Pega tu URL de ngrok aquí
    ]
  }
})
