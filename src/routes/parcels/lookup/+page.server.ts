import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import oracledb from 'oracledb';
import jsonwebtoken, { TokenExpiredError } from 'jsonwebtoken';
import { page } from '$app/stores';
export const prerender = false;

async function getParcels(pageNumber: number) {
	// Get data from db
	let connection;
	let parcels: any[] = [];

	connection = await oracledb.getConnection({
		user: env.DBUSER,
		password: env.DBUSERPASS,
		connectionString: env.DB
	});

	let result;
	if (pageNumber != 0) {
		let end = pageNumber * 50;
		let start = end - 50;
		const sql = `select * from PARCELRECEIPT LEFT OUTER JOIN PARCELOPENING ON PARCELRECEIPT.TRACKING_INBOUND = PARCELOPENING.TRACKING_INBOUND OFFSET :1 ROWS FETCH NEXT :2 ROWS ONLY`;
		result = await connection.execute(sql, [start, end], { outFormat: oracledb.OUT_FORMAT_OBJECT });
	} else {
		const sql = `select * from PARCELRECEIPT LEFT OUTER JOIN PARCELOPENING ON PARCELRECEIPT.TRACKING_INBOUND = PARCELOPENING.TRACKING_INBOUND`;
		result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
	}
	console.log('Received data from db!');

	parcels = result.rows as any[];
	await connection.close();

	return JSON.stringify(parcels);
}

async function getParcelCount() {
	// Get data from db
	let connection;
	let parcels: any[] = [];

	connection = await oracledb.getConnection({
		user: env.DBUSER,
		password: env.DBUSERPASS,
		connectionString: env.DB
	});

	let result;
	const sql = `select COUNT(*) from PARCELRECEIPT LEFT OUTER JOIN PARCELOPENING ON PARCELRECEIPT.TRACKING_INBOUND = PARCELOPENING.TRACKING_INBOUND`;
	result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
	await connection.close();

	let count = result.rows?.at(0) as any;
	return count['COUNT(*)'];
}

export const load = (async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(302, '/login?redirect=parcels%2Flookup');
	}

	if (!locals.user.auth) {
		throw redirect(302, '/login?err=unauthorized');
	}

	// Get request url
	let pageNumber = 1;
	if (url.searchParams.get('page')) {
		pageNumber = parseInt(url.searchParams.get('page') as string);
	}

	// Get data from db
	let parcelData: string;
	let parcelCount: number;
	try {
		parcelData = await getParcels(pageNumber);
		parcelCount = await getParcelCount();
	} catch (err) {
		console.log(err);
		return {
			parcels: '[]',
			parcelCount: 0,
			error: 'Could not connect to db!'
		};
	}

	return {
		parcels: parcelData,
		pageCount: Math.ceil(parcelCount / 50)
	};
}) satisfies PageServerLoad;
