import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_URL is process_name:package_name:publisher_node.
// It represents the URL where the UI will be served from.
// If your node is running on localhost, you will access the UI at http://localhost:3000/process_name:package_name:publisher_node.
// import manifest from '../pkg/manifest.json'
// import metadata from '../pkg/metadata.json'
// const BASE_URL = `${manifest.process_name}:${manifest.package}:${metadata.publisher}`
const BASE_URL = `/main:command_center:appattacc.os`

// This is the proxy URL, it must match the node you are developing against
// const PROXY_URL = (process.env.VITE_NODE_URL || 'http://127.0.0.1:8080').replace('localhost', '127.0.0.1');
const PROXY_URL = 'http://127.0.0.1:8080';

export default defineConfig({
  plugins: [react()],
  base: BASE_URL,
  build: {
    rollupOptions: {
      external: ['/our.js']
    }
  },
  server: {
    open: true,
    proxy: {
      // '/our' is an endpoint that simply serves your node's name via GET.
      '/our': {
        target: PROXY_URL,
        changeOrigin: true,
      },
      // 'our.js' is a js file containing information about your node, which will be used by your UI.
      [`${BASE_URL}/our.js`]: {
        target: PROXY_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(BASE_URL, ''),
      },
      // This route will match all other HTTP requests to the backend: when your ui makes a request to BASE_URL, it will be proxied to your node.
      [`^${BASE_URL}/(?!(@vite/client|src/.*|node_modules/.*|@react-refresh|$))`]: {
        target: PROXY_URL,
        changeOrigin: true,
      },
    }
  }
});
