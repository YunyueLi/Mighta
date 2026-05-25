import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves under /Mighta/ — prod uses that base, dev keeps /.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Mighta/' : '/',
  plugins: [react(), tailwindcss()],
}))
