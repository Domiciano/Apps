import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import string from 'vite-plugin-string';
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  base: process.env.VITE_APP_BASE || '/apps/',
  plugins: [
    react(),
    string({
      include: ['**/*.md'],
    }),
    
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
