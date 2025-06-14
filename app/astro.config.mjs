import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind(), react()],
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
});
