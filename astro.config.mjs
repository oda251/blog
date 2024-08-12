import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: cloudflare({
		runtime: {
		mode: "local"
		}
	}),
	integrations: [tailwind(), react()],
	i18n: {
		locales: ["en", "jp"],
		defaultLocale: "jp",
		routing: {
			prefixDefaultLocale: true,
		}
	},
	imageService: 'imgix',
});
