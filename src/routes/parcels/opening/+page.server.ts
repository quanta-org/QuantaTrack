import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { env } from '$env/dynamic/private';
import oracledb from 'oracledb';
import { fail, redirect } from '@sveltejs/kit';

export const prerender = false;

export const load = (async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/login?redirect=parcels%2Fopening');
	}

	return {
		user: locals.user
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	addParcelOpening: async (event: RequestEvent) => {
		// Fail if token invalid
		if (!event.locals.user) {
			return fail(401, { message: 'Access expired, please log back in.' });
		}

		const data = await event.request.formData();
		const user = data.get('user');
		const workstationCode = data.get('workstationCode');
		const trackNumber = data.get('trackNumber');
		const TCDI = data.get('tcdi');
		const kitID = data.get('kitID');
		let connection;

		try {
			connection = await oracledb.getConnection({
				user: env.DBUSER,
				password: env.DBUSERPASS,
				connectionString: env.DB
			});

			// Check if parcel already in table
			const sqlSearch = `SELECT TRACKING_INBOUND FROM ParcelOpening WHERE TRACKING_INBOUND = :1`;
			let result = await connection.execute(sqlSearch, [trackNumber], {
				outFormat: oracledb.OUT_FORMAT_OBJECT
			});
			if (result.rows) {
				return fail(400, { message: 'Parcel already added!' });
			}

			// Insert data into table
			const sql = `INSERT INTO ParcelOpening (ACTION_TECH_EMAIL, WORKSTATION_CODE, TRACKING_INBOUND, TCDI, KIT_ID_NUMBER) VALUES (:1, :2, :3, :4, :5)`;
			await connection.execute(sql, [user, workstationCode, trackNumber, TCDI, kitID]);
			connection.commit();
			console.log('Pushed data to OpeningReceipt!');

			return { success: true };
		} catch (err) {
			console.log(err);
			return fail(400, { message: 'Cannot connect to database!' });
		}
	}
};
