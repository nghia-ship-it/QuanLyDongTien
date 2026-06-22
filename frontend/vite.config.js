import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Quản Lý Dòng Tiền',
        short_name: 'Dòng Tiền',
        theme_color: '#14a064',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Tao lấy tạm icon cái ví tiền trên mạng cho mượt
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})