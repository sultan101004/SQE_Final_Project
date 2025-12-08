// Vite config for React (CommonJS to avoid ESM interop issues on older Node/npm)
const { defineConfig } = require('vite')
const reactRefresh = require('@vitejs/plugin-react-refresh')

module.exports = defineConfig({
  plugins: [reactRefresh()],
  server: {
    host: '0.0.0.0',
    port: 5173, // avoid clashing with backend on 3000
    strictPort: true
  }
})
