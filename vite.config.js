import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Descomenta la siguiente línea si vas a desplegar en GitHub Pages
  // base: '/budget-primitivo/',
})

