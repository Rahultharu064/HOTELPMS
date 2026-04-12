import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1', // Use specific IPv4 to avoid localhost/WebSocket issues
    port: 5173,
    strictPort: true, // Fail if port is in use rather than trying next one
  },
});
