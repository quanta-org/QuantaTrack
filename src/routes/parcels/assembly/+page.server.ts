import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { addParcel, getParcel } from '$lib/parcels';

export const load = (async ({ locals, url }) => {
	// Redirect to login if user doesn't exist
	if (!locals.user) {
		let redirectUrl = new URL(url.origin);
		redirectUrl.pathname = '/login';
		redirectUrl.searchParams.append('redirect', url.pathname);
		throw redirect(302, redirectUrl.href);
	}

	return {
		user: locals.user
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	addKitAssembly: async (event: RequestEvent) => {
		// Fail if token invalid
		if (!event.locals.user) {
			return fail(401, { message: 'Access expired, please log back in.' });
		}

		const data = await event.request.formData();
		let parcels: App.Parcel[] = [];

		let trackingNumbers = data.getAll("trackingNumber").filter(n => n);
		let kitIds = data.getAll("kitID").filter(n => n);

		if(trackingNumbers.length == 0){
			return fail (400, { message: 'No kits added!' });
		}
		
		if(trackingNumbers.length != kitIds.length){
			return fail (400, { message: 'Could not add parcel, check form!' });
		}

		// Fail if user input is bad
		try {
			for(let i = 0; i < trackingNumbers.length; i++){
				parcels.push({
					uniqname: data.get('uniqname') as string,
					workstation: data.get('workstation') as string,
					client: data.get('client') as string,
					kitType: data.get('kitType') as string,
					kitID: kitIds[i] as string,
					trackingNumber: trackingNumbers[i] as string,
					trackingNumberOutbound: data.get('trackingNumberOutbound') as string,
				});
			}
		} catch (ex) {
			return fail(400, { message: 'Could not add parcel, check form!' });
		}

		try {
			for(let i = 0; i < trackingNumbers.length; i++){
				if(await getParcel(parcels[i].trackingNumber, "assembly")){
					return fail(400, { message: 'Parcel already in opening table!'});
				}

				await addParcel(parcels[i], "assembly");
			}

			return { success: true };
		} catch (err) {
			console.log(err);
			return fail(400, { message: 'Cannot connect to database!' });
		}
	}
};
