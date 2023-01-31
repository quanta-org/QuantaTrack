import { getParcels, getParcelCount } from '$lib/parcels';
import { error, fail } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = ( async ({ locals, url }) => {
    // Redirect to login if user doesn't exist
	let redirectUrl = new URL(url.origin);
	redirectUrl.pathname = '/login';
	if (!locals.user) {
		redirectUrl.searchParams.append('redirect', url.pathname);
        throw error(400, "Unauthorized!")
	}

	// Redirect to login if unauthorized
	if (!locals.user.auth) {
		redirectUrl.searchParams.append('err', 'unauthorized');
		throw error(400, "Unauthorized!")
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
        return new Response(JSON.stringify({
            parcels: '[]',
            parcelCount: 0,
            error: 'Could not connect to db!'
        }));
	}

    return new Response(JSON.stringify({
        parcels: parcels,
        pageCount: Math.ceil(parcelCount / 50)
    }));
}) satisfies RequestHandler;