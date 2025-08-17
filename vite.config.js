import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router', 'react-router-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          
          // Feature chunks
          'auth-features': [
            './src/components/Auth/Login.jsx',
            './src/components/Auth/Register.jsx',
            './src/contexts/AuthContext.jsx',
            './src/services/authService.js'
          ],
          'product-features': [
            './src/components/Products/ProductList.jsx',
            './src/components/Products/ProductForm.jsx',
            './src/services/productService.js'
          ],
          'cart-features': [
            './src/components/Cart/ShoppingCart.jsx',
            './src/services/orderService.js'
          ],
          'user-features': [
            './src/components/User/UserProfile.jsx',
            './src/components/Orders/OrderHistory.jsx',
            './src/services/userService.js'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true
  }
})
