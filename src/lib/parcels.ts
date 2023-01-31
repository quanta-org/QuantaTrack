import oracledb from 'oracledb';
import { env } from '$env/dynamic/private';

export async function addParcel(parcel: App.Parcel, table: 'receipt' | 'opening' | 'assembly') {
	let connection = await oracledb.getConnection({
		user: env.DBUSER,
		password: env.DBUSERPASS,
		connectionString: env.DB
	});

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
	let parcel: App.Parcel;
	let connection = await oracledb.getConnection({
		user: env.DBUSER,
		password: env.DBUSERPASS,
		connectionString: env.DB
	});

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
	let parcels: App.Parcel[] = [];

	let connection = await oracledb.getConnection({
		user: env.DBUSER,
		password: env.DBUSERPASS,
		connectionString: env.DB
	});

	let result;
	let end = pageNumber * 50;
	let start = end - 50;
	if (filter && filter != '') {
		const sql = `select * from PARCELRECEIPT LEFT OUTER JOIN PARCELOPENING ON PARCELRECEIPT.TRACKING_INBOUND = PARCELOPENING.TRACKING_INBOUND WHERE PARCELRECEIPT.TRACKING_INBOUND LIKE '%' || :1 || '%' OFFSET :2 ROWS FETCH NEXT :3 ROWS ONLY`;
		result = await connection.execute(sql, [filter, start, end], {
			outFormat: oracledb.OUT_FORMAT_OBJECT
		});
	} else {
		const sql = `select * from PARCELRECEIPT LEFT OUTER JOIN PARCELOPENING ON PARCELRECEIPT.TRACKING_INBOUND = PARCELOPENING.TRACKING_INBOUND OFFSET :1 ROWS FETCH NEXT :2 ROWS ONLY`;
		result = await connection.execute(sql, [start, end], { outFormat: oracledb.OUT_FORMAT_OBJECT });
	}

	result.rows?.map((item: any) => {
		parcels.push({
			uniqname: item.ACTION_TECH_EMAIL,
			workstation: item.WORKSTATION_CODE,
			carrier: item.CARRIER,
			trackingNumber: item.TRACKING_INBOUND,
			routingLocation: item.PARCEL_ROUTING_CODE,
			date: item.ACTION_DATE_1 ?? item.ACTION_DATE,
			TCDI: item.TCDI,
			kitID: item.KIT_ID_NUMBER
		});
	});

	console.log("Successfully got parcels for page " + pageNumber);
	connection.close();
	return parcels;
}

export async function getParcelCount(filter: string | null = null) {
	// Get data from db
	let connection = await oracledb.getConnection({
		user: env.DBUSER,
		password: env.DBUSERPASS,
		connectionString: env.DB
	});

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
