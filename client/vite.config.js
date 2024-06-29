import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://mern-estate-srrh.onrender.com',
        secure: false
      }
    }
  },


  plugins: [react()],
})
