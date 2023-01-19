import { redirect, type Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import jsonwebtoken from 'jsonwebtoken';

interface User {
	username: string;
	auth: boolean;
	iat: number;
	exp: number;
}

export const handle = (async ({ event, resolve }) => {
	const jwt = event.cookies.get('jwt');

	if (jwt) {
		try {
			let decoded = jsonwebtoken.verify(
				event.cookies.get('jwt') ?? '',
				env.JWTSECRETKEY ?? 'shhsecret'
			) as User;

			event.locals.user = decoded;
		} catch (e) {
			if (e instanceof jsonwebtoken.TokenExpiredError) {
				event.cookies.delete('jwt');
				event.locals.user = null;
				throw redirect(302, '/login');
			} else {
				console.log(e);
			}
		}
	}

	return resolve(event);
}) satisfies Handle;
