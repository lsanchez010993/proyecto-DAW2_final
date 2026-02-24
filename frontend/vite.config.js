import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  

  preview: { //Para trabajar con railway
    allowedHosts: ['impartial-spontaneity-production-36c6.up.railway.app'],
  },
})