import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
    server: {
      host: '0.0.0.0',
      allowedHosts: ['pixelcrit.es', 'www.pixelcrit.es']
    }
  },
  adapter: node({
    mode: 'standalone'
  })
});