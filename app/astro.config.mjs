import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';
import dotenv from 'dotenv';

import tailwindcss from '@tailwindcss/vite';

dotenv.config();

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [react()],

  alias: {
    '@src': './src',
  },

  i18n: {
    locales: ['en', 'jp'],
    defaultLocale: 'jp',
    routing: {
      prefixDefaultLocale: true,
      exclude: ['/api/**'],
    },
  },

  imageService: 'imgix',
  platform: 'node',

  vite: {
    plugins: [tailwindcss()],
  },
});