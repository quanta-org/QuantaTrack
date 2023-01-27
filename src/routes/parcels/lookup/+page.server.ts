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

	// Get request url
	let pageNumber = 1;
	if (url.searchParams.get('page')) {
		pageNumber = parseInt(url.searchParams.get('page') as string);
	}

	// Get filter
	let filter = url.searchParams.get('q') ?? '';

	// Get data from db
	let parcels: App.Parcel[];
	let parcelCount: number;
	try {
		parcels = await getParcels(pageNumber, filter);
		parcelCount = await getParcelCount(filter);
	} catch (err) {
		console.log(err);
		return {
			parcels: '[]',
			parcelCount: 0,
			error: 'Could not connect to db!'
		};
	}

	return {
		parcels: JSON.stringify(parcels),
		pageCount: Math.ceil(parcelCount / 50),
		filter
	};
}) satisfies PageServerLoad;
