// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        chunkSizeWarningLimit: 1000, // Increase from 500kB to 1000kB
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
                    leaflet: ['leaflet', 'react-leaflet'],
                    i18n: ['i18next', 'react-i18next'],
                    icons: ['react-icons']
                }
            }
        }
    },
    server: {
        port: 3000,
        open: true
    }
})