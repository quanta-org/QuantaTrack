import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getParcels, getParcelCount } from '$lib/parcels';

export const load = (async ({ locals, url }) => {
	// Redirect to login if user doesn't exist
	let redirectUrl = new URL(url.origin);
	redirectUrl.pathname = '/login';
	if (!locals.user) {
		redirectUrl.searchParams.append('redirect', url.pathname);
		throw redirect(302, redirectUrl.href);
	}

	// Redirect to login if unauthorized
	if (!locals.user.auth) {
		redirectUrl.searchParams.append('err', 'unauthorized');
		throw redirect(302, redirectUrl.href);
	}
}) satisfies PageServerLoad;
