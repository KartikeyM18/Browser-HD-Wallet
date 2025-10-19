import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), nodePolyfills()],
  define: {
    // This is required for the 'buffer' library to work correctly in the browser
    'global': {},
  },
  resolve: {
    alias: {
      // These are fallbacks for certain packages that might still try to import Node.js built-ins
      stream: "stream-browserify",
      util: "util",
    }
  }
})
