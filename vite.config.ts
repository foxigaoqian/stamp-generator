import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig(({ mode }) => ({
  plugins: [angular()],
  define: {
    // Safely expose API_KEY from Vercel environment variables to the client
    'process.env.API_KEY': JSON.stringify(process.env['API_KEY'] || '')
  }
}));