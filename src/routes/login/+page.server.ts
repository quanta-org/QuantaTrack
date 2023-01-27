import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import jsonwebtoken from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

export const load = (async ({ locals }) => {
	return {
		user: locals.user
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	login: async (event: RequestEvent) => {
		const data = await event.request.formData();
		const username = data.get('username');
		const password = data.get('password');

		let userdata = await event.fetch("https://slidetracker.med.umich.edu/trylogin", {
			 method: 'POST',
			 headers: {
				'Content-Type': 'application/json'
			 },
			 body: '{"uniqname":"' + username + '","password":"' + password + '"}'
		});

		if(await userdata.text() === 'no'){
			return fail(401, { message: 'Invalid username or password.' });
		}

		var token = jsonwebtoken.sign(
			{ username: username, auth: true },
			env.JWTSECRETKEY ?? 'shhsecret',
			{ expiresIn: '8h' }
		);

		event.cookies.set('jwt', token, { path: '/' });
		console.log('User ' + username + ' logged in.');

		if (
			event.url.searchParams.has('redirect') &&
			event.url.searchParams.get('redirect') !== 'null'
		) {
			throw redirect(302, event.url.searchParams.get('redirect') as string);
		}

		throw redirect(307, '/');
	},

	stationlogin: async (event: RequestEvent) => {
		const data = await event.request.formData();

		const stationid = data.get('stationid');
		var token = jsonwebtoken.sign(
			{ username: stationid, auth: false },
			env.JWTSECRETKEY ?? 'shhsecret',
			{ expiresIn: '8h' }
		);

		event.cookies.set('jwt', token);
		console.log('Station ' + stationid + ' logged in.');

		if (
			event.url.searchParams.get('redirect') &&
			event.url.searchParams.get('redirect') !== 'null'
		) {
			throw redirect(302, event.url.searchParams.get('redirect') as string);
		}

		throw redirect(302, '/');
	},

	logout: async (event: RequestEvent) => {
		console.log('User ' + event.locals.user?.username + ' logged out.');
		event.cookies.delete('jwt');
		event.locals.user = null;

		return { success: true };
	}
};
