import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/spotify-data/',
  build: {
    target: 'esnext'
  }
})
