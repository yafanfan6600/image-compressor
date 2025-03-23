import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 判断是否是 GitHub Pages 环境
const isGitHubPages = process.env.GITHUB_ACTIONS || false

// https://vitejs.dev/config/
export default defineConfig({
  base: isGitHubPages ? '/image-compressor/' : '/',
  plugins: [react()],
  optimizeDeps: {
    include: ['react-dropzone']
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
}) 