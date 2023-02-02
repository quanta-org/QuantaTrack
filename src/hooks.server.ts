import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import jsonwebtoken from 'jsonwebtoken';
import oracledb from 'oracledb';

await oracledb.createPool({
    user: env.DBUSER,
    password: env.DBUSERPASS,
    connectionString: env.DB
});

export const handle = (async ({ event, resolve }) => {
	const jwt = event.cookies.get('jwt');

	if (jwt) {
		try {
			let decoded = jsonwebtoken.verify(
				event.cookies.get('jwt') ?? '',
				env.JWTSECRETKEY ?? 'shhsecret'
			) as App.User;

			event.locals.user = decoded;
		} catch (e) {
			if (e instanceof jsonwebtoken.TokenExpiredError || e instanceof jsonwebtoken.JsonWebTokenError) {
				event.cookies.delete('jwt');
				event.locals.user = null;
			} else {
				console.log(e);
			}
		}
	}

	return resolve(event);
}) satisfies Handle;
