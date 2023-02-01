import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import basicSsl from '@vitejs/plugin-basic-ssl';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		SvelteKitPWA(),
		basicSsl()
	]
};

export default config;
