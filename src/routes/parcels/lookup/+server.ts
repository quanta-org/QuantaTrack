import { getParcels, getParcelCount } from '$lib/parcels';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = ( async ({ locals, url }) => {
    // Error if user doesn't exist
	if (!locals.user) {
        throw error(400, "Unauthorized!")
	}

	// Error if unauthorized
	if (!locals.user.auth) {
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
	let [parcelsResult, parcelCountResult] = await Promise.allSettled([getParcels(pageNumber, filter), getParcelCount(filter)]);
	if(parcelsResult.status == "rejected" || parcelCountResult.status == "rejected") {
		return new Response(JSON.stringify({
            parcels: '[]',
            parcelCount: 0,
            error: 'Could not connect to db!'
        }));
	}

    return new Response(JSON.stringify({
        parcels: parcelsResult.value,
        pageCount: Math.ceil(parcelCountResult.value / 50)
    }));
}) satisfies RequestHandler;