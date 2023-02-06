import oracledb from 'oracledb';
import type { Parcel } from '$lib/types';

export async function addParcel(parcel: Parcel, table: 'receipt' | 'opening' | 'assembly') {
	let connection = await oracledb.getConnection();

	if (table === 'receipt') {
		let sql = `INSERT INTO ParcelReceipt (ACTION_TECH_EMAIL, WORKSTATION_CODE, CARRIER, TRACKING_INBOUND, PARCEL_ROUTING_CODE) VALUES (:1, :2, :3, :4, :5)`;
		await connection.execute(sql, [
			parcel.uniqname,
			parcel.workstation,
			parcel.carrier,
			parcel.trackingNumber,
			parcel.routingLocation
		]);
	} else if (table === 'opening') {
		let sql = `INSERT INTO ParcelOpening (ACTION_TECH_EMAIL, WORKSTATION_CODE, TRACKING_INBOUND, TCDI, KIT_ID_NUMBER) VALUES (:1, :2, :3, :4, :5)`;
		await connection.execute(sql, [
			parcel.uniqname,
			parcel.workstation,
			parcel.trackingNumber,
			parcel.TCDI,
			parcel.kitID
		]);
	} else if (table === 'assembly') {
		let sql = `INSERT INTO ParcelAssembly (ACTION_TECH_EMAIL, WORKSTATION_CODE, CLIENT, CARRIER, MATERIAL_NAME, MATERIAL_BARCODE, TRACKING_INBOUND, TRACKING_OUTBOUND, CLINIC_CODE) VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9)`;
		await connection.execute(sql, [
			parcel.uniqname,
			parcel.workstation,
			parcel.client,
			parcel.carrier,
			parcel.kitType,
			parcel.kitID,
			parcel.trackingNumber,
			parcel.trackingNumberOutbound,
			parcel.clinicCode
		]);
	}

	connection.commit();
	connection.close();
	console.log("Successfully added parcel " + parcel.trackingNumber + " to " + table);
}

export async function getParcel(trackingNumber: string, table: 'receipt' | 'opening' | 'assembly') {
	let parcel: Parcel;
	let connection = await oracledb.getConnection();

	let sqlSearch;
	if (table === 'receipt') {
		sqlSearch = `SELECT * FROM ParcelReceipt WHERE TRACKING_INBOUND = :1`;
	} else if (table === 'opening') {
		sqlSearch = `SELECT * FROM ParcelOpening WHERE TRACKING_INBOUND = :1`;
	} else {
		sqlSearch = `SELECT * FROM ParcelAssembly WHERE TRACKING_INBOUND = :1`;
	}

	let result = await connection.execute(sqlSearch, [trackingNumber], {
		outFormat: oracledb.OUT_FORMAT_OBJECT
	});

	let item: any = await result.rows?.at(0);

	if (!item) {
		return null;
	}

	parcel = {
		uniqname: item.ACTION_TECH_EMAIL,
		workstation: item.WORKSTATION_CODE,
		carrier: item.CARRIER,
		trackingNumber: item.TRACKING_INBOUND,
		routingLocation: item.PARCEL_ROUTING_CODE,
		date: item.ACTION_DATE,
		TCDI: item.TCDI,
		kitID: item.KIT_ID_NUMBER
	};

	connection.close();
	console.log("Successfully got parcel " + parcel.trackingNumber);

	return parcel;
}

export async function getParcels(pageNumber: number = 1, filter: string = '') {
	// Get data from db
	let parcels: Parcel[] = [];

	let connection = await oracledb.getConnection();

	let result;
	let end = pageNumber * 50;
	let start = end - 50;
	if (filter && filter != '') {
		const sql = `select * from PARCELASSEMBLY FULL OUTER JOIN PARCELRECEIPT ON PARCELRECEIPT.TRACKING_INBOUND = PARCELASSEMBLY.TRACKING_INBOUND FULL OUTER JOIN PARCELOPENING ON PARCELOPENING.TRACKING_INBOUND = PARCELASSEMBLY.TRACKING_INBOUND WHERE PARCELASSEMBLY.TRACKING_INBOUND LIKE '%' || :1 || '%' ORDER BY PARCELASSEMBLY.ACTION_DATE OFFSET :2 ROWS FETCH NEXT :3 ROWS ONLY`;
		result = await connection.execute(sql, [filter, start, end], {
			outFormat: oracledb.OUT_FORMAT_OBJECT
		});
	} else {
		const sql = `select * from PARCELASSEMBLY FULL OUTER JOIN PARCELRECEIPT ON PARCELRECEIPT.TRACKING_INBOUND = PARCELASSEMBLY.TRACKING_INBOUND FULL OUTER JOIN PARCELOPENING ON PARCELOPENING.TRACKING_INBOUND = PARCELASSEMBLY.TRACKING_INBOUND ORDER BY PARCELASSEMBLY.ACTION_DATE OFFSET :1 ROWS FETCH NEXT :2 ROWS ONLY`;
		result = await connection.execute(sql, [start, end], { outFormat: oracledb.OUT_FORMAT_OBJECT });
	}

	result.rows?.reverse().forEach((item: any) => {
		parcels.push({
			status: item.ACTION_DATE_2 ? "Opened" : item.ACTION_DATE_1 ? "Received" : "Assembled",
			uniqname: item.ACTION_TECH_EMAIL ?? item.ACTION_TECH_EMAIL_1 ?? item.ACTION_TECH_EMAIL_2,
			workstation: item.WORKSTATION_CODE ?? item.WORKSTATION_CODE_1 ?? item.WORKSTATION_CODE_2,
			carrier: item.CARRIER ?? item.CARRIER_1 ?? item.CARRIER_2,
			trackingNumber: item.TRACKING_INBOUND ?? item.TRACKING_INBOUND_1 ?? item.TRACKING_INBOUND_2,
			routingLocation: item.PARCEL_ROUTING_CODE ?? item.PARCEL_ROUTING_CODE_1 ?? item.PARCEL_ROUTING_CODE_2,
			date: item.ACTION_DATE ?? item.ACTION_DATE_1 ?? item.ACTION_DATE_2,
			TCDI: item.TCDI ?? item.TCDI_1 ?? item.TCDI_2,
			kitID: item.MATERIAL_BARCODE ?? item.KIT_ID_NUMBER_1 ?? item.KIT_ID_NUMBER_2
		});
	});

	console.log("Successfully got parcels for page " + pageNumber);
	connection.close();
	return parcels;
}

export async function getParcelCount(filter: string | null = null) {
	// Get data from db
	let connection = await oracledb.getConnection();

	let result;
	if (filter && filter != '') {
		let sql = `select COUNT(*) from PARCELRECEIPT LEFT OUTER JOIN PARCELOPENING ON PARCELRECEIPT.TRACKING_INBOUND = PARCELOPENING.TRACKING_INBOUND WHERE PARCELRECEIPT.TRACKING_INBOUND LIKE '%' || :1 || '%'`;
		result = await connection.execute(sql, [filter], { outFormat: oracledb.OUT_FORMAT_OBJECT });
	} else {
		let sql = `select COUNT(*) from PARCELRECEIPT LEFT OUTER JOIN PARCELOPENING ON PARCELRECEIPT.TRACKING_INBOUND = PARCELOPENING.TRACKING_INBOUND`;
		result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
	}

	connection.close();
	let count: any = result.rows?.at(0);
	console.log("Successfully got " + count['COUNT(*)'] + " parcels");
	return count['COUNT(*)'];
}
