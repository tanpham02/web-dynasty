import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 1311, // you can replace this port with any port
  },
  preview: {
    port: 1311, // you can replace this port with any port
  },

  build: {
    chunkSizeWarningLimit: 1000, // Increase the limit to 1MB
  },

  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '~ assets': path.resolve(__dirname, 'src/assets'),
      '~ components': path.resolve(__dirname, 'src/components'),
      '~ routers': path.resolve(__dirname, 'src/routers'),
      '~ layout': path.resolve(__dirname, 'src/layout'),
    },
  },
})
