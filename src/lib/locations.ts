import oracledb from "oracledb";

export async function getLocations() {
    let connection = await oracledb.getConnection();
    let locations: {name: string, value: string}[] = [];

    const sql = `SELECT * FROM ROUTING_LOCATIONS`;
    let result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    result.rows?.map((item: any) => {
        locations.push({name: item.DESCRIPTION, value: item.DESCRIPTION });
    });

    connection.close();

    return locations;
}