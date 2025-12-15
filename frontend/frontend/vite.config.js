import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  build: {
    // Increase the limit to 1000 KB (1 MB) to stop the warning
    // NOTE: This doesn't fix performance, just hides the warning.
    chunkSizeWarningLimit: 1000, 
  }

})