import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'global-builtin', 'color-functions']
      }
    }
  },
  server: {
    // Fallback para SPA - redireciona rotas não encontradas para index.html
    middlewareMode: false
  },
  preview: {
    // Garante que o preview também funcione corretamente para SPAs
    headers: {
      'Cache-Control': 'no-store'
    }
  }
})
