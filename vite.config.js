import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			manifest: {
				short_name: 'QTrack',
				name: 'Quanta Track',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				theme_color: '#FFCB05',
				background_color: '#00274C',
				icons: [
					{
						src: '/logos/pwa-192-192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/logos/pwa-512-512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/logos/pwa-512-512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
		})
	]
};

export default config;
