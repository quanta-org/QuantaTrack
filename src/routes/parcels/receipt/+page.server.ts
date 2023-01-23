import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import oracledb from 'oracledb';

export const prerender = false;

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

		let connection;

		try {
			connection = await oracledb.getConnection({
				user: env.DBUSER,
				password: env.DBUSERPASS,
				connectionString: env.DB
			});

			// Check if parcel already in table
			const sqlSearch = `SELECT TRACKING_INBOUND FROM ParcelReceipt WHERE TRACKING_INBOUND = :1`;
			let result = await connection.execute(sqlSearch, [parcel.trackingNumber], {
				outFormat: oracledb.OUT_FORMAT_OBJECT
			});
			if (result.rows?.length != 0) {
				console.log(result.rows);
				return fail(400, { message: 'Parcel already added!' });
			}

			// Insert data into table
			const sqlInsert = `INSERT INTO ParcelReceipt (ACTION_TECH_EMAIL, WORKSTATION_CODE, CARRIER, TRACKING_INBOUND, PARCEL_ROUTING_CODE) VALUES (:1, :2, :3, :4, :5)`;
			await connection.execute(sqlInsert, [
				parcel.uniqname,
				parcel.workstation,
				parcel.carrier,
				parcel.trackingNumber,
				parcel.routingLocation
			]);
			connection.commit();
			console.log('Pushed data to ParcelReceipt!');

			return { success: true };
		} catch (err) {
			console.log(err);
			return fail(400, { message: 'Cannot connect to database!' });
		}
	}
};
