import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { addParcel, getParcel } from '$lib/parcels';

export const load = (async ({ locals, url }) => {
	// Redirect to login if user doesn't exist
	if (!locals.user) {
		let redirectUrl = new URL(url.origin);
		redirectUrl.pathname = "/login";
		redirectUrl.searchParams.append("redirect", url.pathname);
		throw redirect(302, redirectUrl.href);
	}

	return {
		user: locals.user
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	addParcelReceipt: async (event: RequestEvent) => {
		// Fail if token invalid
		if (!event.locals.user) {
			return fail(401, { message: 'Access expired, please log back in.' });
		}

		const data = await event.request.formData();
		let parcel: App.Parcel;

		// Fail if user input is bad
		try {
			parcel = {
				uniqname: data.get('uniqname') as string,
				workstation: data.get('workstation') as string,
				carrier: data.get('carrier') as string,
				trackingNumber: data.get('trackingNumber') as string,
				routingLocation: data.get('routeLocation') as string
			};
		} catch (ex) {
			return fail(400, { message: 'Could not add parcel, check form!' });
		}

		try {
			if(await getParcel(parcel.trackingNumber, "receipt")){
				return fail(400, { message: 'Parcel already added!' });
			}

			await addParcel(parcel, "receipt");

			return { success: true };
		} catch (err) {
			console.log(err);
			return fail(400, { message: 'Cannot connect to database!' });
		}
	}
};
