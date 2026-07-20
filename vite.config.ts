import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg', 'app-icon-512.png'],
      manifest: {
        name: 'CropWise Soil & Crop Portal',
        short_name: 'CropWise',
        description: 'Offline-first agronomic crop diagnostic portal for smallholder cooperatives.',
        theme_color: '#34701B',
        background_color: '#FAF7F0',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'app-icon-512.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'app-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 3000
  }
})
